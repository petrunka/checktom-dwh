"use strict";
var mongoose = require('mongoose'),
    signupUsers = require('../controllers/signupController');

module.exports = function (app, passport) {

    // checks if the user is already loggedin
    app.get('/isLoggedIn', signupUsers.isLoggedIn);

    // creates user with post data
    app.post('/signupUsers', signupUsers.create);
    app.put('/signupUsers/:id', signupUsers.update);
}