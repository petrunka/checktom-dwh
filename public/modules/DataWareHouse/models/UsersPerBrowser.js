/**
 * Created by admin on 6.10.2014 г..
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User schema
 **/
var usersPerBrowser = new Schema({
    _id:{type: Schema.ObjectId},
    browser: {type: String,required:true},
    users:{type: Number,required:true}
});
usersPerBrowser.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('UsersPerBrowser', usersPerBrowser, 'usersPerBrowser');