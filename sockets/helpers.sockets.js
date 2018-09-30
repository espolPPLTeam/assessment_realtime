process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})
expect = require('chai').expect
server = require('./socket.server.test').http
io = require('socket.io-client')
ioOptions = { transports: ['websocket'] , forceNew: true , reconnection: false } 