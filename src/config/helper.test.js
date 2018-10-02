app = require('../app').app
request = require('supertest')
sinon = require('sinon')
expect = require('chai').expect
assert = require('assert')
moment = require('moment')
require("moment-duration-format")
require('moment-timezone')
lolex = require('lolex')
EMIT = require('./labels').EMIT
LABELS = require('./labels')

dump = require('./db/dump')
URL_DB = require('./index').urlDB()
mongo = require('./db')
respuestas = require('./responses')
modelos = require('./db').modelos()
logger = console
// function dbMock() {
//   const proto = {
//     terminarLeccion() {

//     },
//     terminarLeccionPromise() {
//       return new Promise((resolve, reject) => {
//         if (process.env.NODE_ENV !== 'testing')
//           console.log('DB: terminar leccion')
//         resolve(true)
//       })
//     }
//   }
//   return Object.assign(Object.create(proto), {})
// }

// db = dbMock({})
