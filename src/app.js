const { PORT, SOCKET_PING_INTERVAL, SOCKET_PING_TIMEOUT, isDevelop, isTesting } = require('./config')

const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const http = require('http')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

const io = require('socket.io')(server, {'pingInterval': SOCKET_PING_INTERVAL, 'pingTimeout': SOCKET_PING_TIMEOUT })

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   next()
// })
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

if (isDevelop) {
  app.use(morgan('tiny'))
}

// api
const api = require('./api/routes.api')
app.use('/api/realtime', api)

// realtime
// { io, db, logger, timer }

if (!isTesting) {
  let logger = console
  let db = require('./config/db')
  let timer = require('./timer/timer.js')({ logger })
  require('./sockets/realtime')({ io, logger, db, timer })
}

module.exports = {
  app,
  server
}