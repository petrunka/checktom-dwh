/**
 * Created by tavi on 06-10-2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User schema
 **/
var newUsersPerSessionCount = new Schema({
    _id: {type: String, required: true, unique: true},
    sessionCount: {type: Number,required:true},
    newUsers:{type: Number,required:true}

});
newUsersPerSessionCount.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('NewUsersPerSessionCount', newUsersPerSessionCount, 'newUsersPerSessionCount');

