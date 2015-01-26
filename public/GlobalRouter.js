/*
*  The global router is for looking into routes and direct them to module specific routes
* */
define(
    [
        'GlobalController',
        'backbone',
        'marionette'

    ],
    function (GlobalController, Backbone) {

        var GlobalRouter = Backbone.Marionette.AppRouter.extend({
            initialize: function() {
            },
            appRoutes: {
                //'':'index' overwritten to start signup first.
                'stream':'invokeStreamModule',
                'ads': 'invokeAdLayerModule',
                'admin': 'invokeAdminToolsModule'
            },
            controller: GlobalController
        });
        console.log('in the global router');
        return new GlobalRouter();
    });
