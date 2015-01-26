var mongoose = require('mongoose'),
    Article = mongoose.model('Articles'),
    photoController = require('./photoController.js'),
    formidable = require('formidable');

var validateAttri = function (attribute) {
    if (typeof attribute !== 'undefined'
        && attribute !== null
        && attribute !== '') {
        return true;
    } else {
        return false;
    }
}

exports.CreateArticle = function (req, res) {
    console.log("we're in!");
    console.log(req.user.name);
    var request = req;
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
        console.log(fields);
        // if req.body.author == req.session.userid (user can change this varible through great work, but storing the session elsewhere so client only recieves a token may be a solution.)
        // http://stackoverflow.com/questions/6912223/is-it-possible-to-change-a-session-variable-client-side
        if (true) { // validateAttri(request.user.name) redis user session is active and = req.user.name then okay.
            if (validateAttri(fields.title) && validateAttri(fields.price) && validateAttri(fields.Lng) && validateAttri(fields.Lat) && validateAttri(fields.priceNegotiable) && validateAttri(fields.description)) {
                // validate the fields in the form and make sure the required fields are filled.
                console.log("tags:"+fields.hashTags);
                var NewArticle = new Article({
                    author: request.user.name,
                    title: fields.title,
                    description: fields.description,
                    priceNegotiable: fields.priceNegotiable, // boolean set in client
                    LatLng: {Lat: fields.Lat, Lng: fields.Lng} // numbers from strings probably.
                });
                var price = fields.price;
                    if (price > 0 || price == "free") {
                        NewArticle.price = price;
                    } else if (price == 0) {
                        NewArticle.price = 0;
                    }
                console.log(price);
                var hashTags = JSON.parse(fields.hashTags);

                if (hashTags instanceof Array) {
                    console.log("array verified");
                    NewArticle.hashTags = hashTags;
                } else{
                    console.log("array declined");
                    NewArticle.hashTags = [null]
                }

                if ((typeof fields.articleId != 'undefined') && fields.articleId != null && fields.articleId != "") {
                    console.log('article id found' + fields.articleId);
                    // mongoose hex-casts a non-objectId value. Or we can try to wrap the id.
                    NewArticle._id = fields.articleId;
                } else {
                    console.log('no article id, creating new');
                    NewArticle._id = mongoose.Types.ObjectId().toString();
                    console.log("new id" + NewArticle._id);
                }
                NewArticle.imageUrl = NewArticle._id + "." + files["image0"].name.split('.').pop();

                // photocontroller returns true if succesfully saving the images.
                if (photoController.photoUploadAndResize(NewArticle._id, files)) {
                    var upsertData = NewArticle.toObject();
                    delete upsertData._id;
                    Article.findByIdAndUpdate({"_id": NewArticle._id}, upsertData, {upsert: true}, function (err) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                        } else {
                            console.log("success");
                            res.send("ArticleUpdated");
                        }
                    });
                }
            }else{
                console.log('wrong input format');
                res.send(500,'form input incomplete');
            }
        }else{
            console.log('you are not logged in');
            res.send(500,'you are not logged in');
        }
    });
};


// ATM
// Query pipeline:
// Find results matching keyword, find results matching price limitation, find results matching hashtags.
// $in hashtags, is supposed to be an array ['hash1','hash2']from the client
exports.SearchArticles = function (req, res) {

    if (req.body.keyword != null && req.body.keyword != "") {

        console.log(req.body.sortType + 'body');
        var hashTags = req.body.hashTags;
        if (hashTags == null || hashTags == "") {
            hashTags = [null, null];
        }
        Search(req.body.keyword, req.body.price, hashTags, req.body.sortType, res);
    }
}

function Search(keyWord, price, hashTags, sortType, res) {
    console.log("keyword: " + keyWord + " other:" + price + hashTags + sortType);
    if (validateAttri(keyWord)) {
        var TenHashTags = [null, null, null, null, null,
            null, null, null, null, null];

        if (validateAttri(hashTags)) {
            for (i = 0; i < hashTags.length; i++) {
                // copy the hashtags from the client into our search algorithm.
                TenHashTags[i] = hashTags[i];
            }
        }else{hashTags = []}
        console.log(TenHashTags);

        var priceQuery = {};
        if (price == 'free' || price == 0) {
            priceQuery = {price: 0};
        } else if (price > 0) {
            priceQuery = {price: { $lt: parseInt(price) }};
        }
        console.log(priceQuery);
        // sorts the articles the number of matching hashtags descending
        var sortMethod = {$sort: {matches: -1}};
        if (sortType == "cheap") {
            var sortMethod = {$sort: {price: 1}};
        } else if (sortType == "expensive") {
            var sortMethod = {$sort: {price: -1}};
        }
        console.log("sortMethod: " + sortMethod);
        Article.aggregate(
            {$match: {$and: [
                {$or: [
                    {"hashTags": {$in: hashTags}},
                    {title: {$regex: keyWord, $options: 'i' }}
                ]},
                priceQuery
            ]
            }}, // filter to the ones that match
            {$unwind: "$hashTags"}, // unwinds the array so we can match the items individually
            {$group: { // groups the array back, but adds a count for the number of matches
                _id: "$_id",
                matches: {
                    $sum: {
                        $cond: [
                            {$eq: ["$hashTags", TenHashTags[0]]},
                            1,
                            {$cond: [
                                {$eq: ["$hashTags", TenHashTags[1]]},
                                1,
                                {$cond: [
                                    {$eq: ["$hashTags", TenHashTags[2]]},
                                    1,
                                    {$cond: [
                                        {$eq: ["$hashTags", TenHashTags[3]]},
                                        1,
                                        {$cond: [
                                            {$eq: ["$hashTags", TenHashTags[4]]},
                                            1,
                                            {$cond: [
                                                {$eq: ["$hashTags", TenHashTags[5]]},
                                                1,
                                                {$cond: [
                                                    {$eq: ["$hashTags", TenHashTags[6]]},
                                                    1,
                                                    {$cond: [
                                                        {$eq: ["$hashTags", TenHashTags[7]]},
                                                        1,
                                                        {$cond: [
                                                            {$eq: ["$hashTags", TenHashTags[8]]},
                                                            1,
                                                            {$cond: [
                                                                {$eq: ["$hashTags", TenHashTags[9]]},
                                                                1,
                                                                0
                                                            ]
                                                            }
                                                        ]
                                                        }
                                                    ]
                                                    }
                                                ]
                                                }
                                            ]
                                            }
                                        ]
                                        }
                                    ]
                                    }
                                ]
                                }
                            ]
                            }
                        ]
                    }
                },
                author: {$first: "$author"},
                title: {$first: "$title"},
                description: {$first: "$description"},
                price: {$first: "$price"},
                priceNegotiable: {$first: "$priceNegotiable"},
                LatLng: {$first: "$LatLng"},
                imageUrl:{$first:"$imageUrl"},
                HashTags: {$push: "$hashTags"}
            }
            },
            sortMethod, // sorts the articles by method
            // rebuilds the original structure
            {$project: {matches: 1, Article: {author: "$author", title: "$title", description: "$description", price: "$price", LatLng: "$LatLng", HashTags: "$HashTags",imageUrl:"$imageUrl"}}},

            function (err, results) {
                if (!err) {
                    console.log(JSON.stringify(results));
                    res.send(results);
                } else {
                    return err
                }
            }
        );
    } else {
        console.log('no keyword supplied');
    }
}