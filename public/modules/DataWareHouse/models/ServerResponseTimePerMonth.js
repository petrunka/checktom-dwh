/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var serverResponseTimePerMonth = Schema({
    _id: {type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    serverResponseTime: {type: Number, required: true}
});
serverResponseTimePerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('ServerResponseTimePerMonth', serverResponseTimePerMonth, 'serverResponseTimePerMonth');