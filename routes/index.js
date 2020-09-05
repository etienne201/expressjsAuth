var express = require('express');
var router = express.Router();
var auth = require("../config/Auth.js");
const ToDo = require('../moduls/todo')


// restrict index for logged in user only
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);
router.get('/list-todo', function(req, res, next) {

    res.render('list-todo', {
        title: 'List ToDo',
        todos: todos
    });
});

router.get('/add', function(req, res, next) {
    res.render('add-list', { title: 'Add ToDo' });
});
router.get('/list', async function(req, res, next) {
    let todos = await ToDo.find();
    res.render('list-todo', { title: 'ToDo List', todos: todos });
});

router.get('/productivity', function(req, res, next) {
    res.render('productivity', { title: 'Productivity' });
});
module.exports = router;