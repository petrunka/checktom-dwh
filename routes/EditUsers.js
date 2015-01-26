
var EditSignupsController = require('../controllers/EditSignupsController');


module.exports = function (app, passport) {
    // our restful supply of all users and their info. This should probably require session=loggedin and userstatus=admin
    app.get('/getAllSignedUsers', EditSignupsController.getListOfUsers);
    // our restful document update-handler
    app.post('/updateSignedUser', EditSignupsController.updateUser);

    app.get('/YouReallyShouldNotLetUsersAccessDBLikeThis',EditSignupsController.generateDummyUsers);


}