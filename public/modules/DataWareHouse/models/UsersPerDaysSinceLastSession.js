/**
 * Created by tavi on 07-10-2014.
 */
/**
 * Created by admin on 6.10.2014 г..
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User schema
 **/
var usersPerDaysSinceLastSession = new Schema({
    _id: {type: String, required: true, unique: true},
    daysSinceLastSession: {type: String, required: true},
    users: {type: Number, required: true}
});
usersPerDaysSinceLastSession.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('UsersPerDaysSinceLastSession', usersPerDaysSinceLastSession, 'usersPerDaysSinceLastSession');