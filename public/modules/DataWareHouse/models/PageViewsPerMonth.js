/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pageViewsPerMonth = Schema({
    _id: {type: String, required: true, unique: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    pageViews: {type: Number, required: true},
    uniquePageviews: {type: Number, required: true}
});
pageViewsPerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('PageViewsPerMonth', pageViewsPerMonth, 'pageViewsPerMonth');
