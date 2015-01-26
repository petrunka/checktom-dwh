/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pageValueAndEntrancesPerMonth = Schema({
    _id: {type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    pageValue: {type: Number, required: true},
    entrances: {type: Number, required: true}
});
pageValueAndEntrancesPerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('PageValueAndEntrancesPerMonth', pageValueAndEntrancesPerMonth, 'pageValueAndEntrancesPerMonth');