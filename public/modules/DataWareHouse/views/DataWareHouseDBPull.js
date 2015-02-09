/**
 * Created by Bjarke E. Andersen on 29-09-2014.
 */
var mongoose = require('mongoose');
var FacebookModel = require('mongoose').model('FacebookModel');
var pageViewsPerMonth = require('mongoose').model('PageViewsPerMonth');
var userModel = require('mongoose').model('User');
var gigsModels = require('mongoose').model('Gigs');

function getAllUsers(callback) {
    console.log("getAllUsers started");
    var USM = mongoose.model('User');
    var dat = [];
    userModel.find({}, function (err, docs) {
        if (err) {
            res.send(400, "An error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                var dataSet, data2 = USM;
                dataSet = docs[i].created_at;
                data2 = docs[i];
                dat.push(dataSet);
            }
        }
        callback(dat);
    });
}exports.getAllUsers = getAllUsers;

function getAllActiveUsers(callback) {
    console.log("getAllActiveUsers started");
    var USM = mongoose.model('User');
    var dat = [];
    userModel.find({}, function (err, docs) {
        if (err) {
            res.send(400, "No active users exist " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                if (docs[i].active) {
                    var dataSet = USM;
                    dataSet = docs[i];
                    dat.push(dataSet);
                }
            }
        }
        callback(dat);
    });
}
exports.getAllActiveUsers = getAllActiveUsers;

function getAllUnActiveUsers(callback) {
    console.log("getAllUnActiveUsers started");
    var USM = mongoose.model('User');
    var dat = [];
    userModel.find({}, function (err, docs) {
        if (err) {
            res.send(400, "No unactive users exist  " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                if (!docs[i].active) {
                    var dataSet = USM;
                    dataSet = docs[i];
                    dat.push(dataSet);
                }
            }
        }
        callback(dat);
    });
}
exports.getAllUnActiveUsers = getAllUnActiveUsers;


function getAllAds(callback) {
    console.log("getAllAds started");
    var GGM = mongoose.model('Gigs');
    var dat = [];
    gigsModels.find({}, function (err, docs) {
        if (err) {
            res.send(400, "An error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                var dataSet = GGM;
                dataSet = docs[i];
                dat.push(dataSet);
            }
        }
        callback(dat);
    });
}
exports.getAllAds = getAllAds;


function getUsersCreatedAt(startDate, endDate, callback) {
    console.log("getUsersCreatedAt started");
    var USM = mongoose.model('User');
    var dat = [];
    userModel.find({"created_at": {$gte: new Date(startDate.year, startDate.month, startDate.day), $lt: new Date(endDate.year, endDate.month, endDate.day)}}, function (err, docs) {
        if (err) {
            res.send(400, "An error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                var dataSet = USM;
                dataSet = docs[i];
                dat.push(dataSet);
            }
        }
        callback(dat);
    });
}
exports.getUsersCreatedAt = getUsersCreatedAt;

function getAdsCreatedAt(startDate, endDate, callback) {
    console.log("getAdsCreatedAt started");
    var GGM = mongoose.model('Gigs');
    var dat = [];
    gigsModels.find({"created_at": {$gte: new Date(startDate.year, startDate.month, startDate.day), $lt: new Date(endDate.year, endDate.month, endDate.day)}}, function (err, docs) {
        if (err) {
            res.send(400, "An error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                var dataSet = GGM;
                dataSet = docs[i];
                dat.push(dataSet);
            }
        }
        callback(dat);
    });
}
exports.getAdsCreatedAt = getAdsCreatedAt;


function getNewUsersToday(callback) {
    console.log("getUsersToday started");
    var Day = new Date();
    var current_Day = Day.getDate();
    var current_Month = Day.getMonth();
    var current_Year = Day.getFullYear();
    var USM = mongoose.model('User');
    var dat = [];
    userModel.find({"created_at": {$gte: new Date(current_Year, current_Month, current_Day)}}, function (err, docs) {
        if (err) {
            res.send(400, "An error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                console.log(docs[i]);
                var dataSet = USM;
                dataSet = docs[i];
                dat.push(dataSet);
            }
        }
        callback(dat);
    });
}
exports.getNewUsersToday = getNewUsersToday;


function getNewAdsToday(callback) {
    console.log("geNewtAdsToday started");
    var Day = new Date();
    var current_Day = Day.getDate();
    var current_Month = Day.getMonth();
    var current_Year = Day.getFullYear();
    var GGM = mongoose.model('Gigs');
    var dat = [];
    gigsModels.find({"created_at": {$gte: new Date(current_Year, current_Month, current_Day)}}, function (err, docs) {
        if (err) {
            res.send(400, "An error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                console.log(docs[i]);
                var dataSet = GGM;
                dataSet = docs[i];
                dat.push(dataSet);
            }
        }
        callback(dat);
    });
}
exports.getNewAdsToday = getNewAdsToday;


function getDataSetLocaleGender(gender, callback) {

    var FBM = mongoose.model('FacebookModel');
    var dat = [];
    FBM.find({gender: gender}, function (err, docs) {
        if (err) {
            res.send(400, "An error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                var dataSet = {locale: 0, gender: 0};
                dataSet.locale = docs[i].locale;
                dataSet.gender = docs[i].gender;
                dat.push(dataSet);
            }
        }
        callback(JSON.stringify(dat));
    });
}
exports.getDataSetLocaleGender = getDataSetLocaleGender;

function getHitsAndPageViewsPerMonth(month, callback) {
    var pvm = mongoose.model('PageViewsPerMonth');
    var hm = mongoose.model('HitsPerMonth');
    var dat = [];

    pvm.find({month: month}, function (err, docs) {
        if (err) {
            res.send(400, "A serious error occured!" + err);
        }
        else {
            for (var i = 0; i < docs.length; i++) {
                var dataSet = {month: 0, pageViews: 0, uniquePageViews: 0, hits: 0};
                dataSet.month = docs[i].month;
                dataSet.pageViews = docs[i].pageViews;
                dataSet.uniquePageViews = docs[i].uniquePageviews;
                dat.push(dataSet);
            }
        }
    });
    hm.find({month: month}, function (err, docs) {
        if (err) {
            res.send(400, "A serious error occured!" + err);
        }
        else {
            for (var i = 0; i < docs.length; i++) {
                dat[i].hits = docs[i].hits;
            }
            callback(JSON.stringify(dat));
        }
    });
}
exports.getHitsAndPageViewsPerMonth = getHitsAndPageViewsPerMonth;

function getUsersAndAvgTimeOnPage(month, callback) {
    var AVOP = mongoose.model('AvrTimeOnPagePerMonth');
    var UPM = mongoose.model('NewAndTotalUsersPerMonth');
    var dat = [];

    AVOP.find({month: month}, function (err, docs) {
        if (err) {
            res.send(400, "An error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {

                var dataSet = {month: 0, avgTimeOnPage: 0, users: 0};
                dataSet.month = docs[i].month;
                dataSet.avgTimeOnPage = docs[i].avgTimeOnPage;
                dat.push(dataSet);

            }
        }
    });

    UPM.find({month: month}, function (err, docs) {
        if (err) {
            res.send(400, "An error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                /*
                 * Double for loop to check for month allingment.
                 * This is due to data from google, dons't always seems to be sorted.
                 * */
                for (var j = 0; j < docs.length; j++) {
                    if (docs[j].month === dat[i].month) {
                        dat[i].users = docs[j].users;
                    }
                }
            }
            callback(JSON.stringify(dat));
        }
    });
}
exports.getUsersAndAvgTimeOnPage = getUsersAndAvgTimeOnPage;

function getUsersAndProcentNewSession(callback) {
    var PNS = mongoose.model('PercentNewSessionsPerMonth');
    var UPM = mongoose.model('NewAndTotalUsersPerMonth');
    var dat = [];

    PNS.find({}, function (err, docs) {
        if (err) {
            res.send(400, "An error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                var dataSet = {month: 0, percentNewSessions: 0, newUsers: 0, users: 0};
                dataSet.month = docs[i].month;
                dataSet.percentNewSessions = docs[i].percentNewSessions;
                dat.push(dataSet);

            }
        }
    });
    UPM.find({}, function (err, docs) {
        if (err) {
            res.send(400, "An error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                /*
                 * Double for loop to check for month allingment.
                 * This is due to data from google, dons't always seems to be sorted.
                 * */
                for (var j = 0; j < docs.length; j++) {
                    if (docs[j].month === dat[i].month) {
                        dat[i].newUsers = docs[j].newUsers;
                        dat[i].users = docs[j].users;
                    }
                }
            }
            callback(JSON.stringify(dat));
        }
    });

}
exports.getUsersAndProcentNewSession = getUsersAndProcentNewSession;