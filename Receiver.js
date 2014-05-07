var LinkedList = require('./LinkedList');
var constants = require('./constants');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

// TODO: have this be a DuplexStream instead of an EventEmitter.
// TODO: the Receiver should never send raw packets to the end host. It should
//     only be acknowledgement packets. Please see [1]

module.exports = Receiver;
function Receiver(packetSender) {
  this._synced = false;
  this._nextSequenceNumber = 0;
  this._packets = new LinkedList(function (packetA, packetB) {
    return packetA.getSequenceNumber() - packetB.getSequenceNumber();
  });
  this._packetSender = packetSender;
  this._closed = false;
}
util.inherits(Receiver, EventEmitter);

Receiver.prototype.receive = function (packet) {
  throw new Error('Not yet implemented');
  if (this._closed) {
    return;
  }
  // if (packet.synchronize) {
  //   this._synced = true;
  //   this._packets.clear();
  //   this._nextSequenceNumber = packet.sequenceNumber;
  //   return;
  // } else if (!this._synced) {
  //   return;
  // } else if (packet.getSequenceNumber() > this._packets.currentValue().getSequenceNumber() + constants.WINDOW_SIZE) {
  //   // This is to prevent stack overflows.

  //   return;
  // }
  // this._packets.insert(packet);
  // this._push();
};

Receiver.prototype.end = function () {
  this._closed = true;
  this.emit('end');
};

// Receiver.prototype._push = function () {
//   var packet = this._packets.nextValue();
//   var sequenceNumber = packet.getSequenceNumber()
//   if (sequenceNumber === this._nextSequenceNumber) {
//     this.trigger('data', packet.getPayload());
//     this._packets.seek();
//     this._nextSequenceNumber++;
//     // [1] There is a potential that the receiver can send raw packets by
//     // mistake. One way to avoid this is to have the constructor only accept
//     // a class that can only send acknowledgement packets.
//     this._packetSender.sendPacket(Packet.createAcknowledgementPacket(sequenceNumber));
//     this._push();
//   }
// };
