define(
    [
        'jade!../templates/ItemDetailTemplate',
        'socketio',
        'backbone',
        'backbone_validation'//,
        //'facebook'  new layout();
    ],
    function (ItemDetailTemplate, io, Backbone) {
        var ItemDetailView = Backbone.Marionette.Layout.extend({
            template: function () {
                console.log('trying to render ItemDetailView');
                var that = this;
                return _.template(ItemDetailTemplate());
            },
            initialize: function (options) {
                this.options = options || {};
                this.user = localStorage.getItem('username');
                this.reciever ={"username":"notjohn"};
                this.socket = io.connect();

            },
            events: {
                "submit #send-message": "sendMsg"

            },
            sendMsg: function (e) {
                //prevent the default behviour of form submission
                console.log("clicked submit");
                e.preventDefault();
                //get value from the messageBox and write to the socket
                this.socket.emit('send message', "#" + this.reciever.username + ' ' + $('#message').val(), function (data) {
                    $('#chat').append('<span class="error">' + data + "</span><br/>");
                });
                //clear the messageBox value
                $('#message').val('');
            },
            loadChat: function (user) {



                // login - take backbone userdata and log us in on the server.

                //$nickBox.val('');

                /*
                 socket.on('usernames', function(data){
                 var html ='';
                 for (var i = 0 ; i<data.length ; i++) {
                 //chat name list should not contains user self name
                 if($nickBox.val()!==data[i]){
                 console.log('nickBox.val '+$nickBox.val()+'data[i] '+data[i]);
                 html += '<a href="#'+data[i]+'">'+data[i] +'</a>'+ '<br/>';
                 }

                 }
                 $users.html(html);
                 });
                 */

            },
            onShow: function () {
                console.log(this.user);
                var oldmsg;
                this.socket.emit('new user', this.user, function (data) {
                    if (data) {
                        $('#chat_container').show();
                        for (var i = 0; i < oldmsg.length; i++) {

                                displayMsg(oldmsg[i]);


                        }
                    } else {
                        alert('That username is already taken! Try again.');
                    }
                });
                this.socket.emit('new user', "notjohn", function (data) {
                    if (data) {
                        $('#chat_container').show();
                        for (var i = 0; i < oldmsg.length; i++) {
                                displayMsg(oldmsg[i]);


                        }
                    } else {
                        alert('That username is already taken! Try again.');
                    }
                });


                //receive the message in client side
                //get old msg
                this.socket.on('load old msgs', function (docs) {
                    for (var i = 0; i < docs.length; i++) {
                        //displayMsg(docs[i]);
                    }
                    oldmsg = docs;
                });
                //get new msg
                this.socket.on('new message', function (data) {
                    displayMsg(data);
                });

                function displayMsg(data) {
                    $('#chat').append('<span class="msg"><b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
                }

                //whisper msg
                this.socket.on('whisper', function (data) {
                    //console.log('Whisper');
                    $('#chat').append('<span class="whisper"> <b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
                });

            }
        });

        return ItemDetailView;
    });

