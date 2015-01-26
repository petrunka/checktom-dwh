var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */

var jobSchema = new Schema({

    _id:{type:Schema.ObjectId},
    companyName: {type:String,required:true},
    title: {type: String,required:true},
    description: {type: String,required:true},
    salary: {type: String,required:true},
    isGig: {type: Boolean,required:true},
    contactName:{type:String,required:false},
    contactNumber:{type:String,required:false},
    lengthInHours: {type:Number,required:false},
    hashTags: {type:[],required:true},
    LatLng:{
        Lat:{type:Number,required:false},
        Lng:{type:Number,required:false}
    },
    imageUrlLogo:{type:String,required:false}
})
jobSchema.set('toObject',{getters: true});

/**
 * Methods
 */

mongoose.model('Jobs', jobSchema,'jobs');