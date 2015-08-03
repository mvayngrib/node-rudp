var rudp = require('../../../');
var dgram = require('dgram');

var socket = dgram.createSocket('udp4');
socket.bind(12345)

var client = new rudp.Client(socket, '54.236.214.150', 12345);

process.stdin.resume();

process.stdin.on('data', function (data) {
  client.send(data);
});

client.on('data', function (data) {
  console.log(data.toString('utf8').trim());
});
