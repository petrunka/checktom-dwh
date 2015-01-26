"use strict";
var mongoose = require('mongoose'),
    passport = require('passport'),
    pController = require('../controllers/photoController');

module.exports = function (app, passport) {

    app.get('/getThumb/:id', function(req,res){
        console.log('thumb');
        pController.getPicture(req.param('id'),"thumb",res)
    });
    app.get('/getFullpic/:id',function(req,res){
        console.log('fullpic');
        pController.getPicture(req.param('id'),"fullpic",res);
    })
}
