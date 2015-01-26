/**
 * Created by Bjarke E. Andersen on 24-09-2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User schema
 **/
var usersPerDeviceCategory = new Schema({
    _id: {type: String, required: true, unique: true},
    deviceCategory: {type: String,required:true},
    users:{type: Number,required:true}
});
usersPerDeviceCategory.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('UsersPerDeviceCategory', usersPerDeviceCategory, 'usersPerDeviceCategory');