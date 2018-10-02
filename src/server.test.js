process.on('uncaughtException', function(err) {
  logger.error('Caught exception: ' + err)
  logger.error(err.stack)
})
const express = require('express')
const moment       = require('moment')
const co           = require('co')
const logger = require('../config/logger')
require("moment-duration-format")
require('moment-timezone')
const app = express()
const shortid = require('shortid')
const path = require('path')
const http = require('http').Server(app)
// const io = require('socket.io')(http)
const io = require('socket.io')(http, {'pingInterval': 60000, 'pingTimeout': 120000})
// io.set("log level", 0)

function dbMock() {
  var estudiantesConectados = []
  var profesoresConectados = []
  var respuestas = []
  const proto = {
    obtenerEstudiantesConectados({ leccionId, paraleloId }) {
      return estudiantesConectados.find(obj => (obj.leccionId == leccionId || obj.paraleloId == paraleloId))['estudiantes']
    },
    estudiantesConectados({ leccionId }) {
      return new Promise((resolve, reject) => {
        const index = estudiantesConectados.findIndex(obj => (obj.leccionId == leccionId))
        resolve(index != -1 ? estudiantesConectados[index]['estudiantes'] : [])
      })
    },
    profesorSeConecto({ leccionId, usuarioId, dispositivo, socketId }) { // llevar registro de conecciones en un array
      const index = profesoresConectados.findIndex(obj => obj.leccionId == leccionId)
      if (index == -1) {
        profesoresConectados.push({ leccionId, profesores: [{usuarioId, socketId, dispositivo }]})
      } else {
        profesoresConectados[index]['profesores'].push({suarioId, socketId, dispositivo })
      }
    },
    estudianteSeConecto({ leccionId, paraleloId, usuarioId, socketId, estado, dispositivo }) { 
      // con el paraleloId podria agregarlo a una lista de paralelos y anadirlo cada ves que el estudiante se conecte, 
      // es decir, habra un array de conexiones del estudiante
      // se debe buscar que leccion esta actualmente dando leccion el curso del estudiante
      let index
      if (leccionId) {
        index = estudiantesConectados.findIndex(obj => obj.paraleloId == paraleloId)
        if (index != -1)
          estudiantesConectados[index]['leccionId'] = leccionId
      } else {
        index = estudiantesConectados.findIndex(obj => obj.paraleloId == paraleloId)
      }
      if (index == -1) {
        estudiantesConectados.push({ leccionId, paraleloId, estudiantes: [{usuarioId, socketId, estado, dispositivo }]})
      } else {
        estudiantesConectados[index]['estudiantes'].push({paraleloId, usuarioId, socketId, estado, dispositivo })
      }
    },
    obtenerRespuestas({ leccionId }) {
      return new Promise((resolve, reject) => {
        const index = respuestas.findIndex(obj => obj.leccionId == leccionId)
        resolve(index != -1 ? respuestas[index]['respuestas'] : [])
      })
    },
    guardarRespuesta({ leccionId, respuesta }) {
      const index = respuestas.findIndex(obj => obj.leccionId == leccionId)
      index == -1 ? respuestas.push({ leccionId, respuestas: [respuesta]}) : respuestas[index]['respuestas'].push(respuesta)
    }
  }
  return Object.assign(Object.create(proto), {})
}

// socket.join(`${paraleloId}`)
// Socket.in(`${paraleloId}`).emit('terminada-leccion', true)
// Socket.in(`${paraleloId}`).emit('tiempo-restante-leccion', 0)
// Socket.in(`${paraleloId}`).emit('terminada-leccion', true)
// Socket.in(`${paraleloId}`).emit('tiempo-restante-leccion', 'Lección pausada')
// Socket.in(`${paraleloId}`).emit('terminada-leccion', true)
// Este debe ser exactamente igual al del timer OJO
function timerMock({ moment, logger }) {
  var intervals = []
  var timeouts = []
  const proto = {
    obtenerIntervals() {
      return intervals
    },
    obtenerTimeouts() {
      return timeouts
    },
    estaCorriendoLeccionInterval(leccionId) {
      return intervals.some(leccion => leccionId == leccion.leccionId)
    },
    estaCorriendoLeccionTimeout(leccionId) {
      return timeouts.some(leccion => leccionId == leccion.leccionId)
    },
    run({ accion, socket, Socket, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) {
      if (accion === 'comenzar') {
        Socket.in(`${paraleloId}`).emit('tiempo-restante-leccion', 49)
      }
    },
    terminar({ Socket,  leccionId: leccionId, paraleloId: paraleloId, usuarioId: usuarioId }) {
      Socket.in(`${paraleloId}`).emit('terminada-leccion', true)
      // Socket.in(`${paraleloId}`).emit('tiempo-restante-leccion', 0)
    },
    pausar({ Socket, leccionId, paraleloId, usuarioId }) {
      Socket.in(`${paraleloId}`).emit('tiempo-restante-leccion', 'Lección pausada')
    }
  }
  return Object.assign(Object.create(proto), {})
}

const db = dbMock({})
app.use('/', express.static(path.join(__dirname, '.')))
// const Timer = require('./timer')
const timer = timerMock({ moment, logger })// Timer({ moment, logger })

require('./realtime')({ io, co, shortid, db, logger, timer  })

module.exports = {
  http,
  db
}