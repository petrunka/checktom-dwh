/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    mailController = require('../controllers/mailController'),
    User = mongoose.model('User');

var mailController = require('../controllers/mailController');


/**
 * Show Index Page
 */

exports.index = function (req, res) {
    res.render('index', {
        'title': 'CHECKTOM'
    });
};
//
exports.isLoggedIn = function (req, res) {
    console.log('Checking Login Status');
    if (req.user && req.session.loggedIn) {
        res.send(req.user.id);
    } else {
        res.send(401, 'Not Authorized');
    }
}

exports.signin = function (req, res) {
};

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
    res.redirect('/')
};

/**
 * Create user
 */

exports.create = function (req, res) {
    var user = new User(req.body);
    user.created_at = Date.now();
    user.provider = 'local';

    // initiatilize random string for user.
    var RegString = function () {
        // random 10 digit number.
        return Math.floor((Math.random() * 1000000000000000000) + 9999999999999999999);
    };
    user.uniqueRecoveryString = RegString();
    if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(user.email) && validateAttri(user.city) && validateAttri(user.name) && validateAttri(user.university) && validateAttri(user.password)) {
        user.save(function (err) {
            if (err) {
                if (err.code != 'undefined' && err.code == '11000')
                    err.errors = {'email': {'message': 'This email is already registered'}};
                res.send(500, err.errors);
            } else {
                // send the verification email
                mailController.registrationMailSend(user);
                // here user is already created and stored in variable "user"
                // send a mail to newly created user
                mailController.registrationMailSend(user);
                req.logIn(user, function (errors) {
                    if (err) {
                        res.send(errors);
                    }
                    req.session.loggedIn = true;
                    res.send(req.user);
                });
            }
        });
    } else {
        res.send(500, 'Wrong Data Format');
    }
};
/**
 * Resetting password for the user
 */
exports.resetpassword = function (req, res) {
    // check if email exists in the system
    var email = req.body.email;//should parse and sanitize this
    User.findOne({
        email: email
    }, function (err, user) {
        if (err) {
            // do something with the error
        }
        if (!user) {
            // do something with the error
        }
        //return done(null, user)

        // if yes send an email else send error message
        console.log('sending message');
    });
}

/**
 * Find user by id
 */

exports.find = function (req, res) {
    console.log(req.user.id);
    var id = req.params.id == 'me' ? req.user.id : req.params.id;
    User.findOne({
        _id: id
    }, function (err, doc) {
        if (err) res.send(err);
        res.send(doc);
    });
};

/**
 * Log out the user
 */
exports.logout = function (req, res) {
    req.logout();
    req.session.loggedIn = false;
    res.redirect('/');
}

validateAttri = function (attribute) {
    if (typeof attribute !== 'undefined'
        && attribute !== null
        && attribute !== '') {
        return true;
    } else {
        return false;
    }
}