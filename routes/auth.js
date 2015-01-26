"use strict";
var mongoose = require('mongoose'),
    passport = require('passport'),
    users = require('../controllers/userController');

module.exports = function (app, passport) {

    // Index page
    app.get('/', users.index);

    // checks if the user is already loggedin
    app.get('/isLoggedIn', users.isLoggedIn);

    // creates user with post data
    app.post('/users', users.create);

    // Passport authentication for local user i.e. signedup via email
    app.post('/users/session', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                //res.send(next(err));
                res.send(false);
            }
            else if (!user) {
                res.send(false);
            }
            else
                req.logIn(user, function (err) {
                    if (err) {
                        res.send(false);
                    } else {
                        req.session.loggedIn = true;
                        res.send(user);
                    }
                });
        })(req, res, next);
    });

    // logging out
    app.get('/logout', users.logout);

    // Resetting password
    app.post('/resetpassword', users.resetpassword);

    // Passport authentication for facebook login
    app.get('/auth/facebook', function(req, res, next){
        res.setHeader('Access-Control-Allow-Origin', '*' );
        passport.authenticate('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/',
            display: 'touch'
        })(req, res, next);
    }, users.signin);

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/'
    }), users.authCallback);

}