/**
 * Created by tavi on 03-10-2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var hitsPerSessionDurationBucket = Schema({
    _id: {type: String, required: true, unique: true},
    sessionDurationBucket: {type: Number, required: true},
    hits: {type: Number, required: true}
});
hitsPerSessionDurationBucket.set('toObject', {getters: true});
/**
 * Methods
 **/

mongoose.model('HitsPerSessionDurationBucket', hitsPerSessionDurationBucket, 'hitsPerSessionDurationBucket');


