define([
    'app',
    './DataWareHouseController',
    'backbone',
    'marionette'
], function (App, DataWareHouseController, Backbone) {
    'use strict';

    App.module("DataWareHousePage", function (DataWareHouse, App, Backbone) {
        this.on("start", function () {
            console.log('started DataWareHouse module');
            DataWareHouseController.GoToDataWareHouse();
        });
        var router = App.Routers;
        console.log(router);
        App.Routers.processAppRoutes(DataWareHouseController, {
            //'AddNewItem': 'AddItem',
            'GoDWH':'GoToDataWareHouse'
        });
        App.addInitializer(function () {

        });
        //return App.Router;
    });
    return App.DataWareHousePage;
});