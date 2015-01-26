/**
 * Created by admin on 4.10.2014 г..
 */
var utils = require("./views/dataWareHouseUtils");
var startDate = "2011-08-01";
var endDate = "2014-10-06";
var NewAndTotalUsersPerMonth = require('mongoose').model('NewAndTotalUsersPerMonth');
var usersPerBrowser = require('mongoose').model('UsersPerBrowser');
var mongoose = require('mongoose');
Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
};

function getNewTotalUsersPerMonth(callback) {
    utils.getDataFromGA("ga:date", "ga:users, ga:newUsers", startDate, endDate, "1300", function (results) {
        var data = JSON.parse(results);
        var month;

        for(var i = 0; i<data.rows.length; i++) {
            month = data.rows[i][0].substring(0,6);
            data.rows[i][0] = month.substring(4,6) + "/" + month.substring(0,4);
        }

        var arrayWithManipulatedDataFromGA = [];
        var monthNumber;
        var users = 0;
        var newUsers = 0;
        var arrayContainingMonths = [];

        for(var i = 0; i< data.rows.length; i++) {
            if(!arrayContainingMonths.contains(data.rows[i][0])) {
                arrayContainingMonths.push(data.rows[i][0]);
            }
        }

        for(var i=0; i< arrayContainingMonths.length; i++) {
            for(var j=0; j<data.rows.length; j++) {
                var storeManipulatedData = {
                    month: 0,
                    users :0,
                    newUsers:0
                };
                if(arrayContainingMonths[i] === data.rows[j][0]) {
                    monthNumber = arrayContainingMonths[i];
                    users = users + parseInt(data.rows[j][1]);
                    newUsers = newUsers + parseInt(data.rows[j][2]);
                }
                storeManipulatedData.month = monthNumber;
                storeManipulatedData.users = users;
                storeManipulatedData.newUsers = newUsers;
            }
            arrayWithManipulatedDataFromGA.push(storeManipulatedData);

            monthNumber = 0;
            users =0;
            newUsers=0;
        }

        for(var i = 0; i< arrayWithManipulatedDataFromGA.length; i++) {
            var MonthNumber = arrayWithManipulatedDataFromGA[i].month;
            var Users = arrayWithManipulatedDataFromGA[i].users;
            var NewUsers = arrayWithManipulatedDataFromGA[i].newUsers;
            var udc = mongoose.model('NewAndTotalUsersPerMonth');
            udc.find({}, function(err, docs) {
                if(err) {
                    res.send(400, "Det er sket alvorlig fejl! " + err);
                }
                else {
                    console.log(monthNumber);
                    var numberOfMonth = MonthNumber;
                    var bruger = Users;
                    var nyBruger = NewUsers;
                    if(arrayWithManipulatedDataFromGA.length == docs.length) {


                        udc.update({"month": numberOfMonth}, {"users": bruger}, {"newUsers": nyBruger}, function (err) {
                            if (err) {
                                console.log("Failed to update data");
                            } else {
                                j++;
                                console.log("Data updated");

                            }
                        });
                    }
                    else {
                        console.log(arrayWithManipulatedDataFromGA[i]);
                        var UDC2 = new NewAndTotalUsersPerMonth();
                        UDC2._id = mongoose.Types.ObjectId().toString();
                        UDC2.month = numberOfMonth;
                        UDC2.users = bruger;
                        UDC2.newUsers = nyBruger;
                        UDC2.save(function (err) {
                            if (err) {
                                console.log("Failed to save data");
                            } else {
                                console.log("Data saved");
                            }
                        });
                    }
                }
            });
        }
        callback(arrayWithManipulatedDataFromGA);
    });
}
exports.getNewTotalUsersPerMonth = getNewTotalUsersPerMonth;

function getUsersPerBrowser(callback) {
    utils.getDataFromGA("ga:browser", "ga:users", startDate, endDate, "1300", function(results) {
        var data = JSON.parse(results);
        var arrayWithManipulatedData = [];
        var browser = "";
        var users = 0;
        for(var i=0; i<data.rows.length; i++) {
            var storeTempData = {
                browser:0,
                users:0
            };
            browser = data.rows[i][0];
            users = data.rows[i][1];
            storeTempData.browser = browser;
            storeTempData.users = users;
            arrayWithManipulatedData.push(storeTempData);
            users = 0;
            browser="";
        }

        callback(arrayWithManipulatedData);
    });
}
exports.getUsersPerBrowser = getUsersPerBrowser;

function getUsersPerCountry(callback) {
    utils.getDataFromGA("ga:country", "ga:users", startDate, endDate, "1300", function(results) {
        var data = JSON.parse(results);
        var arrWithManipulatedData = [];
        var country = "";
        var users = 0;
        for(var i=0; i<data.rows.length; i++) {
            var storeTemporaryData = {
                country:0,
                users:0
            };
            country = data.rows[i][0];
            users = data.rows[i][1];
            storeTemporaryData.country = country;
            storeTemporaryData.users = users;
            arrWithManipulatedData.push(storeTemporaryData);
            users = 0;
            country="";
        }
        callback(arrWithManipulatedData);
    });
}
exports.getUsersPerCountry = getUsersPerCountry;