define([
    'app',
    './AuthController'], function(App, AuthController) {
    'use strict';
    App.module("Auth", function(Auth, App) {
        //this.startWithParent = false;
        var Router = Backbone.Marionette.AppRouter.extend({
            initialize: function(options) {},
            controller: new AuthController({}),
            appRoutes: {
                "signup": "signup",
                "": "signup",
                "login": "login"
            }
        });
        this.on('start', function() {
            // Start the router
            new Router({});
        });
    });
    return App.Auth;
});