/**
 * Created by Roman on 28-08-2014.
 */
/*Id
 articleID/jobID/housingID
 itemType: (article/job/housing)
 Clicks:[userid,date]
 Impressions:[userid,date]
 lastUpdated: date
 CompanyID
 sharedOnFB: [userid,date]
 Engaged:[userid,date]
 PercentageMen:Number
 PercentageWomen:Number
 AvgAge:Number
 TopLocationsInOrder:[Location]
 CRC
 CTR
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Analytics Schema
 * Clicks, Impressions, sharedOnFB, Engaged require input in the format: userid:String , date: Date
 */

var analyticsSchema = new Schema({
    _id: {type: Schema.ObjectId},
    articleID: {type: String, required: true},
    itemType: {type: String, required: true, default:'job'},
    Clicks: [Schema.Types.Mixed],
    Impressions: [Schema.Types.Mixed],
    lastUpdated: { type: Date, default: Date.now },
    CompanyID: {type: String, required: false},
    sharedOnFB: [Schema.Types.Mixed],
    Engaged: [Schema.Types.Mixed],
    PercentageMen: {type: Number, required: false},
    PercentageWomen: {type: Number, required: false},
    AvgAge: {type: Number, required: true},
    TopLocationsInOrder: {type: [], required: true},
    CRC: {type: Number, required: false, default:0},
    CTR: {type: Number, required: false, default:0}
})
analyticsSchema.set('toObject', {getters: true});

/**
 * Methods
 */

mongoose.model('Analytics', analyticsSchema, 'analytics');