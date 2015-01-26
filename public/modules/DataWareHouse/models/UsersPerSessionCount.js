/**
 * Created by tavi on 18-09-2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User schema
 **/
var usersPerSessionCount = new Schema({
    _id: {type: String, required: true, unique: true},
    sessionCount: {type: Number,required:true},
    users:{type: Number,required:true}

});
usersPerSessionCount.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('UsersPerSessionCount', usersPerSessionCount, 'usersPerSessionCount');

