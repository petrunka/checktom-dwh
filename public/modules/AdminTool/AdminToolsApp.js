define([
    'app',
    './AdminToolsController',
    'backbone',
    'marionette'
], function (App, AdminToolsController, Backbone) {
    'use strict';


    App.module("AdminToolsPage", function(AdminTools, App, Backbone) {
        this.on("start", function() {
            console.log('started AdminTools module');
            AdminToolsController.GoToAdminTools();
        });
        var router = App.Routers;
        console.log(router);
        App.Routers.processAppRoutes(AdminToolsController, {
           'GoAdminTools': 'GoToAdminTools'
        });
        App.addInitializer(function() {

        });

    });
    return App.AdminToolsPage;
});