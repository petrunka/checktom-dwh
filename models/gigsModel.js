var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */

var gigSchema = new Schema({

    _id:{type:Schema.ObjectId},
    CreatedAt: {type:Date,default:Date.now()},
    EventName: {type:String,required:true},
    Headline: {type:String,required:true},
    Date:{type:Date,required:false},
    EndDate:{type:Date,required:false},
    Address:{type:String,required:false},
    Description: {type:String,required:true},
    CompanyName: {type:String,required:true},
    HashTags:{type:[]},
    JobTypeLine: {type:[{
        JobType: {type: String, required: true},
        Briefing: {type: String, required: true},
        Quantity: {type: Number, required: true},
        StartTime:{type:String,required:true},
        EndTime:{type:String,required:true},
        NumberOfHours: {type: String, required: false},
        HourlySalary: {type: Number, required: true}
    }]},
    Budget:{type:Number,required:false},
    HasBeenPaid: {type: Boolean, default: false}
})
gigSchema.set('toObject',{getters: true});

/**
 * Methods
 */

mongoose.model('Gigs', gigSchema,'gigs');