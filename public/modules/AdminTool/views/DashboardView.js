define(
    [
        'app',
        'jade!../templates/DashboardTemplate',
        'backbone',
        '../views/AdminToolsView',
        '../views/DashboardView',
        '../../../assets/libs/chart/Chart.js',
        'jquery',
        'jqueryUI',
        'jqueryMin',
        'jqueryTouch',
        'bootstrap',
        'bootstrapSelect',
        'bootstrapSwitch',
        'flatuiCheckbox',
        'flatuiRadio',
        'flatuiTags',
        'flatuiplaceholder',
        'flatuiApp',
        'flatUIpro',
        'backbone_validation'
    ],
    function (App, DashboardTemplate, Backbone) {
        var self;
        var userData;
        var adsData;
        var newUsersToday, totalUsers, newAdsToday, totalAds;
        var userPerMonth, sessionPerMonth, bounceRatePerMonth, avrTimeOnPagePerMonthData, percentNewSessionsData;
        var usersPerDeviceCategoryData, newAndTotalUsersPerMonthData;
        var DashboardView = Backbone.Marionette.Layout.extend({
            requireLogin: true,
            template: function () {
                console.log("render Dashboard View template");
                var that = this;
                return _.template(DashboardTemplate());
            },
            initialize: function (options) {
                this.options = options || {};
                this.on("change:tryData", function (data) {
                    alert("Changes has happened");
                });
            },
            regions: {},
            onShow: function (query) {
                self = this;
                $('#mainView').hide();
                $.ajax({
                    url: '/authAdminUser',
                    type: 'GET',
                    data: query,
                    success: function (data) {
                        if (!data) {
                            alert("Admin logging is needed to watch this page");
                            window.location.reload();
                        }
                    }
                });
                $.ajax({
                    url: '/vladimir',
                    type: 'GET',
                    success: function (data) {
                        newUsersToday = data.length;
                        $('#nu').append("Number of new users today: " + newUsersToday + "<br>");
                    }
                });
                $.ajax({
                    url: '/getAllUsers',
                    type: 'GET',
                    success: function (data) {
                        totalUsers = data.length;
                        userData = data;
                        self.drawUsers(userData);
                        $('#User').hide();
                        $("#tu").append("Number of registered users by now: " + totalUsers);
                    }
                });
                $.ajax({
                    url: '/getAds',
                    type: 'GET',
                    success: function (data) {
                        totalAds = data.length;
                        adsData = data;
                        self.drawAds(adsData);
                        $('#Ads').hide();
                        $("#ta").append("Number of ads: " + totalAds);
                    }
                });
                $.ajax({
                    url: '/getNewAds',
                    type: 'GET',
                    success: function (data) {
                        newAdsToday = data.length;
                        $('#na').append("Number of new ads today: " + newAdsToday + "<br>");
                    }
                });
                $.ajax({
                    url: '/bounceRatePerMonth',
                    type: 'GET',
                    success: function (data) {
                        bounceRatePerMonth = data;
                        self.drawSmallBounceRate();
                    }
                });
                $.ajax({
                    url: '/averageTimeOnPage',
                    type: 'GET',
                    success: function (data) {
                        avrTimeOnPagePerMonthData = data;
                        self.drawSmallAvrTimeOnPagePerMonth();
                    }
                });
                $.ajax({
                    url: '/percentNewSessions',
                    type: 'GET',
                    success: function (data) {
                        percentNewSessionsData = data;
                        self.drawSmallPercentNewSessions();
                    }
                });
                $.ajax({
                    url: '/usersPerDeviceCategory',
                    type: 'GET',
                    success: function (data) {
                        usersPerDeviceCategoryData = data;
                        self.drawSmallUsersPerDeviceCategory();
                    }
                });
                $.ajax({
                    url: '/getNewAndTotalUsersPerMonth',
                    type: 'GET',
                    success: function (data) {
                        newAndTotalUsersPerMonthData = data;
                        self.drawSmallNewAndTotalUsersPerMonth();
                    }
                });
                $('.datepicker').datepicker({
                        showOtherMonths: true,
                        selectOtherMonths: true,
                        dateFormat: "yy-mm-dd",
                        yearRange: '-1:+1',
                        changeMonth: true,
                        changeYear: true
                    }).prev('.btn').on('click', function (e) {
                        e && e.preventDefault();
                        $('.datepicker').focus().blur();
                    });
                $.extend($.datepicker, {
                    _checkOffset: function (inst, offset) {
                        return offset
                    }
                });
                setTimeout(function () {
                    console.log("Time");
                    self.update();
                }, 5000);
            },

            events: {
                'click #viewAllUsers': 'viewAllUsers',
                'click #totalUsers': 'viewAllUsers',
                'click #dashboard': 'dashboard',
                'click #logout': 'logout',
                'click #activitylog': 'activitylog',
                'click #adsPerDate': 'adsPerDate',
                'click #totalAds': 'adsPerDate',
                'click #getLog': 'getLog',
                'click #getSecondLog': 'getSecondLog',
                'click #newAndTotalUsersPerMonth': 'newAndTotalUsersPerMonth',
                'click #nr5': 'newAndTotalUsersPerMonth',
                'click #check': 'checkChange',
                'click #bounceRateLbl': 'bounceRateLbl',
                'click #bounces': 'bounces',
                'click #bounceRate': 'bounces',
                'click #avgTimeOnPage': 'avgTimeOnPage',
                'click #avgTimeOnPageView': 'avgTimeOnPage',
                'click #percentNewSession': 'percentNewSession',
                'click #nr6': 'percentNewSession',
                'click #usersPerDeviceCategory': 'usersPerDeviceCategory',
                'click #usersPerDevice': 'usersPerDeviceCategory',
                'click #titleLabel': 'returnToDashboard'
            },

            returnToDashboard: function (event) {
                this.dashboard(event);
            },
            drawSmallBounceRate: function () {
                $('#bounceRate').append('<div id="containerSmallBounce" class="row">' +
                    '<col-md-12>' +
                    '<div id="canvasArea2" style="padding:20px;">' +
                    '<canvas id="bounceRateSmall" style="width:300px; height:150px; overflow:hidden;"></canvas>' +
                    '</div>' +
                    '</col-md-12>' +
                    '</div>');
                var analyticsItems = [];
                var analyticsItemsSize;
                console.log("success");
                analyticsItemsSize = bounceRatePerMonth.length;
                var labels = [];
                var analyticsData = [];
                for (var i = 0; i < analyticsItemsSize; i++) {
                    analyticsItems.push(bounceRatePerMonth[i][1] + "." + bounceRatePerMonth[i][0] + ": " + bounceRatePerMonth[i][2] + " bounces");
                    labels.push(bounceRatePerMonth[i][1] + "." + bounceRatePerMonth[i][0]);
                    analyticsData.push(bounceRatePerMonth[i][2]);
                }
                var analyticsItemsHtml = "analyticsItems:";
                for (var i = 0; i < analyticsItems.length; i++) {
                    analyticsItemsHtml = analyticsItemsHtml + "<p>" + analyticsItems[i] + "</p>";
                }
                var canvas = document.getElementsByTagName('canvas')[0];
                canvas.width = 300;
                canvas.height = 150;
                var lineData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Bounces per month",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: analyticsData
                        }
                    ]
                };
                var ctx6 = document.getElementById("bounceRateSmall").getContext("2d");
                window.myLine = new Chart(ctx6).Line(lineData, {
                    responsive: false
                });
            },
            drawSmallNewAndTotalUsersPerMonth: function () {
                $('#nr5').append('<div id="containerSmallNewAndTotalUsersPerMonth" class="row">' +
                    '<col-md-12>' +
                    '<div id="canvasArea1" style="padding:20px;">' +
                    '<canvas id="NewAndTotalUsersPerMonthSmall" style="width:300px; height:150px; overflow:hidden;"></canvas>' +
                    '</div>' +
                    '</col-md-12>' +
                    '</div>');
                var labels = [];
                var dataSet1 = [];
                var dataSet2 = [];
                for (var i = 0; i < newAndTotalUsersPerMonthData.length; i++) {
                    labels.push(newAndTotalUsersPerMonthData[i][1] + "." + newAndTotalUsersPerMonthData[i][0]);
                    dataSet1.push(newAndTotalUsersPerMonthData[i][2]);
                    dataSet2.push(newAndTotalUsersPerMonthData[i][3]);
                }
                var lineData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "New Users",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: dataSet1

                        },
                        {
                            label: "Total Users",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: dataSet2
                        }

                    ]
                };
                var canvas = document.getElementsByTagName('canvas')[0];
                canvas.width = 300;
                canvas.height = 150;
                var ctx = document.getElementById("NewAndTotalUsersPerMonthSmall").getContext("2d");
                window.myLine = new Chart(ctx).Line(lineData, {
                    responsive: false
                });
            },
            drawSmallAvrTimeOnPagePerMonth: function () {
                $('#avgTimeOnPageView').append('<div id="containerSmallAvrTimeOnPage" class="row">' +
                    '<col-md-12>' +
                    '<div id="canvasArea3" style="padding:20px;">' +
                    '<canvas id="avgTimeOnPageSmall" style="width:300px; height:150px; overflow:hidden;"></canvas>' +
                    '</div>' +
                    '</col-md-12>' +
                    '</div>');
                var analyticsItems = [];
                var analyticsItemsSize;
                console.log("success");
                analyticsItemsSize = avrTimeOnPagePerMonthData.length;
                var labels = [];
                var analyticsData = [];
                for (var i = 0; i < analyticsItemsSize; i++) {
                    analyticsItems.push(avrTimeOnPagePerMonthData[i][1] + "." + avrTimeOnPagePerMonthData[i][0] + ": " + avrTimeOnPagePerMonthData[i][2] + " avg. seconds per month on the page");
                    labels.push(avrTimeOnPagePerMonthData[i][1] + "." + avrTimeOnPagePerMonthData[i][0]);
                    analyticsData.push(avrTimeOnPagePerMonthData[i][2]);
                }
                var analyticsItemsHtml = "analyticsItems:";
                for (var i = 0; i < analyticsItems.length; i++) {
                    analyticsItemsHtml = analyticsItemsHtml + "<p>" + analyticsItems[i] + "</p>";
                }
                console.log(avrTimeOnPagePerMonthData);
                var canvas = document.getElementsByTagName('canvas')[0];
                canvas.width = 300;
                canvas.height = 150;
                var lineData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Avg time on page per month",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: analyticsData
                        }
                    ]
                };
                var chart3 = document.getElementById("avgTimeOnPageSmall").getContext("2d");
                window.myLine = new Chart(chart3).Line(lineData, {
                    responsive: false
                });
            },
            drawSmallPercentNewSessions:function(){
                $('#nr6').append('<div id="containerSmallPercentNewSessions" class="row">' +
                    '<col-md-12>' +
                    '<div id="canvasArea4" style="padding:20px;">' +
                    '<canvas id="percentNewSessionsSmall" style="width:300px; height:150px; overflow:hidden;"></canvas>' +
                    '</div>' +
                    '</col-md-12>' +
                    '</div>');
                var analyticsItems = [];
                var analyticsItemsSize;
                console.log("success");
                analyticsItemsSize = percentNewSessionsData.length;
                var labels = [];
                var analyticsData = [];
                for (var i = 0; i < analyticsItemsSize; i++) {
                    analyticsItems.push(percentNewSessionsData[i][1] + "." + percentNewSessionsData[i][0] + ": " + percentNewSessionsData[i][2] + " % new sessions");
                    labels.push(percentNewSessionsData[i][1] + "." + percentNewSessionsData[i][0]);
                    analyticsData.push(percentNewSessionsData[i][2]);
                }
                var analyticsItemsHtml = "analyticsItems:";
                for (var i = 0; i < analyticsItems.length; i++) {
                    analyticsItemsHtml = analyticsItemsHtml + "<p>" + analyticsItems[i] + "</p>";
                }
                console.log(percentNewSessionsData);
                var canvas = document.getElementsByTagName('canvas')[0];
                canvas.width = 300;
                canvas.height = 150;
                var lineData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "% new sessions per month",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: analyticsData
                        }
                    ]
                };
                var chart4 = document.getElementById("percentNewSessionsSmall").getContext("2d");
                window.myLine = new Chart(chart4).Line(lineData, {
                    responsive: false
                });
            },
            drawSmallUsersPerDeviceCategory:function (e) {
                $('#usersPerDevice').append(
                        '<div id="containerSmallUsersPerDeviceCategory" class="row">' +
                        '<col-md-12>' +
                        '<div id="canvasArea5" style="padding:20px;">' +
                        '<canvas id="usersPerDeviceCategorySmall" style="width:300px; height:150px; overflow:hidden;"></canvas>' +
                        '</div>'
                        + '</col-md-12>' +
                        '</div>'
                );
                var analyticsItems = [];
                var analyticsItemsSize;
                console.log("success");
                analyticsItemsSize = usersPerDeviceCategoryData.length;
                var labelsDevices = [];
                var analyticsData = [];
                for (var i = 0; i < analyticsItemsSize; i++) {
                    analyticsItems.push(usersPerDeviceCategoryData[i][1] + " users using a device " + usersPerDeviceCategoryData[i][0]);
                    labelsDevices.push(usersPerDeviceCategoryData[i][0]);
                    analyticsData.push(usersPerDeviceCategoryData[i][1]);
                }
                var analyticsItemsHtml = "analyticsItems:";
                for (var i = 0; i < analyticsItemsSize; i++) {
                    analyticsItemsHtml = analyticsItemsHtml + "<p>" + analyticsItems[i] + "</p>";
                }
                console.log(usersPerDeviceCategoryData);
                var canvas = document.getElementsByTagName('canvas')[0];
                canvas.width = 300;
                canvas.height = 150;
                var lineData = {
                    labels: labelsDevices,
                    datasets: [
                        {
                            label: "Users",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: analyticsData
                        }
                    ]
                };
                var chart7 = document.getElementById("usersPerDeviceCategorySmall").getContext("2d");
                window.myLine = new Chart(chart7).Line(lineData, {
                    responsive: false
                });
            },
            drawUsers: function (data) {
                if ($('#User').length === 0) {
                    $('#main-view').append("<label id='User'></label>");
                    $("#User").append("<tr><td align='middle'>Profile picture</td> | <td align='middle'>Name</td> | <td align='middle'>Email</td> | <td align='middle'>Created at</td> |<td align='middle'>Status</td></tr><br>");
                    $("#User").append("<tr id='dummyUser'><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'></td> | <td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'>0</td> | <td  align='middle' style='border: 2px #C0C0C0 solid; width: 250px'>0</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'></td> | <td align='middle' style='border: 2px #C0C0C0 solid; width: 50px'><input type='checkbox' id='check' value='0'>0</input></td></tr><br>");
                    $('#dummyUser').hide();
                    var date = data[i].created_at.split("T");
                    var createdDate = date[0].split("-");
                    console.log("created date: " + createdDate);

                    for (var i = 0; i < data.length; i++) {
                        var checked = "";
                        if (data[i].active) {
                            checked = "checked='checked'";
                        }
                            $("#User").append("<tr id='" + data[i].email + "'><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'>"+data[i].profilePicture +"</td> | </td><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + data[i].name + "</td> | <td  align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + data[i].email + "</td> | <td align='middle' style='border: 2px #C0C0C0 solid; width: 50px'>"+data[i].created_at+"</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 50px'><input type='checkbox' id='check' value='" + data[i].email + "' method='post' " + checked + " ></input></td></tr><br>");
                    }
                } else {
                    $("#User").empty();
                    $("#User").append("<tr><td align='middle'>Profile picture</td> | <td align='middle'>Name</td> | <td align='middle'>Email</td> | <td align='middle'>Created at</td> |<td align='middle'>Status</td></tr><br>");
                    $("#User").append("<tr id='dummyUser'><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'>0</td> | <td  align='middle' style='border: 2px #C0C0C0 solid; width: 250px'>0</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 50px'><input type='checkbox' id='check' value='0'>0</input></td></tr><br>");
                    $('#dummyUser').hide();
                    var date = data[i].created_at.split("T");
                    var createdDate = date[0].split("-");

                    for (var i = 0; i < data.length; i++) {
                        var checked = "";
                        if (data[i].active) {
                            checked = "checked='checked'";
                        }
                            $("#User").append("<tr id='" + data[i].email + "'><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'>"+data[i].profilePicture +"</td> | </td><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + data[i].name + "</td> | <td  align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + data[i].email + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'>"+data[i].created_at+"</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 50px'><input type='checkbox' id='check' value='" + data[i].email + "' method='post' " + checked + " ></input></td></tr><br>");

                    }
                }
            },
            drawUsersDate: function (startDate, endDate) {
                if ($('#UserDate').length === 0) {
                    $('#main-view').append("<label id='UserDate'></label>");
                    $('#UserDate').append("<tr><td align='middle'>Name</td> | <td align='middle'>Email</td><td align='middle'>Created at</td><td align='middle'>Status</td></tr><br>");
                    for (var i = 0; i < userData.length; i++) {
                        var checked = "";
                        if (userData[i].active) {
                            checked = "checked='checked'";
                        }
                        var date = userData[i].created_at.split("T");
                        var createdDate = date[0].split("-");
                        console.log("created date: " + createdDate);
                        if (new Date(createdDate[0], createdDate[1], createdDate[2]) >= new Date(startDate.year, startDate.month, startDate.day) && new Date(createdDate[0], createdDate[1], createdDate[2]) <= new Date(endDate.year, endDate.month, endDate.day)) {
                            $('#UserDate').append("<tr><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + userData[i].name + "</td> | <td  align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + userData[i].email + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 200px'> " + date[0] + "</td><input type='checkbox' id='check' value='" + userData[i].email + "' method='post' " + checked + " ></input></td></tr><br>");
                        }
                    }
                } else {
                    $('#UserDate').empty();
                    $('#UserDate').append("<tr><td align='middle'>Name</td> | <td align='middle'>Email</td><td align='middle'>Created at</td><td align='middle'>Status</td></tr><br>");
                    for (var i = 0; i < userData.length; i++) {
                        var checked = "";
                        if (userData[i].active) {
                            checked = "checked='checked'";
                        }
                        var date = userData[i].created_at.split("T");
                        var createdDate = date[0].split("-");
                        if (new Date(createdDate[0], createdDate[1], createdDate[2]) >= new Date(startDate.year, startDate.month, startDate.day) && new Date(createdDate[0], createdDate[1], createdDate[2]) <= new Date(endDate.year, endDate.month, endDate.day)) {
                            $('#UserDate').append("<tr><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + userData[i].name + "</td> | <td  align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + userData[i].email + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 200px'> " + date[0] + "</td><input type='checkbox' id='check' value='" + userData[i].email + "' method='post' " + checked + " ></input></td></tr><br>");
                        }
                    }
                }
            },
            drawAds: function () {
                if ($('#Ads').length === 0) {
                    $('#main-view').append("<label id='Ads'></label>");
                    $("#AdsDate").append("<tr><td align='middle'>Event</td><td align='middle'>Company</td><td>Date</td><td>Pay Status</td><td align='middle'>Created at</td></tr><br>");
                    for (var i = 0; i < adsData.length; i++) {
                        $("#AdsDate").append("<tr><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + adsData[i].EventName + "</td> | <td  align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + adsData[i].CompanyName + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 150px'> " + adsData[i].Date + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 50px'>" + adsData[i].HasBeenPaid + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 150px'>" + adsData[i].CreatedAt + "</td></tr><br>");
                    }
                } else {
                    $("#Ads").empty();
                    $("#AdsDate").append("<tr><td align='middle'>Event</td><td align='middle'>Company</td><td>Date</td><td>Pay Status</td><td align='middle'>Created at</td></tr><br>");

                    for (var i = 0; i < adsData.length; i++) {
                        $("#AdsDate").append("<tr><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + adsData[i].EventName + "</td> | <td  align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + adsData[i].CompanyName + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 150px'> " + adsData[i].Date + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 50px'>" + adsData[i].HasBeenPaid + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 150px'>" + adsData[i].CreatedAt + "</td></tr><br>");
                    }
                }
            },
            drawAdsDate: function (startDate, endDate) {
                if ($('#AdsDate').length === 0) {
                    $('#main-view').append("<label id='AdsDate'></label>");
                    $("#AdsDate").append("<tr><td align='middle'>Event</td><td align='middle'>Company</td><td>Date</td><td>Pay Status</td><td align='middle'>Created at</td></tr><br>");
                    for (var i = 0; i < adsData.length; i++) {
                        var date = adsData[i].created_at.split("T");
                        var createdDate = date[0].split("-");
                        if (new Date(createdDate[0], createdDate[1], createdDate[2]) >= new Date(startDate.year, startDate.month, startDate.day) && new Date(createdDate[0], createdDate[1], createdDate[2]) <= new Date(endDate.year, endDate.month, endDate.day)) {
                            $("#AdsDate").append("<tr><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + adsData[i].EventName + "</td> | <td  align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + adsData[i].CompanyName + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 150px'> " + adsData[i].Date + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 50px'>" + adsData[i].HasBeenPaid + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 150px'>" + adsData[i].CreatedAt + "</td></tr><br>");
                        }
                    }
                } else {
                    $('#AdsDate').empty();
                    $("#AdsDate").append("<tr><td align='middle'>Event</td><td align='middle'>Company</td><td>Date</td><td>Pay Status</td><td align='middle'>Created at</td></tr><br>");
                    for (var i = 0; i < adsData.length; i++) {
                        var date = adsData[i].created_at.split("T");
                        var createdDate = date[0].split("-");
                        if (new Date(createdDate[0], createdDate[1], createdDate[2]) >= new Date(startDate.year, startDate.month, startDate.day) && new Date(createdDate[0], createdDate[1], createdDate[2]) <= new Date(endDate.year, endDate.month, endDate.day)) {
                            $("#AdsDate").append("<tr><td align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + adsData[i].EventName + "</td> | <td  align='middle' style='border: 2px #C0C0C0 solid; width: 250px'> " + adsData[i].CompanyName + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 150px'> " + adsData[i].Date + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 50px'>" + adsData[i].HasBeenPaid + "</td><td align='middle' style='border: 2px #C0C0C0 solid; width: 150px'>" + adsData[i].CreatedAt + "</td></tr><br>");
                        }
                    }
                }
            },
            update: function () {
                $.ajax({
                    url: '/vladimir',
                    type: 'GET',
                    success: function (data) {
                        $('#nu').empty();
                        newUsersToday = data.length;
                        $('#nu').append("Number of new users today: " + newUsersToday + "<br>");
                    }
                });
                $.ajax({
                    url: '/getAllUsers',
                    type: 'GET',
                    success: function (data) {
                        $('#tu').empty();
                        totalUsers = data.length;
                        $("#tu").append("Number of registered users by now: " + totalUsers);
                    }
                });
                $.ajax({
                    url: '/getAds',
                    type: 'GET',
                    success: function (data) {
                        $('#ta').empty();
                        self.drawAds(data);
                        totalAds = data.length;
                        $("#ta").append("Number of ads: " + totalAds);
                    }
                });
                $.ajax({
                    url: '/getNewAds',
                    type: 'GET',
                    success: function (data) {
                        $('#na').empty();
                        newAdsToday = data.length;
                        $('#na').append("Number of new ads today: " + newAdsToday + "<br>");
                    }
                });

                $.ajax({
                    url: '/getAllUsers',
                    type: 'GET',
                    success: function (data) {
                        console.log(userData.length);
                        $("#User").empty();
                        self.drawUsers(data);
                        userData = data;
                    }
                });
                setTimeout(function () {
                    self.update();
                }, 30000);
            },
            checkChange: function (event) {
                console.log(event.currentTarget);
                var check = event.currentTarget.checked;
                var data = {
                    "email": event.currentTarget.value
                };
                data = JSON.stringify(data);
                if (check && event.currentTarget.value != 0) {
                    $.ajax({
                        url: '/activeUser',
                        type: 'POST',
                        contentType: 'application/json',
                        data: data,
                        success: function (data) {
                            if (data.status == "ok") {
                                alert("User with e-mail " + data.email + " has been activated!")
                            } else {
                                alert("An error has occured!" + data.status);
                            }
                        }
                    });
                } else if (event.currentTarget.value != 0) {
                    $.ajax({
                        url: '/deactiveUser',
                        type: 'POST',
                        contentType: 'application/json',
                        data: data,
                        success: function (data) {
                            if (data.status == "ok") {
                                alert("User with e-mail " + data.email + " has been deactivated");
                            } else {
                                alert("An error has occured!" + data.status);
                            }
                        }
                    });
                }
            },
            viewAllUsers: function (event) {
                event.preventDefault();
                $('#main-view').addClass('small-2');
                $('#titleLabel').show();
                var $titleLabel = $('#titleLabel');
                var text = $titleLabel.text();
                $titleLabel.text(text.replace(text, "List of all users"));
                $('#nu').hide();
                $('#logLabel').hide();
                $('#UserDate').hide();
                $('#right').hide();
                $('#left').hide();
                $('#third').hide();
                $('#AdsDate').hide();
                $('#main-view').show();
                $('#logLabel1').hide();
                $('#logLabel2').hide();
                $('#email').hide();
                $('#User').show();
                $('#datePicker').hide();
                $('#datePicker1').hide();
                $('#getLog').hide();
                $('#getSecondLog').hide();
                if ($('#container').length != 0) {
                    $('#container').remove();
                }
            },
            activitylog: function (event) {
                event.preventDefault();
                var Day = new Date();
                $('#User').hide();
                $('#UserDate').hide();
                $('#nu').hide();
                $('#titleLabel').show();
                $('#nu1').hide();
                $('#right').hide();
                $('#left').hide();
                $('#AdsDate').hide();
                $('#third').hide();
                $('#main-view').show();
                $('#main-view').addClass('small-2');
                $('#logLabel1').hide();
                $('#logLabel').show();
                $('#datePicker').show();
                $('#datePicker1').show();
                $('#main-view').append('<br><br>');
                $('#getLog').show();
                $('#getSecondLog').hide();
                var $titleLabel = $('#titleLabel');
                var text = $titleLabel.text();
                $titleLabel.text(text.replace(text, "User activity log"));
            },
            adsPerDate: function (event) {
                event.preventDefault();
                var Day = new Date();
                $('#User').hide();
                $('#nu1').hide();
                $('#UserDate').hide();
                $('#nu').hide();
                $('#right').hide();
                $('#left').hide();
                $('#third').hide();
                $('#main-view').show();
                $('#main-view').addClass('small-2');
                $('#logLabel').show();
                $('#getLog').hide();
                $('#titleLabel').show();
                $('#datePicker').show();
                $('#datePicker').append('<br>');
                $('#datePicker1').show();
                $('#datePicker1').append('<br>')
                $('#getSecondLog').show();
                var $titleLabel = $('#titleLabel');
                var text = $titleLabel.text();
                $titleLabel.text(text.replace(text, "Ads activity log"));
            },
            getLog: function (event) {
                event.preventDefault();
                console.log("Get Log Started");
                var std = $('#datepicker-01').val().split("-");
                var edd = $('#datepicker-02').val().split("-");
                var startDate = {
                    day: std[2],
                    month: std[1],
                    year: std[0]
                };
                console.log(startDate);
                var endDate = {
                    day: edd[2],
                    month:edd[1],
                    year:edd[0]
                };
                console.log(endDate);
                self.drawUsersDate(startDate, endDate);
            },
            getSecondLog: function (event) {
                event.preventDefault();
                var startD = $('#datepicker-01').val().split("-");
                var endD = $('#datepicker-02').val().split("-");
                var startDate = {
                    day: startD[2],
                    month: startD[1],
                    year: startD[0]
                };
                var endDate = {
                    day: endD[2],
                    month: endD[1],
                    year: endD[0]
                };
                var data = {
                    startDate: startDate,
                    endDate: endDate
                };
                self.drawAdsDate(startDate, endDate);
            },
            dashboard: function (event) {
                event.preventDefault();
                $('#main-view').hide();
                $('#left').show();
                $('#nu').show();
                $('#right').show();
                $('#third').show();
            },
            logout: function (event) {
                event.preventDefault();
                $.ajax({
                    url: '/adminLogout',
                    type: 'POST',
                    success: function (data) {
                        if (data) {
                            window.location.reload();
                        } else {
                            alert(data);
                        }
                    }
                });
            },
            newAndTotalUsersPerMonth: function (event) {
                event.preventDefault();
                window.scrollTo(0, 0);
                $('#User').hide();
                $('#right').hide();
                $('#left').hide();
                $('#datePicker').hide();
                $('#datePicker1').hide();
                $('#AdsDate').hide();
                $('#getLog').hide();
                $('#getSecondLog').hide();
                $('#titleLabel').show();
                $('#main-view').show();
                $('#UserDate').hide();
                if ($('#container').length != 0) {
                    $('#container').remove();
                }
                $('#third').hide();
                $('#logLabel').hide();
                $('#main-view').addClass('small-2');
                var $titleLabel = $('#titleLabel');
                var text = $titleLabel.text();
                $titleLabel.text(text.replace(text, "New and total users per month"));
                $('#main-view').append('<div id="container" class="row">' +
                    '<col-md-12>' +
                    '<div id="canvasArea1">' +
                    '<canvas id="nu1" style="width:960px; height:250px; overflow:hidden;"></canvas>' +
                    '</div>' +
                    '</col-md-12>' +
                    '</div>');
                var labels = [];
                var dataSet1 = [];
                var dataSet2 = [];
                for (var i = 0; i < newAndTotalUsersPerMonthData.length; i++) {
                    labels.push(newAndTotalUsersPerMonthData[i][1] + "." + newAndTotalUsersPerMonthData[i][0]);
                    dataSet1.push(newAndTotalUsersPerMonthData[i][2]);
                    dataSet2.push(newAndTotalUsersPerMonthData[i][3]);
                }
                var lineData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "New Users",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: dataSet1

                        },
                        {
                            label: "Total Users",
                            fillColor: "rgba(151,187,205,0.2)",
                            strokeColor: "rgba(151,187,205,1)",
                            pointColor: "rgba(151,187,205,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(151,187,205,1)",
                            data: dataSet2
                        }

                    ]
                };
                var canvas = document.getElementsByTagName('canvas')[0];
                canvas.width = 960;
                canvas.height = 250;
                var ctx = document.getElementById("nu1").getContext("2d");
                window.myLine = new Chart(ctx).Line(lineData, {
                    responsive: false
                });
            },
            bounces: function (e) {
                e.preventDefault();
                window.scrollTo(0, 0);
                $('#right').hide();
                $('#left').hide();
                $('#third').hide();
                $('#main-view').show();
                $('#UserDate').hide();
                $('#AdsDate').hide();
                $('#main-view').addClass('small-2');
                $('#logLabel').hide();
                $('#datePicker').hide();
                $('#datePicker1').hide();
                $('#getLog').hide();
                $('#getSecondLog').hide();
                $('#titleLabel').show();
                $('#User').hide();
                if ($('#container').length != 0) {
                    $('#container').remove();
                }
                var $titleLabel = $('#titleLabel');
                var text = $titleLabel.text();
                $titleLabel.text(text.replace(text, "Bounces per month"));
                $('#main-view').append('<div id="container" class="row">' +
                    '<col-md-12>' +
                    '<div id="canvasArea2">' +
                    '<canvas id="nu1" style="width:960px; height:250px; overflow:hidden;"></canvas>' +
                    '</div>' +
                    '</col-md-12>' +
                    '</div>');
                var analyticsItems = [];
                var analyticsItemsSize;
                console.log("success");
                analyticsItemsSize = bounceRatePerMonth.length;
                var labels = [];
                var analyticsData = [];
                for (var i = 0; i < analyticsItemsSize; i++) {
                    analyticsItems.push(bounceRatePerMonth[i][1] + "." + bounceRatePerMonth[i][0] + ": " + bounceRatePerMonth[i][2] + " bounces");
                    labels.push(bounceRatePerMonth[i][1] + "." + bounceRatePerMonth[i][0]);
                    analyticsData.push(bounceRatePerMonth[i][2]);
                }
                var analyticsItemsHtml = "analyticsItems:";
                for (var i = 0; i < analyticsItems.length; i++) {
                    analyticsItemsHtml = analyticsItemsHtml + "<p>" + analyticsItems[i] + "</p>";
                }
                console.log(bounceRatePerMonth);
                var canvas = document.getElementsByTagName('canvas')[0];
                canvas.width = 960;
                canvas.height = 250;
                var lineData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Bounces per month",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: analyticsData
                        }
                    ]
                };
                var ctx6 = document.getElementById("nu1").getContext("2d");
                window.myLine = new Chart(ctx6).Line(lineData, {
                    responsive: false
                });
            },
            avgTimeOnPage: function (e) {
                e.preventDefault();
                window.scrollTo(0, 0);
                $('#right').hide();
                $('#left').hide();
                $('#third').hide();
                $('#main-view').show();
                $('#AdsDate').hide();
                $('#UserDate').hide();
                $('#datePicker').hide();
                $('#datePicker1').hide();
                $('#getLog').hide();
                $('#getSecondLog').hide();
                $('#titleLabel').show();
                $('#main-view').addClass('small-2');
                $('#logLabel').hide();
                $('#User').hide();
                if ($('#container').length != 0) {
                    $('#container').remove();
                }
                var $titleLabel = $('#titleLabel');
                var text = $titleLabel.text();
                $titleLabel.text(text.replace(text, "Average  time on page per month"));
                $('#main-view').append('<div id="container" class="row">' +
                    '<col-md-12>' +
                    '<div id="canvasArea3">' +
                    '<canvas id="nu1" style="width:960px; height:250px; overflow:hidden;"></canvas>' +
                    '</div>' +
                    '</col-md-12>' +
                    '</div>');
                var analyticsItems = [];
                var analyticsItemsSize;
                console.log("success");
                analyticsItemsSize = avrTimeOnPagePerMonthData.length;
                var labels = [];
                var analyticsData = [];
                for (var i = 0; i < analyticsItemsSize; i++) {
                    analyticsItems.push(avrTimeOnPagePerMonthData[i][1] + "." + avrTimeOnPagePerMonthData[i][0] + ": " + avrTimeOnPagePerMonthData[i][2] + " avg. seconds per month on the page");
                    labels.push(avrTimeOnPagePerMonthData[i][1] + "." + avrTimeOnPagePerMonthData[i][0]);
                    analyticsData.push(avrTimeOnPagePerMonthData[i][2]);
                }
                var analyticsItemsHtml = "analyticsItems:";
                for (var i = 0; i < analyticsItems.length; i++) {
                    analyticsItemsHtml = analyticsItemsHtml + "<p>" + analyticsItems[i] + "</p>";
                }
                console.log(avrTimeOnPagePerMonthData);
                var canvas = document.getElementsByTagName('canvas')[0];
                canvas.width = 960;
                canvas.height = 250;
                var lineData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "Avg time on page per month",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: analyticsData
                        }
                    ]
                };
                var chart3 = document.getElementById("nu1").getContext("2d");
                window.myLine = new Chart(chart3).Line(lineData, {
                    responsive: false
                });
            },
            percentNewSession: function (e) {
                e.preventDefault();
                window.scrollTo(0, 0);
                $('#right').hide();
                $('#left').hide();
                $('#third').hide();
                $('#AdsDate').hide();
                $('#main-view').show();
                $('#UserDate').hide();
                $('#datePicker').hide();
                $('#datePicker1').hide();
                $('#getLog').hide();
                $('#getSecondLog').hide();
                $('#titleLabel').show();
                $('#main-view').addClass('small-2');
                $('#logLabel').hide();
                $('#User').hide();
                if ($('#container').length != 0) {
                    $('#container').remove();
                }
                var $titleLabel = $('#titleLabel');
                var text = $titleLabel.text();
                $titleLabel.text(text.replace(text, "Percent new sessions per month"));
                $('#main-view').append('<div id="container" class="row">' +
                    '<col-md-12>' +
                    '<div id="canvasArea4">' +
                    '<canvas id="nu1" style="width:960px; height:250px; overflow:hidden;"></canvas>' +
                    '</div>' +
                    '</col-md-12>' +
                    '</div>');
                var analyticsItems = [];
                var analyticsItemsSize;
                console.log("success");
                analyticsItemsSize = percentNewSessionsData.length;
                var labels = [];
                var analyticsData = [];
                for (var i = 0; i < analyticsItemsSize; i++) {
                    analyticsItems.push(percentNewSessionsData[i][1] + "." + percentNewSessionsData[i][0] + ": " + percentNewSessionsData[i][2] + " % new sessions");
                    labels.push(percentNewSessionsData[i][1] + "." + percentNewSessionsData[i][0]);
                    analyticsData.push(percentNewSessionsData[i][2]);
                }
                var analyticsItemsHtml = "analyticsItems:";
                for (var i = 0; i < analyticsItems.length; i++) {
                    analyticsItemsHtml = analyticsItemsHtml + "<p>" + analyticsItems[i] + "</p>";
                }
                console.log(percentNewSessionsData);
                var canvas = document.getElementsByTagName('canvas')[0];
                canvas.width = 960;
                canvas.height = 250;
                var lineData = {
                    labels: labels,
                    datasets: [
                        {
                            label: "% new sessions per month",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: analyticsData
                        }
                    ]
                };
                var chart4 = document.getElementById("nu1").getContext("2d");
                window.myLine = new Chart(chart4).Line(lineData, {
                    responsive: false
                });
            },
            usersPerDeviceCategory: function (e) {
                e.preventDefault();
                window.scrollTo(0, 0);
                $('#right').hide();
                $('#left').hide();
                $('#third').hide();
                $('#main-view').show();
                $('#AdsDate').hide();
                $('#UserDate').hide();
                $('#datePicker').hide();
                $('#datePicker1').hide();
                $('#getLog').hide();
                $('#getSecondLog').hide();
                $('#titleLabel').show();
                $('#main-view').addClass('small-2');
                $('#logLabel').hide();
                $('#User').hide();
                if ($('#container').length != 0) {
                    $('#container').remove();
                }
                var $titleLabel = $('#titleLabel');
                var text = $titleLabel.text();
                $titleLabel.text(text.replace(text, "Users per device category"));
                $('#main-view').append(
                        '<div id="container" class="row">' +
                        '<col-md-12>' +
                        '<div id="canvasArea5">' +
                        '<canvas id="nu1" style="width:960px; height:250px; overflow:hidden;"></canvas>' +
                        '</div>'
                        + '</col-md-12>' +
                        '</div>'
                );
                $('#canvasArea5').show();
                $('#canvasArea1').empty();
                $('#canvasArea2').empty();
                $('#canvasArea3').empty();
                $('#canvasArea4').empty();
                var analyticsItems = [];
                var analyticsItemsSize;
                console.log("success");
                analyticsItemsSize = usersPerDeviceCategoryData.length;
                var labelsDevices = [];
                var analyticsData = [];
                for (var i = 0; i < analyticsItemsSize; i++) {
                    analyticsItems.push(usersPerDeviceCategoryData[i][1] + " users using a device " + usersPerDeviceCategoryData[i][0]);
                    labelsDevices.push(usersPerDeviceCategoryData[i][0]);
                    analyticsData.push(usersPerDeviceCategoryData[i][1]);
                }
                var analyticsItemsHtml = "analyticsItems:";
                for (var i = 0; i < analyticsItemsSize; i++) {
                    analyticsItemsHtml = analyticsItemsHtml + "<p>" + analyticsItems[i] + "</p>";
                }
                console.log(usersPerDeviceCategoryData);
                var canvas = document.getElementsByTagName('canvas')[0];
                canvas.width = 960;
                canvas.height = 250;
                var lineData = {
                    labels: labelsDevices,
                    datasets: [
                        {
                            label: "Users",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: analyticsData
                        }
                    ]
                };
                var chart7 = document.getElementById("nu1").getContext("2d");
                window.myLine = new Chart(chart7).Line(lineData, {
                    responsive: false
                });
            }
        });
        return DashboardView;
    });