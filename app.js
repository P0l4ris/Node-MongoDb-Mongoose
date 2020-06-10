var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
//another function returned with require and called with the second parameter
const FileStore = require('session-file-store')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

//bringing in and connecting MongoDB and Mongoose
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));
//signed cookie
app.use(session({
  name:'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  //doesn't save empty sessions after requests. No cookie for client. Re-save/update after every request in session. Most current or active?
  store: new FileStore() //client memory storage
  
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//placement of authentication
function auth(req, res, next) {
  console.log(req.session);
  //provided by cookie parser. not correct = false or user does not match. Keep challenging
  if(!req.session.user) {
      const err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
  } else {
    if(req.session.user === 'authenticated') {
      return next();
    } else {
      const err = new Error('You are not authenticated!');    
      err.status = 401;
      return next(err);
    }
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

//pushed Index/ Users to top to have them access before auth or when logging out
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);


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
