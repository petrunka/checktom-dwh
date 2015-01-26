/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var hitsPerMonth = Schema({
    _id: {type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    hits: {type: Number, required: true}
});
hitsPerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('HitsPerMonth', hitsPerMonth, 'hitsPerMonth');