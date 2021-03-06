var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var catalog = require('./routes/catalog');  //Import routes for "catalog" area of site
//TESTING Downloads
var pieSlicerDwnld = require('./routes/pieSlicerDwnld')
var fracSpellerDwnld = require('./routes/fracSpellerDwnld')

var compression = require('compression');
var helmet = require('helmet');
//var cfenv = require('cfenv'); //RECOVERY MOD 2018-05-18
// Set up CF environment variables
//var appEnv = cfenv.getAppEnv(); //RECOVERY MOD 2018-05-18

var app = express();

//2018-10-11  adding debug campability
var debug = require('debug')('http')
  , http = require('http')
  , name = 'My App';

//Import the mongoose module
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI || "mongodb://Pipmon:MLBsfae!001@ds231090.mlab.com:31090/pipmongodb"
//mongoDB definition above to check out why environment variable set below (with heroku set config) doesn't work!
//Set up default mongoose connection
//var mongoDB = 'mongodb://127.0.0.1/my_database';//ORIGINAL DB connection
//var mongoDB = process.env.MONGODB_URI || 'mongodb://127.0.0.1/my_database';//2018=05-19 default to local if online not available
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(compression());
//compression apllies to all further aap.use calls
app.use(helmet());//protects headers somehow
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/catalog', catalog);  // Add catalog routes to middleware chain.
//TESTING Download
app.use('/pieSlicerDwnld', pieSlicerDwnld);
app.use('/fracSpellerDwnld', fracSpellerDwnld);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//clean database models before starting
for (let model in mongoose.models) delete mongoose.models[model]

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

VerifyState = {step:0};//2019-01-21 attempt to simplify verification step value for which png is visible
                      //seems that it must be a global here to be seen as global in any other module importing ../app

module.exports = app;
