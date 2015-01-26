"use strict";
var jobsController = require('../controllers/jobsController');

module.exports = function (app, passport) {
    app.get('/testJob', jobsController.test);
    app.post('/createJob', jobsController.createJob);
    app.post('/updateJob', jobsController.updateJob);
    app.get('/testChart', jobsController.testChart);
    app.get('/testAnalytics',jobsController.testAnalytics);
}