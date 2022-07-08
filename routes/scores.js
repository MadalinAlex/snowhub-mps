var express = require('express');
const Score = require('../models/Score');
const checkAuth = require('../middleware/check-auth')
const getDecodedData = require('../middleware/get-data-jwt');

var router = express.Router();

router.get('/', function(req, res) {
    Score.find()
    .then(scores => res.json(scores));
});

router.get('/byUser', checkAuth, function(req, res) {
    const decoded = getDecodedData(req.headers.authorization);
    const user_id = decoded.userId;
    Score.find({ user_id: user_id})
    .then(score => res.json(score));
});

router.put('/:points', checkAuth, function(req, res) {
    const decoded = getDecodedData(req.headers.authorization);
    const user_id = decoded.userId;
    Score.find({ user_id: user_id})
    .then(score => {
        if (score.length !== 1) {
            return res.status(401).json({ message: "Invalid user" });
        }
        score[0].score = Number(Number(score[0].score) + Number(req.params.points));
        score[0].save()
        .catch(err => res.status(500).json({error: err}));
        return res.json(score);
    })
    .catch(err => res.status(500).json({error: err}));
});

router.post('/', checkAuth, function(req, res) {
    const decoded = getDecodedData(req.headers.authorization);
    const user_id = decoded.userId;

    Score.find({ user_id: user_id})
    .exec()
    .then(score => {
        if (score.length > 0) {
            return res.status(409).json({ message: 'This score already exists.'})
        } else {
            const newScore = new Score({
                user_id: user_id
            });
            newScore.save().then(score => res.json(score))
        }
    })
    .catch(err => res.status(500).json({error: err}));
});

module.exports = router;