/**
 * Created by tavi on 25-09-2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User schema
 **/
var newUsersPerDeviceCategory = new Schema({
    _id: {type: String, required: true, unique: true},
    deviceCategory: {type: String,required:true},
    newUsers:{type: Number,required:true}
});
newUsersPerDeviceCategory.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('NewUsersPerDeviceCategory', newUsersPerDeviceCategory, 'newUsersPerDeviceCategory');