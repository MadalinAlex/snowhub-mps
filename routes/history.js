const express = require("express");
const History = require("../models/History");

const checkAuth = require("../middleware/check-auth");
const getDecodedData = require("../middleware/get-data-jwt");

const router = express.Router();

router.get("/", checkAuth, function (req, res) {
  const decoded = getDecodedData(req.headers.authorization);
  const user_id = decoded.userId;
  History.find({ user_id: user_id }).then((history) => res.json(history));
});

module.exports = router;
