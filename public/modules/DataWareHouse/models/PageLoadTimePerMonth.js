/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pageLoadTimePerMonth = Schema({
    _id: {type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    pageLoadTime: {type: Number, required: true}
});
pageLoadTimePerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('PageLoadTimePerMonth', pageLoadTimePerMonth, 'pageLoadTimePerMonth');