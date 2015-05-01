
var dgram = require('dgram')
var Client = require('../../lib/Client');

describe('open/close', function () {
  it('closes successfully', function(done) {
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
          }, 2000)

          bill.close(function() {
            clearTimeout(timeoutId)
            done()
          })
        })
      })
    })
  })
})

