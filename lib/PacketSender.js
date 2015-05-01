
var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits

module.exports = PacketSender;

function PacketSender(socket, address, port) {
  var self = this

  if (!socket || !address || !port) {
    throw new Error('Expecting a socket, address, and a port.');
  }
  this._socket = socket;
  this._address = address;
  this._port = port;

  socket.once('close', function() {
    self._closed = true
    self.emit('close')
  })
};

inherits(PacketSender, EventEmitter)

PacketSender.prototype.send = function (packet) {
  if (this._closed) throw new Error('can\'t send once closed')

  var buffer = packet.toBuffer();
  this._socket.send(buffer, 0, buffer.length, this._port, this._address);
};
