/**
 * Created by admin on 18.9.2014 г..
 */
var mongoose = require('mongoose');
var UsersPerMonth = require('mongoose').model('UsersPerMonth');
var NewAndTotalUsersPerMonth = require('mongoose').model('NewAndTotalUsersPerMonth');
var NewUsersPerDeviceCategory = require('mongoose').model('NewUsersPerDeviceCategory');
var SessionPerMonth = require('mongoose').model('SessionsPerMonth');
var BouncesPerMonth = require('mongoose').model('BouncesPerMonth');
var HitsPerMonth = require('mongoose').model('HitsPerMonth');
var HitsPerSessionDurationBucket = require('mongoose').model('HitsPerSessionDurationBucket');
var PageLoadTimePerMonth = require('mongoose').model('PageLoadTimePerMonth');
var ServerResponseTimePerMonth = require('mongoose').model('ServerResponseTimePerMonth');
var SessionDurationPerMonth = require('mongoose').model('SessionDurationPerMonth');
var EntranceRatePerMonth = require('mongoose').model('EntranceRatePerMonth');
var ExitRatePerMonth = require('mongoose').model('ExitRatePerMonth');
var PercentNewSessionsPerMonth = require('mongoose').model('PercentNewSessionsPerMonth');
var PageViewsPerMonth = require('mongoose').model('PageViewsPerMonth');
var PageValueAndEntrancesPerMonth = require('mongoose').model('PageValueAndEntrancesPerMonth');
var AvrTimeOnPagePerMonth = require('mongoose').model('AvrTimeOnPagePerMonth');
var SessionDurationBucketPerMonth = require('mongoose').model('SessionDurationBucketPerMonth');
var UsersPerUserType = require('mongoose').model('UsersPerUserType');
var UsersPerDeviceCategory = require('mongoose').model('UsersPerDeviceCategory');//
var UsersPerSessionCount = require('mongoose').model('UsersPerSessionCount');
var UsersPerDaysSinceLastSession = require('mongoose').model('UsersPerDaysSinceLastSession');
var NewUsersPerSessionCount = require('mongoose').model('NewUsersPerSessionCount');
var FacebookModel = require('mongoose').model('FacebookModel');
var utils = require("./views/dataWareHouseUtils");
var Day = new Date();
var currentMonth = Day.getMonth() + 1;

if(currentMonth<10) {
    var extendedMonth = '0'+currentMonth;
    console.log(extendedMonth);
} else {
    var extendedMonth = currentMonth;
    console.log(extendedMonth);
}

var currentDay = Day.getDate();

if(currentDay<10) {
    var extendedDay = '0' + currentDay;
    console.log(extendedDay);
}
else {
    var extendedDay = currentDay;
    console.log(extendedDay);
}
var start = (Day.getFullYear() -2 )+"-"+ extendedMonth+"-"+ extendedDay;
var end = Day.getFullYear() + "-" + extendedMonth + "-"+extendedDay;
console.log("Data fra " + start + " til " + end);
var startDate = start;
var endDate = end;
var dataRes = null;

function getDataFromGA(e) {
    e.preventDefault();
    var viewJSON = {
        data: []
    };

    utils.getDataFromGA("ga:country", "ga:bounceRate", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        for (var i = 0; i < data.rows.length; i++) {
            viewJSON.data.push({
                country: data.rows[i][0],
                bounceRate: data.rows[i][1]
            });
        }
        console.log(viewJSON);
        res.send(viewJSON);
    });
}
// Tested -working well!
/*Use this function as prototype if adding more functions*********************/
function getNewAndTotalUsersPerMonth(callback) {
    console.log("getNewAndTotalUsersPerMonth");
    utils.getDataFromGA("ga:year, ga:month", "ga:users, ga:newUsers", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var NTU = mongoose.model('NewAndTotalUsersPerMonth');
            NTU.find({"year": data.rows[i][0], "month": data.rows[i][1]}, function (err, docs_id) {
                if (err) {
                    res.send(400, "error in getNewAndTotalUsersPerMonth: " + err);
                } else if (docs_id[0] != null) {
                    NTU.update({"_id": docs_id[0]._id}, {"users": data.rows[j][2], "newUsers": data.rows[j][3]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getNewAndTotalUsersPerMonth " + err);
                        } else {
                            console.log("Data updated in getNewAndTotalUsersPerMonth");
                        }
                    });
                } else {
                    var NTU2 = new NewAndTotalUsersPerMonth();
                    NTU2._id = mongoose.Types.ObjectId().toString();
                    NTU2.year = data.rows[j][0];
                    NTU2.month = data.rows[j][1];
                    NTU2.users = data.rows[j][2];
                    NTU2.newUsers = data.rows[j][3];
                    NTU2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getNewAndTotalUsersPerMonth " + err);
                        } else {
                            console.log("Data saved in getNewAndTotalUsersPerMonth");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getNewAndTotalUsersPerMonth = getNewAndTotalUsersPerMonth;

//tested working well!
function getPageValueAndEntrancesPerMonth(callback) {
    console.log("getPageValueAndEntrancesPerMonth");
    utils.getDataFromGA("ga:year, ga:month", "ga:pageValue, ga:entrances", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var PVE = mongoose.model('PageValueAndEntrancesPerMonth');
            PVE.find({"year": data.rows[i][0], "month": data.rows[i][1]}, function (err, docs_id) {
                if (err) {
                    res.send(400, "error in getPageValueAndEntrancesPerMonth: " + err);
                } else if (docs_id[0] != null) {
                    PVE.update({"_id": docs_id[0]._id}, {"pageValue": data.rows[j][2], "entrances": data.rows[j][3]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getPageValueAndEntrancesPerMonth " + err);
                        } else {
                            console.log("Data updated in getPageValueAndEntrancesPerMonth");
                        }
                    });
                } else {
                    var PVE2 = new PageValueAndEntrancesPerMonth();
                    PVE2._id = mongoose.Types.ObjectId().toString();
                    PVE2.year = data.rows[j][0];
                    PVE2.month = data.rows[j][1];
                    PVE2.pageValue = data.rows[j][2];
                    PVE2.entrances = data.rows[j][3];
                    PVE2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getPageValueAndEntrancesPerMonth " + err);
                        } else {
                            console.log("Data saved in getPageValueAndEntrancesPerMonth");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getPageValueAndEntrancesPerMonth = getPageValueAndEntrancesPerMonth;

// tested working!
function getPageLoadTimePerMonth(callback) {
    console.log("getPageLoadTimePerMonth");
    utils.getDataFromGA("ga:year, ga:month", "ga:pageLoadTime", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var PLT = mongoose.model('PageLoadTimePerMonth');
            PLT.find({"year": data.rows[i][0], "month": data.rows[i][1]}, function (err, docs_id) {
                if (err) {
                    res.send(400, "error in getPageLoadTimePerMonth: " + err);
                } else if (docs_id[0] != null) {
                    PLT.update({"_id": docs_id[0]._id}, {"pageLoadTime": data.rows[j][2]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getPageLoadTimePerMonth " + err);
                        } else {
                            console.log("Data updated in getPageLoadTimePerMonth");
                        }
                    });
                } else {
                    var PLT2 = new PageLoadTimePerMonth();
                    PLT2._id = mongoose.Types.ObjectId().toString();
                    PLT2.month = data.rows[j][1];
                    PLT2.year = data.rows[j][0];
                    PLT2.pageLoadTime = data.rows[j][2];
                    PLT2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getPageLoadTimePerMonth " + err);
                        } else {
                            console.log("Data saved in getPageLoadTimePerMonth");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getPageLoadTimePerMonth = getPageLoadTimePerMonth;

// Tested working!
function getServerResponseTimePerMonth(callback) {
    console.log("getServerResponseTimePerMonth");
    utils.getDataFromGA("ga:year, ga:month", "ga:serverResponseTime", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var SRT = mongoose.model('ServerResponseTimePerMonth');
            SRT.find({"month": data.rows[i][1], "year": data.rows[i][0]}, function (err, docs_id) {
                if (err) {
                    res.send(400, "error in getServerResponseTimePerMonth: " + err);
                } else if (docs_id[0] != null) {
                    SRT.update({"_id": docs_id[0]._id}, {"serverResponseTime": data.rows[j][2]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getServerResponseTimePerMonth" + err);
                        } else {
                            console.log("Data updated in getServerResponseTimePerMonth");
                        }
                    });
                } else {
                    var SRT2 = new ServerResponseTimePerMonth();
                    SRT2._id = mongoose.Types.ObjectId().toString();
                    SRT2.year = data.rows[j][0];
                    SRT2.month = data.rows[j][1];
                    SRT2.serverResponseTime = data.rows[j][2];
                    SRT2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getServerResponseTimePerMonth " + err);
                        } else {
                            console.log("Data saved in getServerResponseTimePerMonth");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getServerResponseTimePerMonth = getServerResponseTimePerMonth;

// tested working !
function getPercentNewSessionsPerMonth(callback) {
    console.log("getPercentNewSessionsPerMonth");
    utils.getDataFromGA("ga:year, ga:month", "ga:percentNewSessions", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var PNS = mongoose.model('PercentNewSessionsPerMonth');
            PNS.find({"month": data.rows[i][1], "year": data.rows[i][0]}, function (err, docs_id) {
                if (err) {
                    res.send(400, "error in getPercentNewSessionsPerMonth: " + err);
                } else if (docs_id[0] != null) {
                    PNS.update({"_id": docs_id[0]._id}, {"percentNewSessions": data.rows[j][2]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getPercentNewSessionsPerMonth " + err);
                        } else {
                            console.log("Data updated in getPercentNewSessionsPerMonth");
                        }
                    });
                } else {
                    var PNS2 = new PercentNewSessionsPerMonth();
                    PNS2._id = mongoose.Types.ObjectId().toString();
                    PNS2.year = data.rows[j][0];
                    PNS2.month = data.rows[j][1];
                    PNS2.percentNewSessions = data.rows[j][2];
                    PNS2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getPercentNewSessionsPerMonth " + err);
                        } else {
                            console.log("Data saved in getPercentNewSessionsPerMonth");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });

}
exports.getPercentNewSessionsPerMonth = getPercentNewSessionsPerMonth;

// Tested working well!!
function getSessionsPerMonth(callback) {
    console.log("getSessionsPerMonth");
    utils.getDataFromGA("ga:year, ga:month", "ga:sessions", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var SPM = mongoose.model('SessionsPerMonth');
            SPM.find({"month": data.rows[i][1], "year": data.rows[i][0]}, function (err, docs_id) {
                if (err) {
                    res.send(400, "error in getSessionsPerMonth: " + err);
                } else if (docs_id[0] != null) {
                    SPM.update({"_id": docs_id[0]._id}, {"sessions": data.rows[j][2]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getSessionsPerMonth " + err);
                        } else {
                            console.log("Data updated in getSessionsPerMonth");
                        }
                    });
                } else {
                    var SPM2 = new SessionPerMonth();
                    SPM2._id = mongoose.Types.ObjectId().toString();
                    SPM2.year = data.rows[j][0];
                    SPM2.month = data.rows[j][1];
                    SPM2.sessions = data.rows[j][2];
                    SPM2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getSessionsPerMonth " + err);
                        } else {
                            console.log("Data saved in getSessionsPerMonth");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getSessionsPerMonth = getSessionsPerMonth;

// tested working  but only updates makes  !!!
function getBouncesPerMonth(callback) {
    console.log("getBouncesPerMonth");
    utils.getDataFromGA("ga:year, ga:month", "ga:bounces", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var BPM = mongoose.model('BouncesPerMonth');
            BPM.find({"month": data.rows[i][1], "year": data.rows[i][0]}, function (err, docs_id) {
                if (err) {
                    res.send(400, "error in getBouncesPerMonth: " + err);
                } else if (docs_id[0] != null) {
                    BPM.update({"_id": docs_id[0]._id}, {"bounces": data.rows[j][2]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getBouncesPerMonth " + err);
                        } else {
                            console.log("Data updated in getBouncesPerMonth");
                        }
                    });
                } else {
                    var BPM2 = new BouncesPerMonth();
                    BPM2._id = mongoose.Types.ObjectId().toString();
                    BPM2.year = data.rows[j][0];
                    BPM2.month = data.rows[j][1];
                    BPM2.bounces = data.rows[j][2];
                    BPM2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getBouncesPerMonth " + err);
                        } else {
                            console.log("Data saved in getBouncesPerMonth");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getBouncesPerMonth = getBouncesPerMonth;

// tested working!!
function getSessionDurationPerMonth(callback) {
    console.log("getSessionDurationPerMonth");
    utils.getDataFromGA("ga:year, ga:month", "ga:sessionDuration", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var SDM = mongoose.model('SessionDurationPerMonth');
            SDM.find({"year": data.rows[i][0], "month": data.rows[i][1]}, function (err, docs_id) {
                if (err) {
                    res.send(400, "error in getSessionDurationPerMonth: " + err);
                } else if (docs_id[0] != null) {
                    SDM.update({"_id": docs_id[0]._id}, {"sessionDuration": data.rows[j][2]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getSessionDurationPerMonth " + err);
                        } else {
                            console.log("Data updated in getSessionDurationPerMonth");
                        }
                    });
                } else {
                    var SDM2 = new SessionDurationPerMonth();
                    SDM2._id = mongoose.Types.ObjectId().toString();
                    SDM2.year = data.rows[j][0];
                    SDM2.month = data.rows[j][1];
                    SDM2.sessionDuration = data.rows[j][2];
                    SDM2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getSessionDurationPerMonth " + err);
                        } else {
                            console.log("Data saved in getSessionDurationPerMonth");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getSessionDurationPerMonth = getSessionDurationPerMonth;

// tested working!!
function getHitsPerMonth(callback) {
    console.log("getHitsPerMonth");
    utils.getDataFromGA("ga:year,ga:month", "ga:hits", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var HPM = mongoose.model('HitsPerMonth');
            HPM.find({"year": data.rows[i][0],"month": data.rows[i][1]}, function (err, docs_id) {
                if (err) {
                    res.send(400, "error in getHitsPerMonth: " + err);
                } else if (docs_id[0] != null) {
                    HPM.update({"_id": docs_id[0]._id}, {"hits": data.rows[j][2]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getHitsPerMonth " + err);
                        } else {
                            console.log("Data updated in getHitsPerMonth");
                        }
                    });
                } else {
                    var HPM2 = new HitsPerMonth();
                    HPM2._id = mongoose.Types.ObjectId().toString();
                    HPM2.year = data.rows[j][0];
                    HPM2.month = data.rows[j][1];
                    HPM2.hits = data.rows[j][2];
                    HPM2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getHitsPerMonth " + err);
                        } else {
                            console.log("Data saved in getHitsPerMonth");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });

}
exports.getHitsPerMonth = getHitsPerMonth;
//**Session for ⦁	Whether interaction with content leads to sales or other desired outcome******Octavians made****************
//Not working probably atm, only gives 1 id out.
function getHitsPerSessionDurationBucket(callback) {
    console.log("getHitsPerSessionDurationBucket");
    utils.getDataFromGA("ga:sessionDurationBucket", "ga:hits", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var HSDB = mongoose.model('HitsPerSessionDurationBucket');
            HSDB.find({"sessionDurationBucket": data.rows[i][0]}, function (err, docs_id) {
                if (err) {
                    res.send(400, "error in getHitsPerSessionDurationBucket: " + err);
                } else if (docs_id[0] != null) {
                    HSDB.update({"_id": docs_id[0]._id}, {"hits": data.rows[j][1]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getHitsPerSessionDurationBucket " + err);
                        } else {
                            console.log("Data updated in getHitsPerSessionDurationBucket");
                        }
                    });
                } else {
                    var HSDB2 = new HitsPerSessionDurationBucket();
                    HSDB2._id = mongoose.Types.ObjectId().toString();
                    HSDB2.sessionDurationBucket = data.rows[j][0];
                    HSDB2.hits = data.rows[j][1];
                    HSDB2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getHitsPerSessionDurationBucket " + err);
                        } else {
                            console.log("Data saved in getHitsPerSessionDurationBucket");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getHitsPerSessionDurationBucket = getHitsPerSessionDurationBucket;

// Tested working !!!
function getPageViewsAndUniquePageViewsPerMonth(callback) {
    console.log("getPageViewsAndUniquePageViewsPerMonth");
    utils.getDataFromGA("ga:year, ga:month", "ga:pageViews, ga:uniquePageviews", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var PVM = mongoose.model('PageViewsPerMonth');
            PVM.find({}, function (err, docs) {
                if (err) {
                    res.send(400, "error in getPageViewsAndUniquePageViewsPerMonth: " + err);
                } else {
                    PVM.find({"month": data.rows[i][1], "year": data.rows[i][0]}, function (err, docs_id) {
                        if (docs_id[0] != null) {
                            PVM.update({"_id": docs_id[0]._id}, {"pageViews": data.rows[j][2], "uniquePageviews": data.rows[j][3]}, function (err) {
                                if (err) {
                                    console.log("Failed to update data in getPageViewsAndUniquePageViewsPerMonth " + err);
                                } else {
                                    console.log("Data updated in getPageViewsAndUniquePageViewsPerMonth");
                                }
                            });
                        } else {
                            var PVM2 = new PageViewsPerMonth();
                            PVM2._id = mongoose.Types.ObjectId().toString();
                            PVM2.year = data.rows[j][0];
                            PVM2.month = data.rows[j][1];
                            PVM2.pageViews = data.rows[j][2];
                            PVM2.uniquePageviews = data.rows[j][3];
                            PVM2.save(function (err) {
                                if (err) {
                                    console.log("Failed to save data in getPageViewsAndUniquePageViewsPerMonth" + err);
                                } else {
                                    console.log("Data saved in getPageViewsAndUniquePageViewsPerMonth");
                                }
                            });
                        }
                        j++;
                    });
                }
            });
        }
        callback(data.rows);
    });
}
exports.getPageViewsAndUniquePageViewsPerMonth = getPageViewsAndUniquePageViewsPerMonth;

// tested working
function getEntranceRatePerMonth(callback) {
    console.log("getEntranceRatePerMonth");
    utils.getDataFromGA("ga:year,ga:month", "ga:entranceRate", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var ETR = mongoose.model('EntranceRatePerMonth');
            ETR.find({}, function (err, docs) {
                if (err) {
                    res.send(400, "error in getEntranceRatePerMonth: " + err);
                } else {
                    ETR.find({"month": data.rows[i][1], "year": data.rows[i][0]}, function (err, docs_id) {
                        if (docs_id[0] != null) {
                            ETR.update({"_id": docs_id[0]._id}, {"pageViews": data.rows[j][2]}, function (err) {
                                if (err) {
                                    console.log("Failed to update data in getEntranceRatePerMonth " + err);
                                } else {
                                    console.log("Data updated in getEntranceRatePerMonth");
                                }
                            });
                        } else {
                            var ETR2 = new EntranceRatePerMonth();
                            ETR2._id = mongoose.Types.ObjectId().toString();
                            ETR2.year = data.rows[j][0];
                            ETR2.month = data.rows[j][1];
                            ETR2.entranceRate = data.rows[j][2];
                            ETR2.save(function (err) {
                                if (err) {
                                    console.log("Failed to save data in getEntranceRatePerMonth " + err);
                                } else {
                                    console.log("Data saved in getEntranceRatePerMonth");
                                }
                            });
                        }
                        j++;
                    });
                }
            });
        }
        callback(data.rows);
    });
}
exports.getEntranceRatePerMonth = getEntranceRatePerMonth;

//Tested working !!!
function getAvrTimeOnPagePerMonth(callback) {
    console.log("getAvrTimeOnPagePerMonth");
    utils.getDataFromGA("ga:year, ga:month", "ga:avgTimeOnPage", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var ATOP = mongoose.model('AvrTimeOnPagePerMonth');
            ATOP.find({}, function (err, docs) {
                if (err) {
                    res.send(400, "error in getAvrTimeOnPagePerMonth: " + err);
                } else {
                    ATOP.find({}, function (err, docs_id) {
                        if (docs_id[0] != null) {
                            ATOP.update({"_id": docs_id[0]._id}, {"avgTimeOnPage": data.rows[j][2]}, function (err) {
                                if (err) {
                                    console.log("Failed to update data in getAvrTimeOnPagePerMonth " + err);
                                } else {
                                    console.log("Data updated in getAvrTimeOnPagePerMonth");
                                }
                            });
                        } else {
                            var ATOP2 = new AvrTimeOnPagePerMonth();
                            ATOP2._id = mongoose.Types.ObjectId().toString();
                            ATOP2.year = data.rows[j][0];
                            ATOP2.month = data.rows[j][1];
                            ATOP2.avgTimeOnPage = data.rows[j][2];
                            ATOP2.save(function (err) {
                                if (err) {
                                    console.log("Failed to save data in getAvrTimeOnPagePerMonth " + err);
                                } else {
                                    console.log("Data saved in getAvrTimeOnPagePerMonth");
                                }
                            });
                        }
                        j++;
                    });
                }
            });
        }
        callback(data.rows);
    });
}
exports.getAvrTimeOnPagePerMonth = getAvrTimeOnPagePerMonth;


// tested working well!!!
function getExitRatePerMonth(callback) {
    console.log("getExitRatePerMonth");
    utils.getDataFromGA("ga:year, ga:month", "ga:exitRate", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var EXR = mongoose.model('ExitRatePerMonth');
            EXR.find({}, function (err, docs) {
                if (err) {
                    res.send(400, "error in getExitRatePerMonth: " + err);
                } else {
                    EXR.find({"month": data.rows[i][1], "year": data.rows[i][0]}, function (err, docs_id) {
                        if (docs_id[0] != null) {
                            EXR.update({"_id": docs_id[0]._id}, {"exitRate": data.rows[j][2]}, function (err) {
                                if (err) {
                                    console.log("Failed to update data in getExitRatePerMonth " + err);
                                } else {
                                    console.log("Data updated in getExitRatePerMonth");
                                }
                            });
                        } else {
                            var EXR2 = new ExitRatePerMonth();
                            EXR2._id = mongoose.Types.ObjectId().toString();
                            EXR2.year = data.rows[j][0];
                            EXR2.month = data.rows[j][1];
                            EXR2.exitRate = data.rows[j][2];
                            EXR2.save(function (err) {
                                if (err) {
                                    console.log("Failed to save data in getExitRatePerMonth " + err);
                                } else {
                                    console.log("Data saved in getExitRatePerMonth");
                                }
                            });
                        }
                        j++;
                    });
                }
            });
        }
        callback(data.rows);
    });
}
exports.getExitRatePerMonth = getExitRatePerMonth;

// tested working
function getUsersPerSessionCount(callback) {
    console.log("getUsersPerSessionCount");
    utils.getDataFromGA("ga:sessionCount", "ga:users", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var USC = mongoose.model('UsersPerSessionCount');
            USC.find({"sessionCount": data.rows[i][0]}, function (err, docs) {
                if (err) {
                    res.send(400, "error in getUsersPerSessionCount: " + err);
                } else if (docs[0] != null) {
                    USC.update({"_id": docs[0]._id}, {"users": data.rows[j][1]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getUsersPerSessionCount " + err);
                        } else {
                            console.log("Data updated in getUsersPerSessionCount");
                        }
                    });
                } else {
                    var USC2 = new UsersPerSessionCount();
                    USC2._id = mongoose.Types.ObjectId().toString();
                    USC2.sessionCount = data.rows[j][0];
                    USC2.users = data.rows[j][1];
                    USC2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getUsersPerSessionCount " + err);
                        } else {
                            console.log("Data saved in getUsersPerSessionCount");
                        }
                    });
                    j++;
                }
            });
        }
        callback(data.rows);
    });
}
exports.getUsersPerSessionCount = getUsersPerSessionCount;

// tested working
function getNewUsersPerSessionCount(callback) {
    console.log("getNewUsersPerSessionCount");
    utils.getDataFromGA("ga:sessionCount", "ga:newUsers", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var NUSC = mongoose.model('NewUsersPerSessionCount');
            NUSC.find({"sessionCount": data.rows[i][0]}, function (err, docs) {
                if (err) {
                    res.send(400, "error in getNewUsersPerSessionCount: " + err);
                } else if (docs[0] != null) {
                    NUSC.update({"_id": docs[0]._id}, {"newUsers": data.rows[j][1]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getNewUsersPerSessionCount " + err);
                        } else {
                            console.log("Data updated in getNewUsersPerSessionCount");
                        }
                    });
                } else {
                    var NUSC2 = new NewUsersPerSessionCount();
                    NUSC2._id = mongoose.Types.ObjectId().toString();
                    NUSC2.sessionCount = data.rows[j][0];
                    NUSC2.newUsers = data.rows[j][1];
                    NUSC2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getNewUsersPerSessionCount " + err);
                        } else {
                            console.log("Data saved in getNewUsersPerSessionCount");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getNewUsersPerSessionCount = getNewUsersPerSessionCount;

// tested working very well!!
function getUsersPerDeviceCategory(callback) {
    console.log("getUsersPerDeviceCategory");
    utils.getDataFromGA("ga:deviceCategory", "ga:users", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var UDC = mongoose.model('UsersPerDeviceCategory');
            UDC.find({"deviceCategory": data.rows[i][0]}, function (err, docs) {
                if (err) {
                    res.send(400, "error in getUsersPerDeviceCategory: " + err);
                } else if (docs[0] != null) {
                    UDC.update({"_id": docs[0]._id}, {"users": data.rows[j][1]}, function (err) {
                        if (err) {
                            console.log("Failed to save data in getUsersPerDeviceCategory " + err);
                        } else {
                            console.log("Data updated in getUsersPerDeviceCategory");
                        }
                    });
                } else {
                    var UDC2 = new UsersPerDeviceCategory();
                    UDC2._id = mongoose.Types.ObjectId().toString();
                    UDC2.deviceCategory = data.rows[j][0];
                    UDC2.users = data.rows[j][1];
                    UDC2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getUsersPerDeviceCategory " + err);
                        } else {
                            console.log("Data saved in getUsersPerDeviceCategory");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getUsersPerDeviceCategory = getUsersPerDeviceCategory;


function getUsersPerDaysSinceLastSession(callback) {
    console.log("getUsersPerDaysSinceLastSession");
    utils.getDataFromGA("ga:daysSinceLastSession", "ga:users", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var UDSLS = mongoose.model('UsersPerDaysSinceLastSession');
            UDSLS.find({"daysSinceLastSession": data.rows[i][0]}, function (err, docs) {
                if (err) {
                    res.send(400, "error in getUsersPerDaysSinceLastSession: " + err);
                } else if (docs[0] != null) {
                    UDSLS.update({"_id": docs[0]._id}, {"users": data.rows[j][1]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getUsersPerDaysSinceLastSession " + err);
                        } else {
                            console.log("Data updated in getUsersPerDaysSinceLastSession");
                        }
                    });
                } else {
                    var UDSLS2 = new UsersPerDaysSinceLastSession();
                    UDSLS2._id = mongoose.Types.ObjectId().toString();
                    UDSLS2.daysSinceLastSession = data.rows[j][0];
                    UDSLS2.users = data.rows[j][1];
                    UDSLS2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getUsersPerDaysSinceLastSession " + err);
                        } else {
                            console.log("Data saved in getUsersPerDaysSinceLastSession");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getUsersPerDaysSinceLastSession = getUsersPerDaysSinceLastSession;

// tested working very well!!!
function getNewUsersPerDeviceCategory(callback) {
    console.log("getNewUsersPerDeviceCategory");
    utils.getDataFromGA("ga:deviceCategory", "ga:newUsers", startDate, endDate, "50", function (results) {
        var data = JSON.parse(results);
        var j = 0;
        for (var i = 0; i < data.rows.length; i++) {
            var NUDC = mongoose.model('NewUsersPerDeviceCategory');
            NUDC.find({"deviceCategory": data.rows[i][0]}, function (err, docs_id) {
                if (err) {
                    res.send(400, "error in getNewUsersPerDeviceCategory: " + err);
                } else if (docs_id[0] != null) {
                    NUDC.update({"_id": docs_id[0]._id}, {"newUsers": data.rows[j][1]}, function (err) {
                        if (err) {
                            console.log("Failed to update data in getNewUsersPerDeviceCategory " + err);
                        } else {
                            console.log("Data updated in getNewUsersPerDeviceCategory");
                        }
                    });
                } else {
                    var NUDC2 = new NewUsersPerDeviceCategory();
                    NUDC2._id = mongoose.Types.ObjectId().toString();
                    NUDC2.deviceCategory = data.rows[j][0];
                    NUDC2.newUsers = data.rows[j][1];
                    NUDC2.save(function (err) {
                        if (err) {
                            console.log("Failed to save data in getNewUsersPerDeviceCategory " + err);
                        } else {
                            console.log("Data saved in getNewUsersPerDeviceCategory");
                        }
                    });
                }
                j++;
            });
        }
        callback(data.rows);
    });
}
exports.getNewUsersPerDeviceCategory = getNewUsersPerDeviceCategory;

function getSearch(userID, search, callback){
    console.log("getSearch started by "+ userID+ " with search " +search);
    var user = mongoose.model('User');
    user.find({'email':userID},function(err,doc){
       console.log("Her er bruger "+doc);
        callback(doc);
    });

}
exports.getSearch = getSearch;

function getDataFromFB() {

    var viewJSON = {
        data: []
    };
    var face = "";

    utils.getDataFromFB("1208838443", function (results) {
        face = JSON.parse(results);
        var FBM = new FacebookModel();
        FBM._id = face.id;
        FBM.name = face.name;
        FBM.locale = face.locale;
        FBM.fbUserName = face.username;
        FBM.gender = face.gender;
        FBM.save(function (err) {
            if (err) {
                console.log("Failed to save data");
                console.log(err);
            } else {
                console.log("Data saved");
            }
        });
        viewJSON.data.push({
            id: face.id,
            name: face.name,
            locale: face.locale,
            userName: face.username,
            gender: face.gender
        });
        //console.log(viewJSON);
        return viewJSON;
    });
    return viewJSON;
}

exports.getDataFromFB = getDataFromFB;

function getAllData(e) {
    e.preventDefault();
    var viewJSON = {
        data: []
    };
    var face = "";
    var dataJSON = {};

    utils.getDataFromFB("100004008297905", function (results) {
        console.log("FB:" + results);
        face = JSON.parse(results);
        //       res.send(face);
    });
    utils.getDataFromGA("ga:country", "ga:bounceRate", startDate, endDate, "50", function (results) {
        console.log(face);
        var data = JSON.parse(results);
        for (var i = 0; i < data.rows.length; i++) {
            viewJSON.data.push({
                name: face.name,
                gender: face.gender,
                country: data.rows[i][0],
                bounceRate: data.rows[i][1]
            });
        }
        console.log(viewJSON);
        res.send(viewJSON);
    });
}
