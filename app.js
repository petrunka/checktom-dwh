var express = require('express'),
    http = require('http'),
    https = require('https'),
    forceSSL = require('express-force-ssl'),
    tls= require('tls'),
    path = require('path'),
    fs = require('fs'),

    mongoose = require('mongoose'),
    passport = require('passport'),

// storing sessions in database with connect-mongo
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),

// all db models are in App/models folder
    models_path = __dirname + '/models',
    analytics_models_path = __dirname + '/public/modules/DataWareHouse/models',

// setting up config environments for development and production
    config = require('./config/config'),
    config = new config();

// Loading all models in dir '/models'
fs.readdirSync(models_path).forEach(function (file) {
    require(models_path + '/' + file)
});


fs.readdirSync(analytics_models_path).forEach(function (file){
    require(analytics_models_path + '/' + file)
});

var app = module.exports = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// for using partials layout
app.set('view options', {
    layout: false
});
app.use(express.favicon(path.join(__dirname, 'public/assets/img/favicon.ico'), { maxAge: 2592000000 }));

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('CT2013@Dev'));

// use express mongo session storage
app.use(express.session({
    secret: 'CT2013@Dev',
    store: new mongoStore({
        url: config.db,
        collection: 'sessions'
    })
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// set max age for images folder
app.use(express.static(path.join(__dirname, 'public/img'),{ maxAge: 31557600000 }));

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
console.log(process.env.NODE_ENV);

// Requiring all the routes in dir 'routes/'(Parameters: app, auth and passport modules)
var routes = require('./routes')(app, passport);
require('./config/passport')(passport, config);

app.use(app.router);

// Connecting to mongodb
mongoose.connect(config.db);

// Setting up error pages (https://github.com/visionmedia/express/tree/master/examples/error-pages)
app.use(function (req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});
app.use(function (err, req, res, next) {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.status(err.status || 500);
    res.render('500', { error: err });
});





//
var HttpsOptions = {
    key: fs.readFileSync('ssl/check-key.pem'),
    cert: fs.readFileSync('ssl/checktom-cert.pem'),
    ca: fs.readFileSync('ssl/check-csr.pem')
};
// Creating a server instance and listening to the port
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

/*
https.createServer(HttpsOptions,app).listen(443, function () {
    console.log('Express server listening on port ' + 443);
});*/


//     chat io       ---------------------------

var io = require('socket.io').listen(server),
    Chat = mongoose.model('chat');
    users = {};

io.sockets.on('connection', function (socket) {

    // chat find, messages from specific username
    // equal to articleAuthor or IsInterestedCheckboxName

    Chat.find({}, function (err, docs) {
        if (err) throw err;
        console.log('Sending old msg!');
        socket.emit('load old msgs', docs);
    });

    //limit the query: get last 8 conversation
    //var query = Chat.find({});
    //query.sort('-created').limit(8).exec(function(err,docs){});

    socket.on('new user', function (data, callback) {
        console.log(data);
        if (data in users) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNicknames();
        }
    });

    function updateNicknames() {
        io.sockets.emit('usernames', Object.keys(users));
    }

    //send message
    socket.on('send message', function (data, callback) {
        //remove the whitespace
        var msg = data.trim();
        console.log(msg);
        //console.log(msg);
        //if first three char is matched then whispering
        if (msg.substr(0, 1) === '#') {
            msg = msg.substr(1);
            //get the index of the space, after whisper name then space and then msg
            var ind = msg.indexOf(' ');
            if (ind !== -1) {
                var name = msg.substring(0, ind);
                var msg = msg.substring(ind + 1);
                console.log(name);
                console.log(users);
                console.log(name in users);

                    console.log("we got in");
                    var newMsg = new Chat({ msg: msg, to: name, nick: socket.nickname });

                    newMsg.save(function (err) {
                        if (err)
                            throw err;

                        //unicast the received msg to the receiver
                        users[name].emit('new message', { msg: msg, to: name, nick: socket.nickname });
                        //unicast the received msg to the sender to have his copy
                        users[socket.nickname].emit('new message', { msg: msg, to: name, nick: socket.nickname });

                        //broadcast the received msg to all including the sender
                        //io.sockets.emit('new message', { msg:msg, nick:socket.nickname });
                    });
                    //console.log('Whisper!');


            } else {
                callback('Error! Please enter a message for your Whisper.');
            }

        } else {
            callback('Error! Please select a user.');

        }

    });


    //Whenever a user disconnect from the server then this events emit
    socket.on('disconnect', function (data) {
        if (!socket.nickname) return;
        //remove that clinet from the object
        delete users[socket.nickname];
        updateNicknames();
    });
});






