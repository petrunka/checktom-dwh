/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var sessionDurationBucketPerMonth = Schema({
    _id: {type: Schema.ObjectId},
    month: {type: Number, required: true},
    sessionDurationBucket: {type: Number, required: true}
});
sessionDurationBucketPerMonth.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('SessionDurationBucketPerMonth', sessionDurationBucketPerMonth, 'sessionDurationBucketPerMonth');
