/**
 * Created by Bjarke E. Andersen on 24-09-2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User schema
 **/
var usersPerUserType = new Schema({
    _id:{type: Schema.ObjectId},
    userType: {type: String,required:true},
    users:{type: Number,required:true}
});
usersPerUserType.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('UsersPerUserType', usersPerUserType, 'usersPerUserType');