/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var sessionsPerMonth = Schema({
    _id: {type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    sessions: {type: Number, required: true}
});
sessionsPerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('SessionsPerMonth', sessionsPerMonth, 'sessionsPerMonth');