var mongoose=require('mongoose');
var jobModel=mongoose.model('Jobs');


//Test function
exports.testChart=function(req,res){
console.log("we are now in jobsController");
    //res.send("jobsController is in send");
   // jobModel.find({companyName:'OutOfBits'}, function (err, docs) {
    var analyticsModel=mongoose.model('Analytics');
    //TODO: change the find query to include company id
    analyticsModel.find({}, function (err, docs) {
        if(err){
            console.log(err);
            res.send("There was an error");
        }else{
            //res.send(docs);
            //console.log(docs);
            var analyticsItems=[];
            for(var i=0;i<docs.length;i++){
                analyticsItems[i]=docs[i];
                //console.log(analyticsItems[i]);
            }
            console.log(JSON.stringify(analyticsItems));
            res.send(JSON.stringify(analyticsItems));
        }
    });
};

exports.testAnalytics=function(req,res){
    console.log("testAnalytics called");



    var fs = require('fs'),
        crypto = require('crypto'),
        request = require('request'); // This is an external module (https://github.com/mikeal/request)

    var authHeader = {
            'alg': 'RS256',
            'typ': 'JWT'
        },
        authClaimSet = {
            'iss': '271331720138-otoeqhcurouc5gsa69vu31jisncnki2t@developer.gserviceaccount.com', // Service account email
            'scope': 'https://www.googleapis.com/auth/analytics.readonly', // We MUST tell them we just want to read data
            'aud': 'https://accounts.google.com/o/oauth2/token'
        },
        SIGNATURE_ALGORITHM = 'RSA-SHA256',
        SIGNATURE_ENCODE_METHOD = 'base64',
        GA_KEY_PATH = 'public/assets/keys/checktom.pem', //finds current directory then appends private key to the directory
        gaKey;

    function urlEscape(source) {
        return source.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
    }

    function base64Encode(obj) {
        var encoded = new Buffer(JSON.stringify(obj), 'utf8').toString('base64');
        return urlEscape(encoded);
    }

    function readPrivateKey() {
        if (!gaKey) {
            gaKey = fs.readFileSync(GA_KEY_PATH, 'utf8');
        }
        return gaKey;
    }

    var authorize = function(callback) {

        var self = this,
            now = parseInt(Date.now() / 1000, 10), // Google wants us to use seconds
            cipher,
            signatureInput,
            signatureKey = readPrivateKey(),
            signature,
            jwt;

        // Setup time values
        authClaimSet.iat = now;
        authClaimSet.exp = now + 60; // Token valid for one minute

        // Setup JWT source
        signatureInput = base64Encode(authHeader) + '.' + base64Encode(authClaimSet);

        // Generate JWT
        cipher = crypto.createSign('RSA-SHA256');
        cipher.update(signatureInput);
        signature = cipher.sign(signatureKey, 'base64');
        jwt = signatureInput + '.' + urlEscape(signature);

        // Send request to authorize this application
        request({
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            uri: 'https://accounts.google.com/o/oauth2/token',
            body: 'grant_type=' + escape('urn:ietf:params:oauth:grant-type:jwt-bearer') +
                '&assertion=' + jwt
        }, function(error, response, body) {
            if (error) {
                console.log(error);
                callback(new Error(error));
            } else {
                var gaResult = JSON.parse(body);
                if (gaResult.error) {
                    callback(new Error(gaResult.error));
                } else {
                    callback(null, gaResult.access_token);
                    console.log(gaResult);
                    console.log("Authorized");

                }
            }
        });

    };



    var request = require('request'),
        qs = require('querystring');

    authorize(function(err, token) {
        if (!err) {
            // Query the number of total visits for a month

            var requestConfig = {
                'ids': 'ga:72333024',
                'dimensions': 'ga:country',
                'metrics': 'ga:users',
                'sort': '-ga:users',
                'start-date': '2013-04-08',
                'end-date': '2014-08-09',
                'max-results': '10'
            };

            request({
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token // Here is where we use the auth token
                },
                uri: 'https://www.googleapis.com/analytics/v3/data/ga?' + qs.stringify(requestConfig)
            }, function(error, resp, body) {
                console.log(body);
                var data = JSON.parse(body);
                console.log(data);
            });
        }
    });
}

exports.test=function(req,res){
    console.log("we are now in jobsController");
    //res.send("jobsController is in send");
    // jobModel.find({companyName:'OutOfBits'}, function (err, docs) {
    jobModel.find({}, function (err, docs) {
        if(err){
            console.log(err);
            res.send("There was an error");
        }else{
            // console.log(docs);
            var jobs=[];
            for(var i=0;i<docs.length;i++){
                jobs[i]=JSON.stringify(docs[i]);
            }
            res.send(jobs);
        }
    });
}


/**
 * Takes the parameters from our post and finds the current job - with
 * the given job id - and sets its attributes to the ones given by the
 * post. Then saves this job document i nmongodb.
 * /Patty
 * @param req
 * @param res
 */
exports.updateJob = function(req, res) {
    console.log("updateJob called");
    var Job = mongoose.model('Jobs');
    var newJob = new Job(getJobModelBody(req, false));
    console.log("Job id to be updated: " + newJob._id);
    jobModel.findOne({ _id: newJob._id }, function (err, doc) {
        if(err){
            console.log(err);
            res.send("There was an error");
        }else{
            console.log(doc);
            doc.companyName = newJob.companyName;
            doc.title = newJob.title;
            doc.description = newJob.description;
            doc.salary = newJob.salary;
            doc.isGig = newJob.isGig;
            doc.contactName = newJob.contactName;
            doc.contactNumber = newJob.contactNumber;
            doc.lengthInHours = newJob.lengthInHours;
            doc.hashTags = newJob.hashTags;
            doc.LatLng = newJob.LatLng;
            doc.imageUrlLogo = newJob.imageUrlLogo;
            doc.save(function (err) {
                if(err) {
                    console.log("There was an error: " + err);
                    res.send("There was an error: " + err);
                } else {
                    console.log("Successfully updated job!");
                    res.send("Successfully update job!");
                }
            });
        }
    });
}

/**
 * Takes all the parameters from our post and puts them
 * into a job document, which is then saved in mongodb.
 * Non-required attributes may be null
 * /Patty
 * @param req
 * @param res
 */
exports.createJob = function(req, res) {
    console.log("createJob called");
    var Job = mongoose.model('Jobs');
    var newJob = new Job(getJobModelBody(req, true));
    newJob.save(function(err) {
        if(err) {
            res.send("There was an error in saving the job: " + err);
        } else {
            res.send("job created!");
        }
    });
}

/**
 * Creates the body of a job model.
 * Whether it contains an _id is optional
 * @param req
 * @returns {*}
 */
function getJobModelBody(req, setId) {
    if(setId) {
        req.body._id = mongoose.Types.ObjectId().toString();
    }
    req.body.isGig = (req.body.isGig == 1 ? true : false);
    return req.body;
}

/**
 * A simple little funciton that checks whether or not a job document
 * is valid, by checking to see if required parameters are undefined.
 * /Patty
 * @deprecated since this was used in conjuction with getJobDoc
 * @param job
 * @returns {boolean}
 */
function isJobValid(job) {
    if(job.companyName == 'undefined' ||
        job.title == 'undefined' ||
        job.description == 'undefined' ||
        job.salary == 'undefined') {
        return false;
    } else return true;
}

/**
 * I wrote this function to be able to quickly get a job document
 * by retrieving parameters from the request.
 * /Patty
 * @deprecated since we no longer retrieve data from the request parameters.
 * @param req
 * @returns {{companyName: String, title: String, description: String, salary: String, isGig: boolean, contactName: String, contactNumber: String, lengthInHours: Number, hashTags: Array, LatLng: {lat: Number, lng: Number}, imageUrlLogo: String}}
 */
function getJobDoc(req) {
    var companyName = req.param('companyName', 'undefined');
    var title = req.param('title', 'undefined');
    var desc = req.param('description', 'undefined');
    var salary = req.param('salary', 'undefined');
    var isGig = (req.param('isGig') == 1 ? true : false);
    var contactName = req.param('contactName', 'undefined');
    var contactNumber = req.param('contactNumber', 'undefined');
    var lengthInHours = parseInt(req.param('lengthInHours', '-1'));
    var hashTags = new Array();
    var hashTagsInput = req.param('hashTags', 'undefined');
    if(hashTagsInput != undefined) {
        for(var hashTag in hashTagsInput.split(',')) {
            hashTags.push(hashTag);
        }
    }
    var latLng = {
        lat: parseInt(req.param('lat', '-1')),
        lng: parseInt(req.param('lng', '-1'))
    }
    var imageUrlLogo = req.param('imageUrlLogo', 'undefined');
    var doc = {
        companyName: companyName,
        title: title,
        description: desc,
        salary: salary,
        isGig: isGig,
        contactName: contactName,
        contactNumber: contactNumber,
        lengthInHours: lengthInHours,
        hashTags: hashTags,
        LatLng: latLng,
        imageUrlLogo: imageUrlLogo
    }
    return doc;
}