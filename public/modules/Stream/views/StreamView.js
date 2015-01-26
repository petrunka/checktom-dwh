define(
    [
        'app',
        'jade!../templates/DeprecStreamTemplate',
        'backbone',
        'models/ItemCollectionModel',
        '../views/AddNewItemView',
        '../views/ItemDetailView',
        'backbone_validation',
        'jquery',
        'jqueryUI',
        'jqueryTouch',
        'bootstrap',
        'bootstrapSelect',
        'bootstrapSwitch',
        'flatuiCheckbox',
        'flatuiRadio',
        'flatuiTags',
        'flatuiplaceholder',
        'flatuiApp',
        'woomark'
        //,
        //'facebook'
    ],
    function (App, StreamTemplate, Backbone,ItemCollectionModel, NewItemView,ItemDetailView) {
        var StreamView = Backbone.Marionette.Layout.extend({
            requireLogin: true,
            model:new ItemCollectionModel({ StreamItems: "", SearchItems: ""}),
            SearchCurrentLocation:null,
            template: function () {
                console.log('trying to render Stream template');
                return _.template(StreamTemplate());
            },
            initialize: function (options) {
                this.options = options || {};
                this.UseDistanceFilter = false;
                console.log("UseDistance Filter = " + this.UseDistanceFilter);
                this.user = {name: "Andreas"};
                this.SearchCurrentLocation = {lat: "", lng: ""};
                this.Geocoder = new google.maps.Geocoder();
                this.sensorGps();

                // get current location fromg gps

                // location will change in future if the user edits the location field.
            },
            // potentially addnew item could generate an invisible div, that is then animated to visibility
            regions: {
                AddNewItemMenu: "#AddNewItem"
                // thislayout.AddNewItemMenu.show(new view);
            },
            events: {
                "click #SearchButton": "searchToolSubmit",
                "click #add_new_item": "OpenAddNewItemMenu",
                "change #location": "LocationChanged",
                "click .item":"OpenDetailView"
            },
            OpenDetailView:function(e){
                e.preventDefault();
                console.log("clicked the item");

                /*$('.bs-example-modal.lg').modal({
                    show: true
                });
*/
                App.content.show(new ItemDetailView());

            },
            OpenAddNewItemMenu: function (e) {
                e.preventDefault();
                console.log("the StreamItems collection");
                console.log(this.model.get('StreamItems'));
                console.log("the SearchItems collection");
                console.log(this.model.get('SearchItems'));
                $("#AddNewItem").slideToggle();

            },
            SetDistanceEnabled: function () {
                if ($("#distance-slider").val() >= 31) {
                    this.UseDistanceFilter = false;
                } else {
                    this.UseDistanceFilter = true;
                }
                console.log("UseDistance Filter = " + this.UseDistanceFilter);
            },
            LocationChanged: function (e) {
                e.preventDefault();
                console.log("location changed");
                this.GoogleQuerySearch();
            },
            GoogleQuerySearch: function () {
                // try with query first so we can reuse this google api for more usecases.
                // get the adress and lat/lng of the google map location
                // save those values somewhere. for createItem usecase and searchQuery
                var Query = $('#location').val();
                console.log(Query);
                var latlng;
                if (Query != "") {

                    console.log('Geocoder getting ' + Query);
                    this.Geocoder.geocode({'address': Query }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            latlng = results[0].geometry.location;
                            this.SearchCurrentLocation = {lat: latlng.lat(), lng: latlng.lng()};
                            console.log(this.SearchCurrentLocation);
                            // adress:      $('results[0].formatted_address
                            // location:        latlng.lat(), latlng.lng()

                        } else {
                            console.log("google error");
                        }


                    });
                    // set the new location if succesfull, returns hte same location as before if failed.

                }
            },
            sensorGps: function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        successCallback,
                        errorCallback_highAccuracy,
                        {maximumAge: 600000, timeout: 5000, enableHighAccuracy: true}
                    );
                    function errorCallback_highAccuracy(position) {
                        if (error.code == error.TIMEOUT) {
                            // Attempt to get GPS loc timed out after 5 seconds,
                            // try low accuracy location
                            console.log("attempting to get low accuracy location");
                            navigator.geolocation.getCurrentPosition(
                                successCallback,
                                errorCallback_lowAccuracy,
                                {maximumAge: 600000, timeout: 10000, enableHighAccuracy: false});
                            // testing without // return;
                        }

                        var msg = "<p>Can't get your location (high accuracy attempt). Error = ";
                        if (error.code == 1)
                            msg += "PERMISSION_DENIED";
                        else if (error.code == 2)
                            msg += "POSITION_UNAVAILABLE";
                        msg += ", msg = " + error.message;

                        console.log(msg);
                    }

                    function errorCallback_lowAccuracy(position) {
                        var msg = "<p>Can't get your location (low accuracy attempt). Error = ";
                        if (error.code == 1)
                            msg += "PERMISSION_DENIED";
                        else if (error.code == 2)
                            msg += "POSITION_UNAVAILABLE";
                        else if (error.code == 3)
                            msg += "TIMEOUT";
                        msg += ", msg = " + error.message;

                        console.log(msg);
                    }

                    function successCallback(position) {
                        var latitude = position.coords.latitude;
                        var longitude = position.coords.longitude;
                        console.log("<p>Your location is: " + latitude + "," + longitude + " </p><p>Accuracy=" + position.coords.accuracy + "m");
                        // now we got the latitutde longtitude values of the gps.
                        // now do something with them.

                        this.SearchCurrentLocation = {lat: latitude, lng: longitude};
                        console.log("" + this.SearchCurrentLocation.lat + "," + this.SearchCurrentLocation.lng)

                    }

                }
            },
            searchToolSubmit: function (e) {
                e.preventDefault();
                console.log("we're in.");

                console.log(this.user.name);
                var data = {"sortType": "default"};
                // validate required fields..
                /*
                 "keyword": cant be "", cant be null, must be string
                 "price": cant be null, 0 to infinite, number or float.
                 "hashTags": [null],     array of strings, cant be an empty array, undefined or null
                 "sortType": "default"}, by default doesn't matter, if defined "cheap" or "expensive" will show "cheap" or "expensive" items first descending or ascending
                 */
                // get values from fields..
                data.price = $('#price-slider').slider("option", "value");
                if (data.price >= 15001) {
                    data.price = 999999999;
                }
                if ($('#SearchTags').val() === "") {
                    data.hashTags = [null];
                } else {
                    data.hashTags = $('#SearchTags').val().toLowerCase().split(',');
                }

                data.keyword = $('#search').val();
                console.log(data);
                // make a java object with the correct field names

                if (typeof data.keyword !== "undefined" && data.keyword !== "" && data.keyword !== null &&
                    typeof data.price !== "undefined" && data.price !== null &&
                    typeof data.hashTags !== "undefined" && data.hashTags instanceof Array && data.hashTags !== []) {
                    this.SetDistanceEnabled();
                    if (this.UseDistanceFilter) {
                        this.search(data, true);
                    } else {
                        this.search(data, false);
                    }

                } else {
                    console.log("fields didn't validate");
                }

            },
            // Query = Javascript object / JSON = {"keyword":" ","price"  :"9999999999999","hashTags":[],"sortType":"default"}
            search: function (query, SearchQuery) {
                var nrResults = 0;
                var resultArray = [];
                var lat = this.SearchCurrentLocation.lat;
                var lng = this.SearchCurrentLocation.lng;
                // Ajax append data from
                $.ajax({
                    url: '/searchQuery',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(query),
                    context:this,
                    success: function (data) {
                        console.log(data);
                        console.log("streamitems"+this.model.get('StreamItems'));
                        var ListOfFilteredElements = [];
                        // clear the list
                        $('#item_list').html("");



                        var handler = $('#item_list .item');
                        if(SearchQuery)
                        {
                            this.model.set({SearchItems:ListOfFilteredElements});
                        }else{
                            this.model.set({StreamItems:ListOfFilteredElements});
                        }
                        console.log(this.model);
                        handler.wookmark({
                            // Prepare layout options.
                            autoResize: true, // This will auto-update the layout when the browser window is resized.
                            container: $('#main'), // Optional, used for some extra CSS styling
                            offset: 10, // Optional, the distance between grid items
                            outerOffset: -35, // Optional, the distance to the containers border
                            itemWidth: 230 // Optional, the width of a grid item
                        });

                    },
                    error: function (data) {
                        console.log(data);
                    }
                })



                function IsWithinMaxDistance(FromLat, FromLng, maxDist, ToLat, ToLng) {
                    if (maxDist !== 0) {
                        if (getDistanceFromLatLonInKm(FromLat, FromLng, ToLat, ToLng) <= maxDist) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    else {
                        return true;
                    }
                    console.log("error in max distance calc");

                }

                function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
                    var R = 6371; // Radius of the earth in km
                    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
                    var dLon = deg2rad(lon2 - lon1);
                    var a =
                            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                                    Math.sin(dLon / 2) * Math.sin(dLon / 2)
                        ;
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    var d = R * c; // Distance in km
                    return d;
                }

                function deg2rad(deg) {
                    return deg * (Math.PI / 180)
                }

            },

            onShow: function () {


                $("#SearchTags").tagsInput();
                var $distanceslider = $("#distance-slider");
                var $priceslider = $("#price-slider");

                // 0 means, ignore location
                // 30 is the highest area we can calc.
                $distanceslider.slider({
                    min: 0,
                    max: 31,
                    value: 1,
                    step: 5,
                    orientation: "horizontal",
                    range: "min",
                    slide: function (event, ui) {

                        $distanceslider.val(ui.value);
                    }
                });

                $priceslider.slider({
                    min: 0, max: 15001,
                    value: 5,
                    orientation: "horizontal",
                    range: "min",
                    slide: repositionTooltip,
                    stop: hideTooltip
                });

                function repositionTooltip(e, ui) {
                    var div = $(ui.handle).data("bs.tooltip").$tip[0];
                    var pos = $.extend({}, $(ui.handle).offset(), { width: $(ui.handle).get(0).offsetWidth,
                        height: $(ui.handle).get(0).offsetHeight
                    });

                    var actualWidth = div.offsetWidth;

                    tp = {left: pos.left + pos.width / 2 - actualWidth / 2}
                    $(div).offset(tp);

                    $(div).find(".tooltip-inner").text(ui.value);
                }

                function hideTooltip(e, ui) {
                    $("#price-slider .ui-slider-handle:first").tooltip().tooltip("hide");
                    console.log('tooltip is hiding');
                }


                $("#price-slider .ui-slider-handle:first").tooltip({title: $priceslider.slider("value"), placement: 'bottom', trigger: "focus"}).tooltip("hide");

                this.AddNewItemMenu.show(new NewItemView());
                // Load the initial stream with search.
                this.search({
                    "keyword": " ",
                    "price": "9999999999999",
                    "hashTags": [],
                    "sortType": "default"}, false);
                console.log("itemCollectionFromStream");

                // Load google with their annoying asynch requirement.
                function loadScript() {
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = 'http://maps.googleapis.com/maps/api/js?sensor=false&key=AIzaSyBrrmVENiVmfgcUHzDBVmN85PBIHNJwAiI' +
                        'callback=initialize';
                    document.body.appendChild(script);
                }

                window.onload = loadScript;
            }
        });

        return StreamView;
    });


/*
 * SetupGoogleLocationFields: function () {
 // stil not working, goal: To load in the google adress
 // of the users current location using the sensorsubvalue.
 var query = this.SearchCurrentLocation;
 var latlng;
 console.log("query is : " + query);

 this.Geocoder.geocode({'address': query.lat + "," + query.lng}, function (results, status) {
 if (status == google.maps.GeocoderStatus.OK) {
 latlng = results[0].geometry.location;
 this.SearchCurrentLocation = {lat: latlng.lat(), lng: latlng.lng()};
 console.log(this.SearchCurrentLocation);
 $('#AddItemLocationTextField').val(results[0].formatted_address);
 $('#location').val(results[0].formatted_address);
 // adress:      $('results[0].formatted_address
 // location:        latlng.lat(), latlng.lng()

 } else {
 console.log("google error");
 }
 });
 },
 *
 * */