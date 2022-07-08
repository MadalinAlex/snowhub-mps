var express = require('express');
var cron = require('node-cron');
const Report = require('../models/Report');
const Slope = require('../models/Slope');

var router = express.Router();

/**
 * Remove reports with negative votes
 * TODO: Improve this because it might become heavy
 */
cron.schedule('* * * * *', () => {
  Report.find()
  .then(reports => {
    reports.forEach(report => {
      if (report.counter < -2) {
        var allSlopes;
        Slope.find({}, function(err, slopes) {
          allSlopes = slopes;
          allSlopes.forEach(function(val, idx) {
            var currentReports = val.reports;
            currentReports.forEach(function(value, index) {
              if (value == report.id) {
                var slopeId = val.id;
                var reportId = value;
                // Generate admin auth header
                var path = '/reports/' + reportId;
                var adminToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9wZW5uc3Nub3dAZ21haWwuY29tIiwidXNlcklkIjoiNWZlYjVjOGUxODIxNTRlMmI3ZTgxNWVkIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjExMTM4MDY3fQ.RqHtgYs8dfWqW6W2KSKaf4LEvPiJMc7oBzS2PLYibcM"; 
                // Remove report through endpoint
                var http = require('http');
                var body = JSON.stringify({"slope_id": slopeId});
                var request = new http.ClientRequest({
                  hostname: "127.0.0.1",
                  port: 6000,
                  path: path,
                  method: "DELETE",
                  headers: {
                      "Content-Type": "application/json",
                      "Content-Length": Buffer.byteLength(body),
                      "Authorization": adminToken
                  }
                });
                request.end(body);
                request.on('response', function (response) {
                  console.log('STATUS: ' + response.statusCode);
                  response.setEncoding('utf8');
                  response.on('data', function (chunk) {
                    console.log('BODY: ' + chunk);
                  });
                });
              }
            });
          });
        });
      }
    });
  })
  .catch(err => console.log("Error: " + err))
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
