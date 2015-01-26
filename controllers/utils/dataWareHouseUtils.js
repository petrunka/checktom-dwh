/**
 * Created by Roman on 09-09-2014.
 */

var FB = require('fb');

function getDataFromGA(Dimension, Metric, StartDate, EndDate, MaxResults,callback) {
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

    var authorize = function (callback) {

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
        }, function (error, response, body) {
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
    authorize(function (err, token) {
        if (!err) {
            // Query the number of total visits for a month

            var requestConfig = {
                'ids': 'ga:72333024',
                'dimensions': Dimension,
                'metrics': Metric,
                // 'sort': '-ga:users',
                'start-date': StartDate,
                'end-date': EndDate,
                'max-results': MaxResults
            };

            request({
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token // Here is where we use the auth token
                },
                uri: 'https://www.googleapis.com/analytics/v3/data/ga?' + qs.stringify(requestConfig)
            }, function (error, resp, body) {

                callback(body);
            });
        }
    });
};
exports.getDataFromGA = getDataFromGA;


function getDataFromFB(FBid,callback) {


    FB.napi(FBid, function (error, response) {
        if (error) {
            if (error.response.error.code === 'ETIMEDOUT') {
                console.log('request timeout');
            }
            else {
                console.log('error', error.message);
            }
        } else {
            console.log(JSON.parse(JSON.stringify(response)));
            callback(JSON.stringify(response));
            return response;
        }

    });

    console.log("test:"+test());// was comment

};
exports.getDataFromFB = getDataFromFB;
function doesUserExistInFB(FBid) {

};