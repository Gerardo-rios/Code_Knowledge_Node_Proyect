var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');

var passport = require('passport');

//favicon
var favicon = require('express-favicon');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var session = require('express-session');


var session = require('express-session');
var flash = require('req-flash');

//var Handlebars = require('handlebars');

var app = express();

app.use(session({
    secret: 'sopaipilla',
    resave: false,
    saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//registro de parciales xd
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/fragmentos');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use('/ckeditor', express.static(__dirname + '/node_modules/ckeditor/'));
app.use('/files', express.static(__dirname + '/files/'));
app.use(fileUpload());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport);

//favicon
app.use(favicon(__dirname + '/public/images/icons/favicon.ico'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);


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

//Handlebars.registerPartial('myeditor', '{{editor}}');

module.exports = app;
