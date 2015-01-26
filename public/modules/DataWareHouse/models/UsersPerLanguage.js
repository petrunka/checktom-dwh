/**
 * Created by admin on 7.10.2014 г..
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User schema
 **/
var usersPerLanguage = new Schema({
    _id:{type: Schema.ObjectId},
    language: {type: String,required:true},
    users:{type: Number,required:true}
});
usersPerLanguage.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('UsersPerLanguage', usersPerLanguage, 'usersPerLanguage');