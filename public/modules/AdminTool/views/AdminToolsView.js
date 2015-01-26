define(
    [
        'app',
        'jade!../templates/AdminToolsTemplate',
        'backbone',
        'models/ItemCollectionModel',
        '../views/AdminToolsView',
        '../views/EditUserView',
        '../views/DashboardView',
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
        'flatuiApp'
    ],
    function (App, AdminToolsTemplate, Backbone, adminUserModel, AdminToolsView, EditUserView, DashboardView) {
        var AdminToolsView = Backbone.Marionette.Layout.extend({
            requireLogin: true,
            template: function () {
                console.log('trying to render admintoolstemplate');
                var that = this;
                return _.template(AdminToolsTemplate());
            },
            initialize: function (options, query) {
                $.ajax({
                    url: '/authAdminUser',
                    method: 'GET',
                    data: query,
                    success: function (data) {
                        console.log(data);
                        if (data) {
                            App.content.show(new DashboardView);
                        }
                    },
                    error: function(data){
                        console.log("Error has happened: ");
                        console.log(data);
                    }
                });
            },
            ohShow: function (query) {

            },
            events: {
                'submit #LoginForm': 'AdminLogin',
                'submit #adminForm': 'createAdmin'
            },
            validate: function () {
                if (this.$email == "" && this.$password == "") {
                    alert('Email or Password cannot be empty');
                    return false;
                } else if (this.$email == "") {
                    alert('Email cannot be empty');
                    return false;
                } else if (this.$password == "") {
                    alert('Password cannot be empty');
                    return false;
                } else {
                    return true;
                }
            },
            AdminLogin: function (event) {
                event.preventDefault();

                this.$email = $('#inputEmail').val();
                this.$password = $('#inputPassword').val();
                if (this.validate()) {
                    var data = {
                        "email": this.$email,
                        "password": this.$password
                    };
                    console.log(data);
                    data = JSON.stringify(data);
                    $.ajax({
                        url: '/adminLogin',
                        type: 'POST',
                        contentType: 'application/json',
                        data: data,
                        success: function (data) {
                            if (data) {
                                App.content.show(new DashboardView);
                            } else {
                                alert("Wrong email or password");
                                App.content.show(new AdminToolsView);
                            }
                        },
                        error: function (err) {
                            alert("Something has gone wrong logging you in, try again");
                        }
                    });
                }

            },

            createAdmin: function (event) {
                event.preventDefault();

                this.$email = $('#inputEmail2').val();
                this.$password = $('#inputPassword2').val();
                if (this.validate()) {
                    var data = {
                        "email": this.$email,
                        "password": this.$password
                    };
                    console.log(data);
                    data = JSON.stringify(data);
                    $.ajax({
                        url: 'createTestAdmin',
                        type: 'POST',
                        contentType: 'application/json',
                        data: data,
                        success: function (data) {
                            if (data == "Ok") {
                                alert("Admin Login Created");
                            }
                        },
                        error: function (err) {
                            console.log("Error " + err);
                        }
                    });
                }

            }

        });

        return AdminToolsView;
    })
;
