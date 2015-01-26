define(function (require) {
    var ItemCollectionModel = Backbone.Model.extend({

        initialize: function () {
            console.log("initializing collection model");
        }

    });
    return ItemCollectionModel;
});
