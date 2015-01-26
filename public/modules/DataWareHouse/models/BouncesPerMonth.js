/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var bouncesPerMonth = Schema({
    _id: {type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    bounces: {type: Number, required: true}
});
bouncesPerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('BouncesPerMonth', bouncesPerMonth, 'bouncesPerMonth');