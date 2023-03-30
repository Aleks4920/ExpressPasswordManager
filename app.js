var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var homeRouter = require('./routes/home');
var managePasswordsRouter = require('./routes/managePasswords');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/home', indexRouter);
app.use('/passwords', managePasswordsRouter);



// app.use('/users', usersRouter);
// Passport config
var Account = require('./models/account');

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());




// Mongoose
const mongoAtlasUri = "mongodb+srv://sash4920:Sash13920@cluster0.sciopum.mongodb.net/?retryWrites=true&w=majority";
try {
  mongoose.connect(mongoAtlasUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message)=> { console.log('Connected successfully!');})
  .catch((error)=>{ console.log('Error while connecting: ' + error);})
  console.log("Connected to MongoDB Atlas");
} catch (error) {
  console.log("Could not connect to MongoDB Atlas");
  console.error(error);
}


//set port to listen on
app.set('port', process.env.PORT || 3000);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  next(createError(404));
  next(err);
});

app.use((req, res, next) => {
  if(!req.session.userId) {
    return next();
  } 
})

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

//will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// print the port that the server is listening on
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});



module.exports = app;
