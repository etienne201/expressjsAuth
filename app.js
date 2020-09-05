// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users')

const { stringify } = require('querystring');
const ToDo = require('./moduls/todo')
const app = express();
// view engine setup
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_todo', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log('Connected to db'));


app.use('/views', express.static(path.resolve(__dirname, 'views')));
app.use('/public', express.static(path.resolve(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


// passport configuration
var User = require('./moduls/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.get('/list', async function(req, res, next) {
    //  ToDo.find((err, data) => {
    //         res.render('list-todos', { title: 'ToDo List', todos: data });
    //     });

    let todos = await ToDo.find();
    res.render('list-todo', { title: 'ToDo List', todos: todos });

});

app.post('*', function(req, res, next) {
    let toDo = new ToDo(req.body);
    toDo.save((err, data) => {
        if (err) console.log(err);
        console.log(data);

        ToDo.find((err, data) => {
            res.render('list-todo', { title: 'ToDo List', todos: data });
            // res.json(todos);
        });
    });

});

app.get('/update/:id', async function(req, res, next) {
    let todo = await ToDo.findById(req.params.id);
    res.render('update-todo', { todo: todo });
    // res.json(todos);
});
app.post('/update', async function(req, res, next) {
    let toDo = await ToDo.findById(req.body.id);
    await toDo.update(req.body);
    let todos = await ToDo.find();
    res.render('list-todo', { title: 'ToDo List', todos: todos });
    // res.json(todos);
});

app.get('/delete/:id', async function(req, res, next) {
    console.log("Got a DELETE request for /del_user");
    let toDo = await ToDo.findByIdAndDelete(req.params.id);
    let todos = await ToDo.find();
    res.render('list-todo', { title: 'ToDo List', todos: todos });
    // res.json(todos);
});

app.get('/done/:id', async function(req, res, next) {
    let toDo = await ToDo.findById(req.params.id);
    await toDo.update({ status: "done" });
    let todos = await ToDo.find();
    res.render('list-todo', { title: 'ToDo List', todos: todos });
    // res.json(todos);
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