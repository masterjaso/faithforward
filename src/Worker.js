//Include libraries for use
const util = require('util');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('busboy-body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const fs = require('fs');

const SetupDB = require('./libs/SetupDB');
var setDB = new SetupDB();
const passport = require('./libs/PassportConfig');

process.env.IP = require('./libs/addy');
process.env.PORT = process.env.PORT || 8080;
process.env.sessionSecret = 'InChristAlone'

//Declare express application variable
var app = express();

try{ startServer();}
catch(err){
  console.log('startServer ERROR:', err);
  return;
}

async function startServer(){
  //Setup application database
  var db;

  try{ 
    let pools = await setDB.init(); 
    db = pools[0];
  }
  catch(err){
    console.log('Error setting up MongoDB pools', err);
    return;
  }

  //view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  //Application configuration
  app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser());
  app.use(session({
    secret: process.env.sessionSecret,
    saveUninitialized: false,
    resave: false,
    secret: process.env.sessionSecret,
    maxAge: 30 * 60 * 1000,
    store: new MongoStore({db: db, collection: 'ff_sessions'})
  }));
  app.use(flash());
  app.use(express.static(path.join(__dirname, 'public')));


  //Core Middleware
  app.use('*', function(req, res, next){
    //Set flash message and clear buffer in any
    req.flashMsg = req.flash('msg').pop();
    
    res.locals.title = 'FaithForward Social';
    req.db = db;

    next();
  });

  //Invoke routes
  app.use('/', require('./routes'));

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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

  //Start webserver listening on PORT/IP
  console.log('Starting server at:  ' + process.env.IP + ':' + process.env.PORT);
  app.listen(process.env.PORT, process.env.IP) 
}

module.exports = app;