var express = require('express');
const Interaction = require('../models/Interaction');
const User = require('../models/User');
const Report = require('../models/Report');
const checkAuth = require('../middleware/check-auth')
const getDecodedData = require('../middleware/get-data-jwt');

var router = express.Router();

router.get('/:report_id', checkAuth, async (req, res, next) => {
    let interactionUser;
    let interactionReport;
    const decoded = getDecodedData(req.headers.authorization);
    const user_id = decoded.userId;

    await User.findById(user_id)
    .exec()
    .then(user => interactionUser = user)
    .catch(err => res.status(400).json({success:false}));

    await Report.findById(req.params.report_id)
    .exec()
    .then(report => interactionReport = report)
    .catch(err => res.status(400).json({success:false}));

    Interaction.findOne({ user_id: interactionUser.userId, report_id: interactionReport.reportId})
    .then(interaction => res.json(interaction))
})

function increasePoints(auth) {
    var scoreEndPointPath = '/scores/2';

    var http = require('http');
    var request = new http.ClientRequest({
      hostname: "127.0.0.1",
      port: 6000,
      path: scoreEndPointPath,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth,
      },
    });

    request.end();
}

router.post('/', checkAuth, async (req, res, next) => {
    const report_id = req.body.report_id;
    const decoded = getDecodedData(req.headers.authorization);
    const user_id = decoded.userId;

    Interaction.find({user_id: user_id, report_id: report_id})
    .exec()
    .then(interaction => {
        let isLike = false;
        if (req.body.isLike == 1) {
            isLike = true;
        }
        // If interaction is new
        if (interaction.length === 0) {            
            const newInteraction = new Interaction({
                isLike: isLike,
                user_id: user_id,
                report_id: report_id
            });
            newInteraction.save()
            .then(interaction => {
                Report.find({_id: report_id})
                .exec()
                .then(report => {
                    if (isLike) {
                        let userId = report[0].user_id
                        Score.find({user_id: userId})
                        .exec()
                        .then(score => {
                            score[0].score += 1
                            score[0].save()
                            .then(score => {
                                report[0].counter += 1;
                                report[0].save()
                                .then(res.json(interaction));
                            })           
                        })
                        .catch(err => res.status(500).json({error: err})) 
                    } else {
                        report[0].counter -= 1;
                        report[0].save()
                        .then(report => {
                            if (report.counter <= -3) {
                                increasePoints(req.headers.authorization)
                            }
                            res.json(interaction); 
                        });
                    }
                    
                })
                .catch(err => res.status(500).json({error: err}));
            })
            .catch(err => res.status(500).json({error: err}));
        } else if (interaction.length === 1) {
            // Check if user have already done this interaction
            if (interaction[0].isLike == isLike) {
                // A user can not press like/dislike more than once
                res.status(409).json({message: "Button already pressed."});
            } else {
                // If user doesn't make the same interaction as previously
                let counter_amount = 0;
                // Check if user likes after he pressed unlike previously
                if (isLike === true && interaction[0].isLike === false) {
                    // Report counter should increase by 2
                    counter_amount = 2;
                } else if (isLike === false && interaction[0].isLike === true) {
                    // If user dislikes after he pressed like previously
                    // Report counter should decrease by 2
                    counter_amount = -2;
                } else if (isLike === true) {
                    // Report counter should increase by 1
                    counter_amount = 1;
                } else {
                    // Report counter should decrease by 1
                    counter_amount = -1;
                }
                interaction[0].isLike = isLike;
                interaction[0].save()
                .then(interaction => {
                    Report.find({_id: report_id})
                    .exec()
                    .then(report => {
                        report[0].counter += counter_amount;
                        report[0].save();
                        if (report[0].counter <= -3) {
                            increasePoints(req.headers.authorization)
                        }
                        res.json(interaction);
                    })
                    .catch(err => res.status(500).json({error: err}));
                })
                .catch(err => res.status(500).json({error: err}));
            }
        } else {
            res.status(500).json({message: 'Interaction error.'})
        }
    })
    .catch(err => res.status(500).json({error: err}));
})

router.delete('/:report_id', function(req, res) {
    Interaction.find({report_id: req.params.report_id})
    .exec()
    .then(interactions => interactions.forEach(interaction => {
        interaction.remove()
    }).then(() => res.json({success: true})))
    .catch(err => res.status(500).json({error: err}));
})

module.exports = router;
