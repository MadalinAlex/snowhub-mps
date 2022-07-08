var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

var indexRouter = require('./routes/index');

const users = require('./routes/users')
const slopes = require('./routes/slopes')
const reports = require('./routes/reports')
const interactions = require('./routes/interactions')
const scores = require('./routes/scores')
const history = require('./routes/history')

var app = express();
app.use(bodyParser.json());

// Databse config
const db = require('./config/keys').mongoURI;

// Connect to Database
mongoose.connect(db,  { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MongoDB connected."))
        .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', users);
app.use('/slopes', slopes);
app.use('/reports', reports);
app.use('/interactions', interactions);
app.use('/scores', scores);
app.use('/history', history)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// app.listen("8000", function(req, res) {console.log("Server is up and running on port 8000.")})
module.exports = app;
