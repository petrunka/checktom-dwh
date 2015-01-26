/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var percentNewSessionsPerMonth = Schema({
    _id: {type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    percentNewSessions: {type: Number, required: true}
});
percentNewSessionsPerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('PercentNewSessionsPerMonth', percentNewSessionsPerMonth, 'percentNewSessionsPerMonth');