const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/keys').JWT_KEY;
const User = require('../models/User');
const getDecodedData = require('../middleware/get-data-jwt');
const checkAdminAuth = require('../middleware/check-admin-auth')
var http = require('http');

const router = express.Router();
const saltRounds = 10;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'opennssnow@gmail.com',
    pass: 'opensnowdev'
  }
});

/* GET users listing. */
router.get('/', function(req, res) {
  User.find()
  .then(users => res.json(users));
});

/* GET user data */
router.get('/currentUser', function(req, res) {
  const decoded = getDecodedData(req.headers.authorization);
  // If the token couldn't be decoded (e.g. invalid token after restarting server)
  if (decoded == null) {
    return res.status(401).json({error: "Not authorized!"});
  }
  User.find({ _id: decoded.userId})
  .then(users => res.json({
    firstName: users[0].firstName,
    lastName: users[0].lastName,
    email: users[0].email
  }))
  .catch(err => res.status(400).json({error: "Bad request"}));
});

router.post('/changepass', function(req, res) {
  const decoded = getDecodedData(req.headers.authorization);
  let email = decoded.email
  let oldPass = req.body.oldPassword
  let newPass = req.body.newPassword
  User.find({ email: email})
  .exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(401).json({
        message: 'It seems like you don\'t have an account, wanna sign up?'
      });
    }

    bcrypt.compare(oldPass, user[0].password, function(err, result) {
      if (result === true) {
        var mailOptions = {
          from: 'Open Snow <openssnnow@gmail.com>',
          to: email,
          subject: 'Your password was changed',
          text: 'You just changed your password!'
        };

        bcrypt.hash(newPass, saltRounds, function(err, hash) {
          user[0].password = hash
          user[0].save()
          .then(user => {
            transporter.sendMail(mailOptions, function(err, info) {
              if (err) {
                console.log(error)
              } else {
                console.log('Email sent: ' + info.response)
                return res.status(200).json({
                  message: 'Your password has been changed.'
                });
              }
            })
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
        });
      } else {
        return res.status(401).json({message: 'Auth failed'});
      }
    });
  })
  .catch(err => res.status(500).json({error: err}));
});

router.post('/forgotpass', function(req, res) {
  User.find({ email: req.body.email })
  .exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(401).json({message: 'It seems like you don\'t have an account, wanna sign up?'});
    }
    let newPass = ""
    for (let i = 0; i < 8; i++) {
      newPass += parseInt(Math.floor(Math.random() * 9) + 0)
    }
    var mailOptions = {
      from: 'Open Snow <openssnnow@gmail.com>',
      to: user[0].email,
      subject: 'Your password was reset',
      text: 'Your new password: ' + newPass
    };
    bcrypt.hash(newPass, saltRounds, function(err, hash) {
      // Update hash in your password DB.
      user[0].password = hash
      user[0].save()
      .then(user => {
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({message: 'We sent you an email with instructions to reset your password.'});
          }
        });
      })
      .catch(err => res.status(500).json({error: err}));
    });
  })
  .catch(err => res.status(500).json({error: err}));
});

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
  .exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(401).json({message: 'Wrong email or password!'});
    }
    let successFullLogin
    // Load hash from your password DB.
    bcrypt.compare(req.body.password, user[0].password, function(err, result) {
      if (result === true) {
        let token = null;
        // Different tokens for admin and normal users
        if (user[0].isAdmin) {
          token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id,
            isAdmin: user[0].isAdmin
          }, jwtSecret, {
            // Never expire
          });
        } else {
          token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id,
            isAdmin: user[0].isAdmin
          }, jwtSecret, {
            expiresIn: "1h"
          });
        }
        return res.status(202).json({
          message: 'Successful authentication!',
          firstName: user[0].firstName,
          token: token
        });
      } else {
        return res.status(401).json({message: 'Wrong email or password!'});
      }
    });
  })
  .catch(err => res.status(500).json({error: err}));
});

function setScoreForNewUser(token) {
  var scoreEndPointPath = '/scores';

  var request = new http.ClientRequest({
    hostname: "127.0.0.1",
    port: 6000,
    path: scoreEndPointPath,
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }
  });

  request.end();
}

function initializeScore(email, password) {
  var loginEndPointPath = '/users/login';
  var body = JSON.stringify({"email": email, "password": password});
  
  var request = new http.ClientRequest({
    hostname: "127.0.0.1",
    port: 6000,
    path: loginEndPointPath,
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
    }
  });
  request.end(body);
  
  request.on('response', function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      let data = JSON.parse(chunk);
      setScoreForNewUser(data.token);
    });
  });

}

router.post('/', function(req, res) {
  User.find({ email: req.body.email })
  .exec()
  .then(user => {
    if (user.length > 0) {
      return res.status(409).json({ message: 'Email already exists.'})
    } else {
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const newUser = new User({
          email: req.body.email,
          password: hash,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          isAdmin: req.body.isAdmin
        });
        newUser.save().then(user => {
          initializeScore(req.body.email, req.body.password);
          var mailOptions = {
            from: 'Open Snow <openssnnow@gmail.com>',
            to: newUser.email,
            subject: 'You just signed up!',
            text: 'A new account has been created on SnowHub!'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              return res.json(user)
            }
          });
        })
        .catch(function(err) {
          res.status(500).json({
            error: err,
            message: 'Mandatory field is missing.'
          });
        });
      });
    }
  })
  .catch(err => res.status(500).json({error: err}));
});

router.delete("/:id", checkAdminAuth, function(req, res) {
  User.findById(req.params.id)
  .then(user => user.remove().then(
    () => res.json({success:true})
  ))
  .catch(err => res.status(404).json({success:false}))
});

module.exports = router;
