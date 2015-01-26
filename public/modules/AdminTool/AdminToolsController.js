define(
    [
        'app',
        './views/AdminToolsView'
    ],
    function(App, AdminToolsView, EditUserView, DashboardView) {
        var AdminToolsController = Backbone.Marionette.Controller.extend({
            GoToAdminTools: function(){
                console.log("opening admintools view");
                App.content.show(new AdminToolsView());
            }
        });
        return new AdminToolsController();
    });