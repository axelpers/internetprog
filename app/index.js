var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var expressSession = require('express-session');
var sharedsession = require('express-socket.io-session');

var port = 8080;

var app = express();
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
var session = expressSession({
    secret: "MoveFromHereOrTheSecretWillBeOnGit",
    resave: true,
    saveUninitialized: true,
  });
app.use(session);

var httpServer = http.Server(app);
var io = require('socket.io').listen(httpServer);
io.use(sharedsession(session));

var router = require('./controller.js');
app.use('/API', router);

var socketController = require('./socketController.js');
io.on('connection', function (socket) {
  socketController(socket, io);
});


var model = require('./model.js');

model.checkDB();
model.createTables();


setTimeout(function(){
  model.fetchWatchlist('Axel');
},500);

setTimeout(function(){
  model.addToWatchlist('Axel', 'Kung Fu Panda');
},500);

setTimeout(function(){
  model.fetchWatchlist('Axel');
},5000);



httpServer.listen(port, function () {
  console.log("server listening on port", port);
});
