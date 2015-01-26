var userController = require('../controllers/userController');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "checktommailservice@gmail.com",
        pass: "checktom123"
    }
});
// static variables and functions
var saltReset = "hjklokdkdajswrj";
var saltVerifyAccount = "kjhlokdkdajswrj";

// registers a user, and sends a verification mail.
exports.registrationMailSend = function (user) {
    var OurURL = "http://localhost:3000/verify/";
    var DevURL = "http://checktom.nodejitsu.com/verify/";

    // Create all purpose links
    var unique_verification_link = 0 + "((d)lt)" + saltVerifyAccount + "((d)lt)" + user.uniqueRecoveryString;

    // Create mail content
    var emailPlaintext = "Welcome to checktom ! click here to verify your account. " + OurURL + unique_verification_link;

    // send email to users email with verification link.
    var mailOptions = {
        from: "checktommailservice@gmail.com", // sender address
        to: user.email, // list of receivers
        subject: "Welcome to Checktom!", // Subject line
        text: emailPlaintext // plaintext body
    }


    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
        // if you don't want to use this transport object anymore, uncomment following line
        smtpTransport.close(); // shut down the connection pool, no more messages
    });


}
// takes a string url as input. in the format supplied in a mail.
exports.VerifyAndResetPasswordLink = function (req, res) {
    // takes the link supplied in url
    var uniqueKey = req.params.key;
    var delimited = uniqueKey.split("((d)lt)");
    // identifies the salttype and number.
    var salt = delimited[1];
    var number = delimited[2];

    // start one of the two processes, depending on salttype.
    if (salt === saltReset) {
        /* console.log("reset Password called");

         // Get the new password from the post request.
         var newPassword = Req.body.password;

         // confirmation sent to user. either on-page or email.


         // resetpassword...

         // a resetpassword page is opened. with two inputs.

         // if both fields match the value is used to overwrite old password.
         var query = {uniqueRecoveryString: number};
         User.findOneAndUpdate(query, { password: newPassword }, function (err, stuff) {
         console.log(stuff);
         })
         res.send(200);
         */
    }
    else if (salt === saltVerifyAccount) {
        // set verified to "true" and save in db.
        var query = { uniqueRecoveryString: number };
        // verification here
        User.findOneAndUpdate(query, { verified: true }, function (err, stuff) {
            console.log(stuff);
        })
        res.send(200);
    }
}