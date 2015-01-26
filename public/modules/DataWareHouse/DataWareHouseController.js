define(
    [
        'app'
 //       './views/DataWareHouseView'
    ],
    function(App,DataWareHouseView) {
        var DataWareHouseController = Backbone.Marionette.Controller.extend({
            GoToDataWareHouse: function(){
                console.log("opening DataWareHouse view");
            //    App.content.show(new DataWareHouseView());
            }
        });
        return new DataWareHouseController();
    });

