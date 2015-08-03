var rudp = require('rudp');
var dgram = require('dgram');

var billSocket = dgram.createSocket('udp4');
var tedSocket = dgram.createSocket('udp4');
billSocket.bind(function() {
  tedSocket.bind(function() {
    var billClient = new rudp.Client(billSocket, '127.0.0.1', tedSocket.address().port);
    var tedClient = new rudp.Client(tedSocket, '127.0.0.1', billSocket.address().port);
    tedClient.on('data', function(data) {
      billClient.close()
      tedClient.close()
    })

    billClient.send(new Buffer('excellent!'))
  })
})
