/**
 * Created by tavi on 18-09-2014.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* User schema
 **/
var userPerMonthSchema = new Schema({
    _id:{type: Schema.ObjectId},
    month:{type: Number,required:true},
    users:{type: Number,required:true},
    newUsers: {type: Number,required:true}
});
userPerMonthSchema.set('toObject', {getters: true});
/**
 * Methods
 **/
mongoose.model('UsersPerMonth', userPerMonthSchema, 'usersPerMonth');

