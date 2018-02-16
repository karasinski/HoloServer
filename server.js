var mosca = require('mosca');

var backendSettings = {
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var moscaSettings = {
  port: 1883,
  backend: backendSettings
};

var server = new mosca.Server(moscaSettings);

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  // console.log('Published', packet.payload);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
}

var express = require("express");
var http = require("http");
var path = require("path");

var app = express()
var srv = http.createServer(app)
var broker = new mosca.Server(moscaSettings);
broker.attachHttpServer(srv);

app.use(express.static(path.dirname(require.resolve("mosca")) + "/public"))
app.use(express.static(path.dirname(require.resolve("jquery"))))
app.use(express.static(path.dirname(require.resolve("bootstrap")) + "/../"))

// Serve the dashboard at the root directory
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

srv.listen(3000)

