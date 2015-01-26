define(
    [
        'jade!../templates/AddNewJobTemplate',
        'backbone',
        'backbone_validation',
        '../views/AdView',
        '../views/AddNewJobView',
        '../tools/GenericListeners'
    ],
    function(AddNewJobTemplate, Backbone) {
        var AddNewJobView = Backbone.Marionette.Layout.extend({
            template: function() {
                console.log('trying to render AddNewJobTemplate');
                var that = this;
                return _.template(AddNewJobTemplate());
            },
            initialize: function (options) {
                this.options = options || {};
                this.Geocoder = new google.maps.Geocoder();
            },
            onShow: function() {
                addOnShownOnceListener('#testDiv', function() {
                   console.log("testDiv has been shown!");
                });
                addOnVisibleListener('#testDiv', function() {
                    console.log("testDiv is now visible!");
                })
                addOnClickListener('#testDiv', function() {
                   console.log("testDiv was clicked!");
                });
                addOnShownOnceListener('#testDiv2', function() {
                   console.log("testDiv2 has been shown!");
                });
            },
            events: {
                "click #testListener": "TestListener"
            },
            validateAttri: function (obj) {
                if (typeof obj !== "undefined" && obj !== "" && obj !== null) {
                    return true;
                } else {
                    return false;
                }
            },
            TestListener: function(e) {
                console.log("Setting GenericListener up");
                var gl = new GenericListener(e);
            },
            TestShowP: function(e) {
                console.log("testP is now showing!");
            }
        });

        return AddNewJobView;
    }
)