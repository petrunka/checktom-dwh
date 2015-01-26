define([
    'app',
    './AdController',
    'backbone',
    'marionette'
], function (App, AdController, Backbone) {
    'use strict';

    App.module("AdPage", function (Ad, App, Backbone) {
        this.on("start", function () {
            console.log('started Ad module');
            AdController.GoToAd();
        });
        var router = App.Routers;
        console.log(router);
        App.Routers.processAppRoutes(AdController, {
            //'AddNewItem': 'AddItem',
            'GoAd':'GoToAd'
        });
        App.addInitializer(function () {

        });
        //return App.Router;
    });
    return App.AdPage;
});