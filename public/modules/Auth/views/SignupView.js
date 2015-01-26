define(
    [
        'app',
        'jade!../templates/SignupTemplate',
        'models/SignupModel',
        'backbone',
        'backbone_validation',
        'facebook'
    ],
    function (App,SignupTemplate,SignupModel, Backbone) {
        var SignupView = Backbone.Marionette.Layout.extend({
            requireLogin: true,

            model:new SignupModel(),
            template: function() {
                console.log('trying to render SignupTemplate');
                var that = this;
                return _.template(SignupTemplate());
            },
            initialize: function (options) {
                this.options = options || {};
                this.user = "hans";

            },
            events: {
                "submit #registerForm": "register"// example {"submit #AnForm" : "postform"}
            },
            register: function (event) {

                event.preventDefault();
                console.log("wat");
                // send ajax POST  /users from forms
                // {"email":"email@email.com",
                // "name":"patrick",
                //  "password":"123",
                //  "city":"roskilde",
                //  "university":"navnpåuni"}

                // validate that the fields are not empty and that the required fields are filled correctly (email proper format)
                //
                var createUser = new SignupModel();

                var user_details = {
                    email:$('input[id=inputEmail]').val(),
                    name:$('input[id=inputFullName]').val(),
                    password:$('input[id=inputPassword]').val(),
                    city:$('#city option:selected').text(),
                    university:$('#university option:selected').text()
                };

                console.log(user_details);
                if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(user_details.email)) {
                    this.model = createUser;
                    this.model.save(user_details,{error: function (model, error) {
                        console.log(error.responseText);

                    },
                        success: function (model, response) {
                            console.log('User Signup Updated'+ response.message)
                        }
                    });
                } else {
                    alert('Email or Password cannot be empty');
                    return false;
                }


            }
        });

        return SignupView;
    });
