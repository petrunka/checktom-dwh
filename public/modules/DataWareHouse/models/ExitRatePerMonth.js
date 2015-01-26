/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * User schema   sessionCount
 **/
var exitRatePerMonth = Schema({
    _id: {type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    exitRate: {type: Number, required: true}
});
exitRatePerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('ExitRatePerMonth', exitRatePerMonth, 'exitRatePerMonth');
