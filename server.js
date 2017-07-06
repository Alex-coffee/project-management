var DEFAULT_PORT = 8001;
var express  = require('express');
var app      = express();                               // create our app w/ express
                    // mongoose for mongodb

var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================
app.use(express.static(__dirname + '/src'));                 // set the static files location /public/img will be /img for users
// app.use("/resources", express.static(__dirname + '/resources'));
// app.use("/modules", express.static(__dirname + '/node_modules'));
// app.use("/components", express.static(__dirname + '/bower_components'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json({ limit: '40mb' }))
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(methodOverride());
app.use(bodyParser.json());                                     // parse application/json
// routes ==================================================
//require('./config/uploader')(app);

// var ws = require('./api/websockets');
require('./src/api/local-api')(app); // pass our application into our routes

var server = app.listen(DEFAULT_PORT, function(){
    console.log("App listening on port " + DEFAULT_PORT);
});
server.timeout = 600000;

exports = module.exports = app;