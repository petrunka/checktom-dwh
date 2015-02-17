var mongoose = require('mongoose');
var UsersPerMonth = mongoose.model('UsersPerMonth');
var admin = mongoose.model('AdminUserSchema');
var utils = require('../controllers/utils/dataWareHouseUtils');
var pull = require('../public/modules/DataWareHouse/DataWareHousePull');
var push = require('../public/modules/DataWareHouse/DataWareHousePush');
var DBpull = require('../public/modules/DataWareHouse/views/DataWareHouseDBPull');
var test = require('../public/modules/DataWareHouse/DWHtest');
var SessionDurationPerMonth = require('mongoose').model('SessionDurationPerMonth');
var gigsModel = require('mongoose').model('Gigs');
var users = mongoose.model('User');
var crypto = require('crypto');
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

switch (extendedMonth) {
    case '01':
        var oldDay = extendedDay;
        var oldMonth = '12';
        var oldYear = Day.getFullYear() - 1;
    case '03':
        if(extendedDay>=29) {
            var oldDay = 28;
            var oldMonth = extendedMonth - 1;
            var oldYear = Day.getFullYear();
        } else {
            var oldDay = extendedDay;
            var oldMonth = extendedMonth - 1;
            var oldYear = Day.getFullYear();
        }
    case '05','07',10,12:
        if(extendedDay===31) {
            var oldDay = 30;
            var oldMonth = extendedMonth - 1;
            var oldYear = Day.getFullYear();
        } else {
            var oldDay = extendedDay;
            var oldMonth = extendedMonth - 1;
            var oldYear = Day.getFullYear();
        }
    case '02','04','06','08','09',11:
        var oldDay = extendedDay;
        var oldMonth = extendedMonth - 1;
        var oldYear = Day.getFullYear();
    default: console.log("An error occurred!");
}


var startDay = oldYear + "," + oldMonth + "," + oldDay;
var endDay = Day.getFullYear() + "," + extendedMonth + "," + extendedDay;
//Test function
exports.roman = function (req, res) {
    console.log('Roman initiated');
    utils.getDataFromFB("1208838443", function (results) {
        console.log("FB:" + results);
    });
    utils.getDataFromGA("ga:referralPath", "ga:organicSearches", "2013-04-08", "2014-08-09", "1000", function (results) {
        res.send("GA" + JSON.parse(JSON.stringify(results)));

    });
};

exports.bjarke = function (req, res) {
    console.log('bjarke initiated');
    pull.getSearch('bjarke@ejsensie.dk','pc',function(data){
        res.send(200,data);
    });
};


exports.vladimir = function (req, res) {

    DBpull.getNewUsersToday(function (data) {
        res.send(data);
        console.log(data);
    });
    console.log("data printed");

};

exports.usersLastMonth = function(req, res) {
    DBpull.getNewUsersLastMonth(function(data) {
            res.send(data);
            console.log(data);
    });
    console.log("data printed");
};

exports.adsLastMonth = function(req, res) {
    DBpull.getNewAdsLastMonth(function(data) {
        res.send(data);
        console.log(data);
    });
    console.log("data printed");
};

exports.returningUsers = function(req, res) {
    DBpull.getReturningUsers(function(data) {
        res.send(data);
        console.log(data);
    });
    console.log("data printed");
};

exports.getAllUsers = function (req, res) {
    DBpull.getAllUsers(function (data) {
        res.send(data);
    });
};


exports.getAds = function (req, res) {
    DBpull.getAllAds(function (data) {
        res.send(data);
        console.log(data);
    });
};

exports.getArticles = function(req, res) {
    DBpull.getAllArticles(function(data) {
        res.send(data);
        console.log(data);
    });
};

exports.getFbUsers = function(req,res) {
    DBpull.getUsersRegisteredWithFacebook(function(data) {
        res.send(data);
        console.log(data);
    });
};

exports.octavian = function (req, res) {

    console.log('octavian initiated');
    var startDate = {
        day: 16,
        month: 8,
        year: 2014
    };
    var endDate = {
        day: 17,
        month: 9,
        year: 2014
    };
    console.log(startDate);
    console.log(endDate);
    DBpull.getDataSetLocaleGender(function (data) {
        console.log('data is redy' + data);
        res.send(data);
    });

};

exports.getActiveUsers = function (req, res) {
    DBpull.getAllActiveUsers(function (data) {
        res.send(data);
    });
};

exports.getUserByDate = function (req, res) {
    //var startDate = req.query.startDate;
    //var endDate = req.query.endDate;
    var startDate = startDay;
    var endDate = endDay;
    DBpull.getUsersCreatedAt(startDate, endDate, function (err, data) {
        if (err) {
            res.send(200, err);
        } else {
            res.send(200, data);
        }
    });
};

exports.getAdsByDate = function(req, res) {
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    DBpull.getAdsCreatedAt(startDate, endDate, function(err, data) {
        if(err) {
            res.send(200, err);
        } else {
            res.send(200, data);
        }
    })
};

exports.getInactiveUsers = function (req, res) {
    DBpull.getAllUnActiveUsers(function (data) {
        res.send(data);
    });
};
exports.getNewAds = function (req, res) {
    DBpull.getNewAdsToday(function (data) {
        res.send(data);
    });
};

exports.adminLogin = function (req, res) {
    var data = req.body;
    data.email = data.email.replace('=', '');
    data.email = data.email.replace('$', '');
    data.password = data.password.replace('=', '');
    data.password = data.password.replace('$', '');
    data.password = data.password.replace('(', '');
    data.password = data.password.replace(')', '');
    data.password = data.password.replace('{', '');
    data.password = data.password.replace('}', '');
    data.password = data.password.replace(';', '');
    data.password = data.password.replace(':', '');
    data.password = data.password.replace('"', '');
    admin.find({"email": data.email}, function (err, docs) {
        if (docs != 0) {
            if (docs[0].encryptPassword(data.password) == docs[0].hashed_password) {
                req.session.user_id = docs[0].email + "/" + docs[0].hashed_password;
                res.send(200, true);
            } else {
                res.send(200, false);
            }
        } else {
            res.send(200, "Email or password are wrong");
        }
    });
};

exports.deactiveUser = function (req, res) {
    var data = req.body;
    var retData = {
        "status": "err",
        "email": data.email
    };
    users.update({"email": data.email}, {"active": 0}, function (err, docs) {
        if (err) {
            retData.status = err;
            res.send(200, retData);
        } else {
            retData.status = "ok";
            res.send(200, retData);
        }
    });

};

exports.authAdminUser = function (req, res) {
    var check;
    if (req.session.user_id != null) {
        admin.find({}, function (err, docs) {
            if (err) {
                res.send(401, err);
            } else {
                for (var i = 0; i < docs.length; i++) {
                    if (req.session.user_id == docs[i].email + "/" + docs[i].hashed_password) {
                        check = true;
                        res.send(200, true);
                    }
                }
                if (!check) {
                    res.send(200, false);
                }
            }
        });
    }
};

exports.adminLogout = function (req, res) {
    delete req.session.user_id;
    res.send(200, true);
};

exports.activeUser = function (req, res) {
    var data = req.body;
    var retData = {
        "status": "err",
        "email": data.email
    };
    users.update({"email": data.email}, {"active": 1}, function (err, docs) {
        if (err) {
            retData.status = err;
            res.send(200, retData);
        } else {
            retData.status = "ok";
            res.send(200, retData);
        }
    });

};

exports.createTestAdmin = function (req, res) {
    console.log(req.body);
    var data = req.body;
    var AUM = new admin();
    console.log(Date());

    AUM._id = mongoose.Types.ObjectId().toString();
    AUM.email = data.email;
    AUM.password = data.password;
    AUM.created_at = Date();
    AUM.adminType = "Full";

    AUM.save(function (err, docs) {
        if (err) {
            res.send(400, "Error " + err);
        } else {
            res.send(200, "Ok");
        }
    });
};


exports.getNewAndTotalUsersPerMonth = function (req, res) {
    pull.getNewAndTotalUsersPerMonth(function (data) {
        res.send(data);
    });
};

exports.analyticsSec = function (req, res) {
    pull.getPercentNewSessionsPerMonth(function (data) {
        res.send(data);
    });
};

exports.bounceRatePerMonth = function(req, res) {
    pull.getBouncesPerMonth(function(data) {
        res.send(data);
    });
};

exports.averageTimeOnPage = function(req, res) {
    pull.getAvrTimeOnPagePerMonth(function(data) {
        res.send(data);
    });
};

exports.percentNewSessions = function(req, res) {
    pull.getPercentNewSessionsPerMonth(function(data) {
        res.send(data);
    });
};

exports.usersPerDeviceCategory = function(req, res) {
    pull.getUsersPerDeviceCategory(function(data) {
        res.send(data);
    });
};