define(
    [
        'app',
        './views/StreamView'
    ],
    function(App,StreamView) {
        var redirectFB = false;
        var StreamController = Backbone.Marionette.Controller.extend({

            AddItem: function(){
                console.log("opening create article view");
                //App.content.show(new CreateArticleView());
            },
            GoToStream: function(){
                console.log("opening stream view");
               App.content.show(new StreamView());
            }
        });
        return new StreamController();
    });

