define(
    [
        'jade!../templates/AddNewItemTemplate',
        'backbone',
        'backbone_validation'//,
        //'facebook'
    ],
    function (AddNewItemTemplate, Backbone) {
        var AddNewItemView = Backbone.Marionette.Layout.extend({
            template: function() {
                console.log('trying to render AddNewItemTemplate');
                var that = this;
                return _.template(AddNewItemTemplate());
            },
            initialize: function (options) {
                this.options = options || {};
                this.Geocoder = new google.maps.Geocoder();
            },
            onShow:function(){
                // on show is called when the view is created via the app.region.show(new view) call.
                $("#AddNewItemTags").tagsInput();
                var selDiv = $('#list');
            },
            events: {
                "submit #UploadForm": "sendForm"
            },validateAttri: function (obj) {
                if (typeof obj !== "undefined" && obj !== "" && obj !== null) {
                    return true;
                } else {
                    return false;
                }
            },
            sendForm: function (e) {
                e.preventDefault();
                var IsTitleValid = $('#AddNewItemTitle').val();
                var IsPriceDefined = $('#priceInput').val();
                var IsPriceFree = $('#FreeCheckbox').attr('checked');
                if (this.validateAttri(IsTitleValid) && (this.validateAttri(IsPriceDefined) || this.validateAttri(IsPriceFree))) {
                    // create our formData object
                    var formData = new FormData($('#UploadForm')[0]);
                    formData.append("title", JSON.stringify(IsTitleValid));
                    // if isfree is checked, set price to 0
                    if (typeof IsPriceFree !== typeof undefined && IsPriceFree !== false) {
                        formData.append("price", JSON.stringify(0.0));
                    }else{
                        // if isfree isn't checked and ispricedefined exists, set price to the defined price.
                        formData.append("price", JSON.stringify(parseFloat(IsPriceDefined)));
                    }
                    var negotiable = $('#NegotiableCheckbox').attr('checked');
                    if (typeof negotiable !== typeof undefined && negotiable !== false) {
                        formData.append("priceNegotiable", JSON.stringify(true));
                    } else {
                        formData.append("priceNegotiable", JSON.stringify(false));
                    }
                    var tags = JSON.stringify($('#AddNewItemTags').val().split(','));
                    if (tags === [""]) {
                        tags = JSON.stringify([null]);
                    }
                    console.log(tags);
                    formData.append("hashTags", tags); // hashtag array[string]

                    // google query = text search of the location keyword
                    var Query = $('#AddItemLocationTextField').val();
                    console.log(Query);
                    var latlng;
                    if (this.validateAttri(Query)) {
                        console.log('Geocoder getting ' + Query);
                        this.Geocoder.geocode({'address': Query }, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                latlng = results[0].geometry.location;

                                console.log({lat: latlng.lat(), lng: latlng.lng()});
                                formData.append("Lat", JSON.stringify(latlng.lat()));
                                formData.append("Lng", JSON.stringify(latlng.lng()));
                                // adress:      results[0].formatted_address
                                // location:        latlng.lat(), latlng.lng()

                                // formData.append("priceNegotiable",false); // checkbox
                                // session from current user.
                                var articleID = 'tempArticleId';
                                var userID = 'tempUserId';
                                $.ajax({
                                    type: 'POST',
                                    url: '/createArticle',
                                    //url: '/upload/:articleID',
                                    data: formData,
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    headers: { 'articleID': articleID, 'userID': userID},
                                    success: function (data) {
                                        console.log("success");
                                        console.log(data);
                                    },
                                    error: function (data) {
                                        console.log("error");
                                        console.log(data);
                                    }
                                });
                            } else {
                                console.log("google error, or location doesn't exist");
                                alert("location doesn't exist");
                            }
                        });
                        // set the new location if succesfull, returns hte same location as before if failed.

                    } else {
                        console.log("google query value is empty");
                    }
                }

            }

        });

        return AddNewItemView;
    });

