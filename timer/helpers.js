process.on('uncaughtException', function(err) {
  logger.error('Caught exception: ' + err)
  logger.error(err.stack)
})

moment = require('moment')
assert = require('assert')
expect = require("chai").expect
lolex = require("lolex")
logger = require('../../config/logger')
EMIT = require('../labels').EMIT
LABELS = require('../labels')

require("moment-duration-format")
require('moment-timezone')
var lecciones = [] // [{ paraleloId, tiempo, empezo }]
socketMock = () => {
  const proto = {
   join(paraleloIdJoin) {
      lecciones.push({ paraleloId: paraleloIdJoin, tiempo: -1, empezo: false })
    }
  }
  return Object.assign(Object.create(proto), {})
}

SocketMock = () => {
  const proto = {
    obtenerEmpezarLeccion(paraleloId) {
      let leccion = lecciones.find(leccion => paraleloId == leccion.paraleloId)
      if (leccion != undefined)
        return  leccion.empezo
      return false
    },
    obtenerTerminadaLeccion(paraleloId) {
      let leccion = lecciones.find(leccion => paraleloId == leccion.paraleloId)
      if (leccion != undefined )
        return  false
      return true
    },
    obtenerTiempoRestante(paraleloId) {
      let leccion = lecciones.find(leccion => paraleloId == leccion.paraleloId)
      if (parseInt(leccion.tiempo)) {
        return parseInt(leccion.tiempo)
      } else {
        return LABELS.LECCION_PAUSADA
      }
      
    },
    in(paraleloId) {
      const protoIn = {
        emit(leccionLabel, respuesta) {
          if (leccionLabel == EMIT.TIEMPO_RESTANTE) {
            let index = lecciones.findIndex(obj => obj.paraleloId == paraleloId)
            if (index != -1)
              lecciones[index].tiempo = respuesta
          } else if (leccionLabel == EMIT.LECCION_TERMINADA) {
            lecciones = lecciones.filter(leccion => paraleloId != leccion.paraleloId)
          } else if (leccionLabel == EMIT.EMPEZAR_LECCION) {
            let index = lecciones.findIndex(obj => obj.paraleloId == paraleloId)
            lecciones[index].empezo = true
          }
        }
      }
      return Object.assign(Object.create(protoIn), {})
    }
  }
  return Object.assign(Object.create(proto), {})
}

function dbMock() {
  const proto = {
    terminarLeccion() {

    },
    terminarLeccionPromise() {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'testing')
          console.log('DB: terminar leccion')
        resolve(true)
      })
    }
  }
  return Object.assign(Object.create(proto), {})
}

db = dbMock({})