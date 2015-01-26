/**
 * Created by Bjarke E. Andersen on 25-09-2014.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * User schema
 **/
var facebookModel = Schema({
    _id: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    locale: {type: String, required: true},
    fbUserName: {type: String, required: true},
    gender: {type: String, required: true}
});
facebookModel.set('toObject', {getters: true});
/**
 * Methods
 **/


mongoose.model('FacebookModel', facebookModel, 'facebookModel');