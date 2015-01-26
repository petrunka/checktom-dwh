define(
    [
        'app',
        'backbone',
        'marionette',
        'modules/Auth/AuthApp'
    ],
    function (App, Backbone) {
        var GlobalController = Backbone.Marionette.Controller.extend({
            index: function () {
                console.log('you landed on index page');
            },
            invokeAdminToolsModule: function() {
                require(["modules/AdminTool/AdminToolsApp"], function (AdminToolApp) {
                    console.log('invokeAdminToolsModule called');
                });
            },
            invokeAuthModule: function(){
                require(["modules/Auth/AuthApp"], function (AuthApp) {

                });
            },
            invokeStreamModule: function(){
                require(["modules/Stream/StreamApp"], function (StreamApp) {

                });
            },
            invokeAdLayerModule: function() {
                require(["modules/AdLayer/AdApp"], function(AdApp) {

                });
            }
        });
        return new GlobalController();
    });