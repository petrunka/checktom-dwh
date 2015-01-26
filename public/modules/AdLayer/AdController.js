define(
    [
        'app',
        './views/AdView'
    ],
    function(App,AdView) {
        var AdController = Backbone.Marionette.Controller.extend({
            GoToAd: function(){
                console.log("opening ad view");
                App.content.show(new AdView());
            }
        });
        return new AdController();
    });

