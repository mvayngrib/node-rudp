var Receiver = require('./Receiver');
var Sender = require('./Sender');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var PacketSender = require('./PacketSender');
var Packet = require('./Packet');
var Connection = require('./Connection');
var CLOSE_TIMEOUT = 3000;
var noop = function() {}

module.exports = Client;
function Client(socket, address, port) {
  var self = this;

  this._packetSender = new PacketSender(socket, address, port);
  this._connection = new Connection(this._packetSender);

  this._connection.on('data', function (data) {
    self.emit('data', data);
  });

  socket.on('message', onmessage);
  socket.once('close', onclose)
  this.once('close', function() {
    self._closed = true
    socket.removeListener('message', onmessage)
  })

  function onmessage(message, rinfo) {
    if (rinfo.address !== address || rinfo.port !== port) {
      return;
    }
    var packet = new Packet(message);
    if (packet.getIsFinish()) {
      onclose()
      return;
    }
    self._connection.receive(packet);
  }

  function onclose() {
    if (!self._closed) self.emit('close')
  }
};

util.inherits(Client, EventEmitter);

Client.prototype.send = function (data, callback) {
  if (this._closed) throw new Error('client is closed')

  this._connection.send(data, callback);
};

Client.prototype.close = function (cb) {
  var self = this
  cb = cb || noop
  if (this._closed) return process.nextTick(cb)

  this._packetSender.send(Packet.createFinishPacket());
  var closeTimeout = setTimeout(function() {
    console.warn('forcing rudp.Client close')
    self.emit('close')
  }, CLOSE_TIMEOUT)

  this.once('close', function() {
    clearTimeout(closeTimeout)
    cb()
  })
};
