define(
    ['app', './views/SignupView', './views/LoginView'], function(App, SignupView, LoginView) {
        var redirectFB = false;
        var AuthController = Backbone.Marionette.Controller.extend({
            signup: function() {
                var fromFacebook = true;
                var viewOptions = {
                    redirectFB: fromFacebook
                };
                App.content.show(new SignupView());
            },
            login: function() {
                console.log('opening loginview');
                App.content.show(new LoginView());
            }
        });
        return AuthController;
    });