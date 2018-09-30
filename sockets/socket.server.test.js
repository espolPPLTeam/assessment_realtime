process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})
const express = require('express')
const app = express()
const shortid = require('shortid')
const path = require('path')
const http = require('http').Server(app)

const io = require('socket.io')(http, {'pingInterval': 60000, 'pingTimeout': 120000, transport: ['websocket']})

// app.use('/', express.static(path.join(__dirname, '.')))

require('./realtime')({ io })

module.exports = {
  http
}