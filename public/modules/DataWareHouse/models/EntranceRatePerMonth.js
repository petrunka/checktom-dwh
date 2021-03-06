/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var entranceRatePerMonth = Schema({
    _id: {type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    entranceRate: {type: Number, required: true}
});
entranceRatePerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('EntranceRatePerMonth', entranceRatePerMonth, 'entranceRatePerMonth');
