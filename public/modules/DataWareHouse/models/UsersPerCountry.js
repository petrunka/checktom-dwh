/**
 * Created by admin on 6.10.2014 г..
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User schema
 **/
var usersPerCountry = new Schema({
    _id:{type: Schema.ObjectId},
    userType: {type: String,required:true},
    users:{type: Number,required:true}
});
usersPerCountry.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('UsersPerCountry', usersPerCountry, 'usersPerCountry');