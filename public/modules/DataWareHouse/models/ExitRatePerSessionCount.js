/**
 * Created by tavi on 07-10-2014.
 */
/**
 * Created by Bjarke E. Andersen on 22-09-2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * User schema   sessionCount
 **/
var exitRatePerSessionCount = Schema({
    _id: {type: Schema.ObjectId},
    sessionCount: {type: Number, required: true},
    exitRate: {type: Number, required: true}
});
exitRatePerSessionCount.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('ExitRatePerSessionCount', exitRatePerSessionCount, 'exitRatePerSessionCount');
