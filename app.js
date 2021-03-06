var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const entries = require('./routes/entries');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const register = require('./routes/register');
const login = require('./routes/login');
const api = require('./routes/api');
const messages = require('./middleware/messages');
const user = require('./middleware/user');
const validate = require('./middleware/validate');
const page = require('./middleware/page');
const Entry = require('./models/entry');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
//这里没有bodyparser，所以自己改了这里为true；因为表单用了形如entry[title] 之类的输入控件类型名称，所以需要用扩展的消息体解析器来解析‘
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.methodOverride());

app.use(cookieParser());
app.use(session({
  secret:'secret',
  resave:false,saveUninitialized:true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api',api.auth);
app.use(user);
app.use(messages);
// app.use(app.router);

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
//
app.get('/',entries.list);
app.get('/post',entries.form);
app.post('/post',
    validate.required('entry[title]'),
    validate.lengthAbove('entry[title]',4),
    entries.submit
);
app.get('/register',register.form);
app.post('/register',register.submit);
app.get('/login',login.form);
app.post('/login',login.submit);
app.get('/logout',login.logout);

app.get('/api/user/:id',api.user);
app.post('/api/entry',entries.submit);
//少了一个Entry.count的函数
app.get('/api/entries/:page?',page(Entry.count),api.entries);

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
