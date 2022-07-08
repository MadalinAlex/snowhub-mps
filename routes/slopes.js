var express = require('express');
const Slope = require('../models/Slope');
const Report = require('../models/Report');
const checkAdminAuth = require('../middleware/check-admin-auth')
const checkRange = require('../middleware/check_range')

var router = express.Router();

router.get('/', function (req, res) {
    Slope.find()
    .then(slopes => res.json(slopes));
});

router.get('/:id', function (req, res) {
  let reports = []
  Slope.findById(req.params.id)
  .then(slope => {
    slope.reports.forEach(function(val, index) {
      Report.findById(val)
      .then(report => {
        reports.push(report)
        if (index === slope.reports.length - 1) {
          res.json(reports)
        }
      })
    });
  })
  .catch(err => res.status(404).json({success: false}));
});

router.get('/:latitude/:longitude', async (req, res) => {
  const latitude = req.params.latitude;
  const longitude = req.params.longitude;
  const maximumAllowedDistance = 5.0;

  let filteredSlopes = []

  await Slope.find()
  .then(slopes => {
    slopes.forEach(function(val, index) {
      if (checkRange(latitude, longitude, val.latitude, val.longitude) <= maximumAllowedDistance) {
        filteredSlopes.push(val);
      }
    })
  })
  .catch(err => res.status(404).json({success: false, message: err.message}));

  res.json(filteredSlopes);
});

router.post('/', checkAdminAuth,function (req, res) {
    Slope.find({ name: req.body.name })
    .exec()
    .then(slope => {
      if (slope.length > 0) {
        return res.status(409).json({ message: 'This slope already exists.'})
      } else {
        const newSlope = new Slope({
          name: req.body.name,
          latitude: req.body.latitude,
          longitude: req.body.longitude
        });
        newSlope.save().then(slope => res.json(slope))
        .catch(function(err) {
          res.status(500).json({
            error: err,
            message: 'Mandatory field is missing.'
          });
        });
      }
    })
    .catch(err => res.status(500).json({error: err}));
});

router.delete('/:id', checkAdminAuth, function(req, res) {
  Slope.findById(req.params.id)
  .then(slope => {
    slope.remove().then( 
      () => res.json({success: true})
      )
  })
  .catch(err => res.status(500).json({error: "Failed to process the request"}));
});

module.exports = router;
