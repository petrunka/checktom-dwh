/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * User schema
 **/
var avrTimeOnPagePerMonth = Schema({
    _id: {type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    avgTimeOnPage: {type: Number, required: true}
});
avrTimeOnPagePerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('AvrTimeOnPagePerMonth', avrTimeOnPagePerMonth, 'avrTimeOnPagePerMonth');