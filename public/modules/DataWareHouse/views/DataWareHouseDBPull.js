/**
 * Created by Bjarke E. Andersen on 29-09-2014.
 */
var mongoose = require('mongoose');
var FacebookModel = require('mongoose').model('FacebookModel');
var pageViewsPerMonth = require('mongoose').model('PageViewsPerMonth');
var userModel = require('mongoose').model('User');
var gigsModels = require('mongoose').model('Gigs');
var articleModel = require('mongoose').model('Articles');

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
                dat.push(data2);
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

function getAllArticles(callback) {
    console.log('get all articles');
    var AM = mongoose.model('Articles');
    var dat = [];
    articleModel.find({}, function(err, docs) {
        if(err) {
            res.send(400, "A critical error occurred" + err);
        } else {
            for(var i=0; i<docs.length; i++) {
                var dataSet = AM;
                dataSet = docs[i];
                dat.push(dataSet);
            }
        }
        callback(dat);
    });
}
exports.getAllArticles = getAllArticles;

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

function getUsersRegisteredWithFacebook(callback) {
    console.log("getUsersRegisteredWithFB");
    var UFB = mongoose.model('User');
    var dat = [];
    userModel.find({"provider":"facebook"}, function(err, docs) {
        if(err) {
            res.send(400, "An error occurred " + err);
        } else {
            for(var i=0; i<docs.length; i++) {
                var dataSet = UFB;
                dataSet = docs[i];
                dat.push(dataSet);
            }
        }
        callback(dat);
    })
}
exports.getUsersRegisteredWithFacebook = getUsersRegisteredWithFacebook;

function getUsersRegisteredWithEmail(callback) {
    console.log("getUsersRegisteredWithFB");
    var UFB = mongoose.model('User');
    var dat = [];
    userModel.find({"provider":"local"}, function(err, docs) {
        if(err) {
            res.send(400, "An error occurred " + err);
        } else {
            for(var i=0; i<docs.length; i++) {
                var dataSet = UFB;
                dataSet = docs[i];
                dat.push(dataSet);
            }
        }
        callback(dat);
    })
}
exports.getUsersRegisteredWithEmail = getUsersRegisteredWithEmail;

function getAdsCreatedAt(startDate, endDate, callback) {
    console.log("getAdsCreatedAt started");
    var GGM = mongoose.model('Gigs');
    var dat = [];
    gigsModels.find({"CreatedAt": {$gte: new Date(startDate.year, startDate.month, startDate.day), $lt: new Date(endDate.year, endDate.month, endDate.day)}}, function (err, docs) {
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

function getNewUsersLastMonth(callback) {
    console.log("getUsersLastMonth started");
    var Day = new Date();
    var currentMonth = Day.getMonth();
    var currentDay = Day.getDate();
    var currentYear = Day.getFullYear();
    console.log(currentDay + "." + currentMonth);

    switch (currentMonth) {
        case 0:
            var oldDay = currentDay;
            var oldMonth = 11;
            var oldYear = currentYear - 1;
            break;
        case 2:
            if(currentDay>=29) {
                var oldDay = 28;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            } else {
                var oldDay = currentDay;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            }
            break;
        case 4:
        case 6:
        case 9:
            if(currentDay===31) {
                var oldDay = 30;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            } else {
                var oldDay = currentDay;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            }
            break;
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
            var oldDay = currentDay;
            var oldMonth = currentMonth - 1;
            var oldYear = currentYear;
            break;
        default:
            console.log("An error occurred!");
            break;
    }

    var USM = mongoose.model('User');
    var dat = [];
    userModel.find({"created_at": {$gte: new Date(oldYear, oldMonth, oldDay), $lt: new Date(Day.getFullYear(), currentMonth, currentDay)}}, function (err, docs) {
        if (err) {
            res.send(400, "A terrible error has occurred " + err);
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
exports.getNewUsersLastMonth = getNewUsersLastMonth;

function getNewAdsLastMonth(callback) {
    console.log("getAdsLastMonth started");
    var Day = new Date();
    var currentMonth = Day.getMonth();
    var currentDay = Day.getDate();
    var currentYear = Day.getFullYear();
    console.log(currentDay + "." + currentMonth);

    switch (currentMonth) {
        case 0:
            var oldDay = currentDay;
            var oldMonth = 11;
            var oldYear = currentYear - 1;
            break;
        case 2:
            if(currentDay>=29) {
                var oldDay = 28;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            } else {
                var oldDay = currentDay;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            }
            break;
        case 4:
        case 6:
        case 9:
            if(currentDay===31) {
                var oldDay = 30;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            } else {
                var oldDay = currentDay;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            }
            break;
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
            var oldDay = currentDay;
            var oldMonth = currentMonth - 1;
            var oldYear = currentYear;
            break;
        default:
            console.log("An error occurred!");
            break;
    }

    var GSM = mongoose.model('Gigs');
    var dat = [];
    gigsModels.find({"CreatedAt": {$gte: new Date(oldYear, oldMonth, oldDay), $lt: new Date(currentYear, currentMonth, currentDay)}}, function (err, docs) {
        if (err) {
            res.send(400, "A terrible error has occurred " + err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                console.log(docs[i]);
                var dataSet = GSM;
                dataSet = docs[i];
                dat.push(dataSet);
            }
        }
        callback(dat);
    });
}
exports.getNewAdsLastMonth = getNewAdsLastMonth;

function getReturningUsers(callback) {
    console.log("getReturningUsers started");
    var Day = new Date();
    var currentMonth = Day.getMonth();
    var currentDay = Day.getDate();
    var currentYear = Day.getFullYear();
    console.log(currentDay + "." + currentMonth);

    switch (currentMonth) {
        case 0:
            var oldDay = currentDay;
            var oldMonth = 11;
            var oldYear = currentYear - 1;
            break;
        case 2:
            if(currentDay>=29) {
                var oldDay = 28;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            } else {
                var oldDay = currentDay;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            }
            break;
        case 4:
        case 6:
        case 9:
            if(currentDay===31) {
                var oldDay = 30;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            } else {
                var oldDay = currentDay;
                var oldMonth = currentMonth - 1;
                var oldYear = currentYear;
            }
            break;
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
            var oldDay = currentDay;
            var oldMonth = currentMonth - 1;
            var oldYear = currentYear;
            break;
        default:
            console.log("An error occurred!");
            break;
    }

    var USM = mongoose.model('User');
    var dat = [];
    userModel.find({"created_at": {$gte: new Date(2010, 1, 1), $lt: new Date(oldYear, oldMonth, oldDay)}}, function (err, docs) {
        if (err) {
            res.send(400, "A terrible error has occurred " + err);
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
exports.getReturningUsers = getReturningUsers;

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