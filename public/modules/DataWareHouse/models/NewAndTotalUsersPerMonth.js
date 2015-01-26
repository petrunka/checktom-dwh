/**
 * Created by tavi on 02-10-2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * User schema
 **/
var newAndTotalUsersPerMonth = Schema({
    _id:{type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    users: {type: Number, required: true},
    newUsers: {type: Number, required: true}
});
newAndTotalUsersPerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('NewAndTotalUsersPerMonth', newAndTotalUsersPerMonth, 'newAndTotalUsersPerMonth');
