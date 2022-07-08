const express = require('express');
const Report = require('../models/Report');
const Slope = require('../models/Slope');
const User = require('../models/User');
const Interaction = require('../models/Interaction');
const History = require('../models/History');
const checkAuth = require('../middleware/check-auth')
const checkAdminAuth = require('../middleware/check-admin-auth')
const getDecodedData = require('../middleware/get-data-jwt');

const router = express.Router();

router.get('/', function(req, res) {
  Report.find()
  .then(reports => res.json(reports));
});

router.get('/byUser', checkAuth, function(req, res) {
  const decoded = getDecodedData(req.headers.authorization);
  const user_id = decoded.userId;
  Report.find({ user_id: user_id})
  .then(reports => res.json(reports));
});

router.post('/', checkAuth, function(req, res) {
  const slope_id = req.body.slope_id;
  const decoded = getDecodedData(req.headers.authorization);
  const user_id = decoded.userId;
  User.find({_id: user_id})
  .exec()
  .then(user => {
    if (user.length !== 1) {
      return res.status(401).json({message: 'Invalid user.'});
    }
    const newReport = new Report({
      type: req.body.type,
      description: req.body.description,
      user_id: user_id
    });

    Slope.find({_id: slope_id})
    .exec()
    .then(slope => {
      if (slope.length !== 1) {
        return res.status(401).json({
          message: 'Invalid slope.'
        });
      }
      slope[0].reports.push(newReport._id)
      slope[0].save()
      .catch(err => res.status(500).json({
        error: err,
        message: 'Mandatory field is missing.'
      }));

      const newHistory = new History({
        type: req.body.type,
        description: req.body.description,
        user_id: user_id,
        slopeName: slope[0].name,
      });

      newHistory
        .save()
        .catch((err) =>
          res.status(500).json({
            error: err,
            message: "History field is missing.",
          })
        );


    })
    .catch(err => res.status(500).json({error: err}));

    var scoreEndPointPath = '/scores/3';

    var http = require('http');
    var request = new http.ClientRequest({
      hostname: "127.0.0.1",
      port: 6000,
      path: scoreEndPointPath,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.authorization,
      },
    });

    request.end();

    newReport.save()
    .then(report => res.json(report))
    .catch(err => res.status(500).json({
      error: err,
      message: 'Mandatory field is missing.'
    }));
  })
  .catch(err => res.status(500).json({error: err}));
});

router.delete("/:id", checkAdminAuth, function(req, res) {
  const slope_id = req.body.slope_id
  const report_id = req.params.id
  Slope.find({_id: slope_id})
  .exec()
  .then(slope => {
    if (slope.length !== 1) {
      return res.status(401).json({
        message: 'Invalid slope.'
      });
    }
    const index = slope[0].reports.indexOf(report_id);
    if (index > -1) {
      slope[0].reports.splice(index, 1);
    }
    slope[0].save()
    .catch(function(err) {
      res.status(500).json({
        error: err,
        message: 'Mandatory field is missing.'
      });
    });
  })
  .catch(err => res.status(500).json({error: err}));

  Interaction.find({report_id: report_id})
  .then(interactions => {
    interactions.forEach(function(interaction, index) {
      interaction.remove()
      .catch(err => res.status(500).json({error: err}));
    });
  })

  Report.findById(report_id)
  .then(report => report.remove().then(
    () => res.json({success:true})
  ))
  .catch(err => res.status(404).json({success:false}))
});

module.exports = router;
