var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());

app.get('/home',
  function(req, res) {
    console.log("in");
    res.render('home', { user: req.user });
 
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    console.log("in passport function");
    res.redirect('/index');
  });
var index = require('./routes/index');
var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');

var db = require('./routes');


var mongodb = require('mongodb');
var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017',{
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const nodemailer = require("nodemailer");
const fs = require('fs');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.post('/sedinta', function (req, res) {
  dbConn.then(function(db) {
      delete req.body._id; 
      db.collection('rezervari').insertOne(req.body);
  });    
  
  res.send('Date primite:\n' + JSON.stringify(req.body));
});
app.get('/view',  function(req, res) {
  dbConn.then(function(db) {
      db.collection('rezervari').find({}).toArray().then(function(rezervari) {
          res.status(200).json(rezervari);
      });
  });
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.get('/despremine', function(req, res){
      res.render('despremine');
});
app.get('/index', function(req, res){
  res.render('index');
});
app.get('/blog', function(req, res){
  res.render('blog');
});
app.get('/planificare', function(req, res){
  res.render('planificare');
});
app.get('/parcurs', function(req, res){
  res.render('parcurs');
});
app.get('/succes', function(req, res){
  res.render('succes');
});

app.get('/login',
  function(req, res){
    res.render('login');
  });



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

module.exports = app;
