
define(
    [
       'app',
        'jade!../templates/AdTemplate',
        'backbone',

        'models/ItemCollectionModel',
        '../views/AdView',
        '../views/AddNewJobView',
        'backbone_validation',
        'jquery',
        'jqueryUI',
        'jqueryTouch',
        'bootstrap',
        'bootstrapSelect',
        'bootstrapSwitch',
        'flatuiCheckbox',
        'flatuiRadio',
        'flatuiTags',
        'flatuiplaceholder',
        'flatuiApp',
        'woomark',
       // '/../../DataWareHouse/views/DataWareHouseDBPull',
        '../../../assets/libs/chart/Chart.js'
        //,
        //'facebook'
    ],

function (App, AdTemplate, Backbone, ItemCollectionModel, AdView, AddNewJobView) {

        var AdView = Backbone.Marionette.Layout.extend({
            requireLogin: true,
            model: new ItemCollectionModel({ Jobs: ""}),
            template: function () {
                console.log('trying to render Ad template');
                return _.template(AdTemplate());
            },
            initialize: function (options) {
                console.log('adView initialized');
                this.options = options || {};
            },

            regions: {

            },
            events: {
                //"click #SearchButton": "searchToolSubmit",
                //"click #add_new_item": "OpenAddNewItemMenu",
                //"change #location": "LocationChanged",
                //"click .item":"OpenDetailView"
                "click #createTest": "CreateTest",
                "click #findTest": "FindTest",
                "click #updateTest": "UpdateTest",
                "click #newJob": "NewJob",
                "click #testChart": "TestChart",
                "click #testAnalytics": "TestAnalytics"
            },
            TestChart: function (e) {
                console.log("TestChart called");
                e.preventDefault();
                var jobs = '';
                var jobsSize;
                var analyticsItems;
                var analyticsItemsSize;
                $.ajax({
                    url: '/testChart',
                    type: 'GET',
                    success: function (data) {
                        console.log("success");
                        //console.log(data);
                        analyticsItems = JSON.parse(data);
                        console.log(analyticsItems);
                        analyticsItemsSize = data.length;
                        console.log(analyticsItemsSize);
                        var randomScalingFactor = function () {
                            return Math.round(Math.random() * 100)
                        };

                        var analyticsItemsHtml = "analyticsItems:";
                        var percentageMen = [];
                        var percentageWomen = [];
                        for (var i = 0; i < analyticsItems.length; i++) {
                            analyticsItemsHtml = analyticsItemsHtml + "<p>" + analyticsItems[0][i] + "</p>";
                            console.log("ding");
                            console.log(analyticsItems[0][i]);
                            //  percentageMen.push((JSON.parse(data[0][i]).PercentageMen));
                            // percentageWomen.push((JSON.parse(data[0][i]).PercentageWomen));
                        }
                        console.log(data);
                        var barChartData = {
                            labels: ["Percentage Men", "Percentage Women"],

                            datasets: [
                                {
                                    fillColor: "rgba(0,0,255,1)",
                                    strokeColor: "rgba(220,220,220,0.8)",
                                    highlightFill: "rgba(220,220,220,0.75)",
                                    highlightStroke: "rgba(220,220,220,1)",
                                    data: [12, 31]
                                },
                                {
                                    fillColor: "rgba(255,0,255,1)",
                                    strokeColor: "rgba(151,187,205,0.8)",
                                    highlightFill: "rgba(151,187,205,0.75)",
                                    highlightStroke: "rgba(151,187,205,1)",
                                    data: [67, 88]
                                }
                            ]


                        };

                        function loadScript() {

                            var script = document.createElement('script');
                            script.type = 'text/javascript';
                            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/0.2.0/Chart.js';
                            document.body.appendChild(script);
                        }


                        /**window.onload = function(){
                            loadScript();
                            var ctx = document.getElementById("canvas").getContext("2d");
                            window.myBar = new Chart(ctx).Bar(barChartData, {
                                responsive : true
                            });
                        }*/
                            //$('#jobs').html(jobsHtml);

                        loadScript();
                        var canvas = document.getElementsByTagName('canvas')[0];
                        console.log("canvas");
                        canvas.width = 400;
                        canvas.height = 300;
                        var ctx = document.getElementById("blabla").getContext("2d");
                        //  ctx.canvas.width = 300;
                        // ctx.canvas.height = 300;
                        //scaleOverride : true;
                        window.myBar = new Chart(ctx).Bar(barChartData, {
                            responsive: false
                        });
                        var ctx2 = document.getElementById("blabla2").getContext("2d");
                        var radarChartData = {
                            labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
                            datasets: [
                                {
                                    label: "My First dataset",
                                    fillColor: "rgba(220,220,220,0.2)",
                                    strokeColor: "rgba(220,220,220,1)",
                                    pointColor: "rgba(220,220,220,1)",
                                    pointStrokeColor: "#fff",
                                    pointHighlightFill: "#fff",
                                    pointHighlightStroke: "rgba(220,220,220,1)",

                                    data: [65, 59, 90, 81, 56, 55, 40]
                                },
                                {
                                    label: "My Second dataset",
                                    fillColor: "rgba(151,187,205,0.2)",
                                    strokeColor: "rgba(151,187,205,1)",
                                    pointColor: "rgba(151,187,205,1)",
                                    pointStrokeColor: "#fff",
                                    pointHighlightFill: "#fff",
                                    pointHighlightStroke: "rgba(151,187,205,1)",
                                    data: [28, 48, 40, 19, 96, 27, 100]
                                }
                            ]
                        };

                        //var myRadarChart = new Chart(ctx2).Radar(radarChartData, options);

                        window.myBar = new Chart(ctx2).Radar(radarChartData, {
                            responsive: false
                        });

                        var polarAreaData = [
                            {
                                value: 300,
                                color: "#F7464A",
                                highlight: "#FF5A5E",
                                label: "Red"
                            },
                            {
                                value: 50,
                                color: "#46BFBD",
                                highlight: "#5AD3D1",
                                label: "Green"
                            },
                            {
                                value: 100,
                                color: "#FDB45C",
                                highlight: "#FFC870",
                                label: "Yellow"
                            },
                            {
                                value: 40,
                                color: "#949FB1",
                                highlight: "#A8B3C5",
                                label: "Grey"
                            },
                            {
                                value: 120,
                                color: "#4D5360",
                                highlight: "#616774",
                                label: "Dark Grey"
                            }

                        ];
                        var ctx3 = document.getElementById("blabla3").getContext("2d");
                        window.myBar = new Chart(ctx3).PolarArea(polarAreaData, {
                            responsive: false
                        });


                        var pieData = [
                            {
                                value: 300,
                                color: "#F7464A",
                                highlight: "#FF5A5E",
                                label: "Red"
                            },
                            {
                                value: 50,
                                color: "#46BFBD",
                                highlight: "#5AD3D1",
                                label: "Green"
                            },
                            {
                                value: 100,
                                color: "#FDB45C",
                                highlight: "#FFC870",
                                label: "Yellow"
                            }
                        ];
                        var ctx4 = document.getElementById("blabla4").getContext("2d");

                        window.myBar = new Chart(ctx4).Pie(pieData, {
                            responsive: false
                        });
                        var ctx5 = document.getElementById("blabla5").getContext("2d");
                        window.myBar = new Chart(ctx5).Doughnut(pieData, {
                            responsive: false
                        });

                        var lineData = {
                            labels: ["January", "February", "March", "April", "May", "June", "July","August"],
                            datasets: [
                                {
                                    

                                    label: "My First dataset",
                                    fillColor: "rgba(220,220,220,0.2)",
                                    strokeColor: "rgba(220,220,220,1)",
                                    pointColor: "rgba(220,220,220,1)",
                                    pointStrokeColor: "#fff",
                                    pointHighlightFill: "#fff",
                                    pointHighlightStroke: "rgba(220,220,220,1)",
                                    data: [ 59, 80, 81, 56, 55, 40, 60]
                                    
                                },
                                {
                                    label: "My Second dataset",
                                    fillColor: "rgba(151,187,205,0.2)",
                                    strokeColor: "rgba(151,187,205,1)",
                                    pointColor: "rgba(151,187,205,1)",
                                    pointStrokeColor: "#fff",
                                    pointHighlightFill: "#fff",
                                    pointHighlightStroke: "rgba(151,187,205,1)",
                                    data: [28, 48, 40, 19, 86, 27, 90, 80]
                                }
                                    
                            ]
                        };
                        var ctx6 = document.getElementById("blabla6").getContext("2d");
                        window.myBar = new Chart(ctx6).Line(lineData, {
                            responsive: false
                        });

                    },
                    error: function (data) {
                        console.log("error");
                        console.log(data);
                    }
                });
            },
            NewJob: function (e) {
                console.log("NewJob called");
                e.preventDefault();
                App.content.show(new AddNewJobView);
            },
            CreateTest: function (e) {
                e.preventDefault();

                function updateTest(query) {
                    // Ajax append data from
                    console.log("createTest called");
                    console.log("starting ajax stuff");
                    $.ajax({
                        url: '/createJob',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(query),
                        success: function (data) {
                            console.log("success");
                            console.log(data);
                        },
                        error: function (data) {
                            console.log("error");
                            console.log(data);
                        }
                    });
                }

                var job = new Object();
                job.companyName = 'Madness';
                job.title = 'IT pros ansættes';
                job.description = 'Test';
                job.salary = 'Til forhandling'
                job.isGig = 0;
                job.contactName = 'Vladimir';
                job.contactNumber = 12345678;
                job.lengthInHours = 38;
                job.latLng = {
                    Lat: '123123',
                    Lng: '2953'
                }
                job.hashTags = ['it', 'developer', 'madness', 'support'];
                updateTest(job);
            },


            TestAnalytics: function (e) {
                e.preventDefault();

            },
            UpdateTest: function (e) {
                e.preventDefault();

                function updateTest(query) {
                    // Ajax append data from
                    console.log("updateTest called");
                    console.log("starting ajax stuff");
                    $.ajax({
                        url: '/updateJob',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(query),
                        success: function (data) {
                            console.log("success");
                            console.log(data);
                        },
                        error: function (data) {
                            console.log("error");
                            console.log(data);
                        }
                    });
                }

                var job = new Object();
                job._id = '53edf2852b7586601e10cb5c';
                job.companyName = 'Madness';
                job.title = 'It studerende søges';
                job.description = 'It studerende søges til at udføre support arbejde for Madness\' procoders';
                job.salary = 'Til forhandling'
                job.isGig = 0;
                job.contactName = 'Patrick Larsen';
                job.contactNumber = 12345678;
                job.lengthInHours = 38;
                job.latLng = {
                    Lat: '123123',
                    Lng: '2953'
                }
                job.hashTags = ['it', 'developer'];
                console.log("calling updateTest(job)");
                updateTest(job);
            },
            FindTest: function (e) {
                console.log("find test initiated");
                var jobs = '';
                var jobsSize;
                $.ajax({
                    url: '/testJob',
                    type: 'GET',
                    success: function (data) {
                        console.log("success");
                        console.log(data);
                        jobs = data;
                        jobsSize = data.length;
                        console.log(jobsSize);
                        var jobsHtml = "jobs:";


                        for (i = 0; i < data.length; i++) {
                            jobsHtml = jobsHtml + "<p>" + data[i] + "</p>";
                        }
                        console.log(jobsHtml);
                        $('#jobs').html(jobsHtml);
                    },
                    error: function (data) {
                        console.log("error");
                        console.log(data);
                    }
                });


            },
            onShow: function () {
                // Load google with their annoying asynch requirement.
                function loadScript() {

                }

                window.onload = loadScript;
            }
        });

        return AdView;
    });