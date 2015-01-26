"use strict";
var dataWareHouseController = require('../controllers/dataWareHouseController');

module.exports = function (app, passport) {
    app.get('/bjarke', dataWareHouseController.bjarke);
    app.get('/roman', dataWareHouseController.roman);
    app.get('/octavian', dataWareHouseController.octavian);
    app.get('/vladimir', dataWareHouseController.vladimir);
    app.get('/getAllUsers', dataWareHouseController.getAllUsers);
    app.get('/getAds', dataWareHouseController.getAds);
    app.get('/getNewAds',dataWareHouseController.getNewAds);
    app.get('/getNewAndTotalUsersPerMonth', dataWareHouseController.getNewAndTotalUsersPerMonth);
    app.get('/analyticsSec',dataWareHouseController.analyticsSec);
    app.get('/authAdminUser',dataWareHouseController.authAdminUser);
    app.get('/getAdsByDate', dataWareHouseController.getAdsByDate);
    app.get('/getUserByDate', dataWareHouseController.getUserByDate);
    app.post('/adminLogout',dataWareHouseController.adminLogout);
    app.post('/adminLogin',dataWareHouseController.adminLogin);
    app.post('/createTestAdmin',dataWareHouseController.createTestAdmin);
    app.post('/deactiveUser', dataWareHouseController.deactiveUser);
    app.post('/activeUser', dataWareHouseController.activeUser);
    app.get('/getActiveUsers', dataWareHouseController.getActiveUsers);
    app.get('/getInactiveUsers', dataWareHouseController.getInactiveUsers);
    app.get('/bounceRatePerMonth', dataWareHouseController.bounceRatePerMonth);
    app.get('/averageTimeOnPage', dataWareHouseController.averageTimeOnPage);
    app.get('/percentNewSessions', dataWareHouseController.percentNewSessions);
    app.get('/usersPerDeviceCategory',dataWareHouseController.usersPerDeviceCategory);
};