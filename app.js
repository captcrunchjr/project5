var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
require('dotenv').config();
const MongoStore = require('connect-mongo');
const session = require('express-session');
const flash = require('connect-flash');

var indexRouter = require('./routes/index');
var itemsRouter = require('./routes/items');
var usersRouter = require('./routes/userRoutes');

var app = express();

// connect to the database
let port= 3001;
let host = 'localhost';
// let url = process.env.MONGODB_URI;
let url = "mongodb+srv://demo:demo123@hazeshop.l0105uu.mongodb.net/?retryWrites=true&w=majority&appName=HazeShop";

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    app.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  })
  .catch(err => console.log(err.message));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

//mount middlware
app.use(
  session({
      secret: "ajfeirf90aeu9eroejfoefj",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({mongoUrl: 'mongodb+srv://demo:demo123@hazeshop.l0105uu.mongodb.net/?retryWrites=true&w=majority&appName=HazeShop'}),
      cookie: {maxAge: 60*60*1000},
      rolling: true
      })
);
app.use(flash());
app.use((req, res, next) => {
  //console.log(req.session);
  res.locals.user = req.session.user||null;
  res.locals.errorMessages = req.flash('error');
  res.locals.successMessages = req.flash('success');
  next();
});

app.use('/', indexRouter);
app.use('/items', itemsRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  let err = new Error('The server cannot locate ' + req.url);
  err.status = 404;
  next(err);

});

// error handler
app.use((err, req, res, next)=>{
  console.log(err.stack);
  if(!err.status) {
      err.status = 500;
      err.message = ("Internal Server Error");
  }

  res.status(err.status);
  res.render('error', {error: err});
});

module.exports = app;
