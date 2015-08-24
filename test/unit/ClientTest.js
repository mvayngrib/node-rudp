
var expect = require('expect.js');
var dgram = require('dgram')
var Client = require('../../lib/Client');

describe('open/close', function () {
  it('closes successfully', function(done) {
    this.timeout(10000)
    var s1 = dgram.createSocket('udp4')
    var s2 = dgram.createSocket('udp4')
    s1.bind(function() {
      s2.bind(function() {
        var bill = new Client(s1, '127.0.0.1', s2.address().port)
        var ted = new Client(s2, '127.0.0.1', s1.address().port)
        ted.send(new Buffer('excellent!'))

        bill.on('data', function(data) {
          var timeoutId = setTimeout(function() {
            done(new Error('failed to close'))
          }, 5000)

          bill.close(function() {
            clearTimeout(timeoutId)
            done()
          })
        })
      })
    })
  })

  it('calls back on successful msg delivery', function(done) {
    this.timeout(10000)
    var s1 = dgram.createSocket('udp4')
    var s2 = dgram.createSocket('udp4')
    s1.bind(function() {
      s2.bind(function() {
        var bill
        var ted = new Client(s2, '127.0.0.1', s1.address().port)
        var received
        ted.send(new Buffer('excellent!'), function () {
          expect(received).to.eql(true)
          bill.close()
          ted.close()
          done()
        })

        setTimeout(function () {
          // wait to pick up
          bill = new Client(s1, '127.0.0.1', s2.address().port)
          bill.on('data', function(data) {
            received = true
          })
        }, 1000)
      })
    })
  })
})
