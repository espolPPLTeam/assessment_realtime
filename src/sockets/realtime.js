// https://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately
// https://github.com/faisalman/ua-parser-js
// FIXME: no se limpia el bojeto io.sockets al momento que un usuario de desconecta
const shortid = require('shortid')
const co = require('co')
const labels = require('../config/labels')

module.exports = function({ io, db, logger, timer }) {
  const Socket = io.of('/leccion')
  let sockets = [] // socket por paralelo [{ socketId, socket, usuarioId, paraleloId }] leccionId
  Socket.on('connection', function(socket) {
    const socketId = shortid.generate
    sockets.push({ socketId, socket })
  
    socket.on(labels.COMENZAR, function({ leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) { // comenzar leccion
      // .emit('empezar-leccion'
      // .emit('tiempo-restante-leccion'
      timer.run({ accion: 'comenzar', socket, Socket, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId })
    })
    socket.on(labels.TERMINAR, function({ leccionId, paraleloId, usuarioId }) { // parar leccion
      // .emit('terminada-leccion'
      // TODO: limpiar todos los sockets del paralelo
      console.log('terminae')
      timer.terminar({ Socket, leccionId: leccionId, paraleloId: paraleloId, usuarioId: usuarioId })
    })
    socket.on(labels.AUMENTAR_TIEMPO, function({ leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) { // aumentar tiempo
      timer.run({ accion: 'aumentarTiempo', socket, Socket, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId })
    })
    socket.on(labels.PAUSAR, function({ leccionId, paraleloId, usuarioId }) { // pausar leccion
      timer.pausar({ Socket, leccionId, paraleloId, usuarioId })
    })
    socket.on(labels.CONTINUAR, function({ leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) { // continuar leccion
      timer.run({ accion: 'continuar', socket, Socket, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId })
    })
    socket.on(labels.RESPUESTA_ESTUDIANTE, function({ leccionId, respuesta }) { // respuesta estudiante
      db.guardarRespuesta({ leccionId, respuesta })
      Socket.in(`${paraleloId}`).emit(labels.RESPUESTA_ESTUDIANTE, respuesta) // respuesta para profesor
    })
    socket.on(labels.USUARIO, function({ leccionId, paraleloId, usuarioId, tipoUsuario, estado, dispositivo, usuarioDatos }) { // usuario   // un usuario tiene tres estados ['ingresando-codigo, esperando-empiece-leccion, dando-leccion'] dispositivo
      const index = sockets.findIndex(obj => obj.socketId == socketId) // FIXME: esto puede dar error?
      sockets[index]['paraleloId'] = paraleloId
      sockets[index]['usuarioId'] = usuarioId
      socket.join(`${paraleloId}`)
      if (tipoUsuario === 'moderador') {
        co(function* (){
          const ESTUDIANTES = [{ 
              nombres: 'Joel',
              apellidos: 'Rodriguez'
            },{
              nombres: 'Edison',
              apellidos: 'Mora'
            }
          ]
          // const ESTUDIANTES = yield db.estudiantesConectados({ leccionId })
          // db.profesorSeConecto({ leccionId, usuarioId, dispositivo, socketId })
          Socket.in(paraleloId).emit(labels.ESTUDIANTES_CONECTADOS, ESTUDIANTES)
        })
      } else if (tipoUsuario === 'estudiante') {
        Socket.in(`${paraleloId}`).emit(labels.NUEVO_ESTUDIANTE, usuarioDatos) // leccion datos
        // db.estudianteSeConecto({ leccionId, paraleloId, usuarioId, socketId, estado, dispositivo }) // la leccion id es null porque esto puede ser usado en la pagina tomar-leccion y ahi no se sabe la leccion que se esta tomando ahora
      }
    })
    socket.on(labels.RECONECTAR_ESTUDIANTE, function({ leccionId, paraleloId, usuarioId, estado, dispositivo }) { // reconectar estudiante
      socket.join(`${paraleloId}`)
      logger.info(`reconectar-estudiante usuarioId: ${usuarioId}, leccionId: ${leccionId}, paraleloId: ${paraleloId}`)
      db.estudianteSeConecto({ leccionId, paraleloId, usuarioId, socketId, estado, dispositivo }) // solo necesito la leccionId para guardarlo
    })
    socket.on(labels.RECONECTAR_MODERADOR, function({ estadoLeccion, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) { // reconectar profesor
      if (estadoLeccion === 'tomando') {
        timer.run({ accion: 'reconectar', socket, Socket, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId })
        co(function* (){
          const ESTUDIANTES = yield db.estudiantesConectados({ leccionId })
          Socket.in(`${paraleloId}`).emit(labels.ESTUDIANTES_CONECTADOS, ESTUDIANTES)
        })
      } else if (estadoLeccion === 'pausado') { // porque solo debe enviar los que se conectaron mientras estuvo desconectado y no debe correr la leccion
        co(function* (){
          socket.join(`${paraleloId}`)
          const ESTUDIANTES = yield db.estudiantesConectados({ leccionId })
          db.profesorSeConecto({ leccionId, usuarioId, dispositivo, socketId })
          Socket.in(`${paraleloId}`).emit(labels.ESTUDIANTES_CONECTADOS, ESTUDIANTES)
          const RESPUESTAS = yield db.obtenerRespuestas({ leccionId })
          Socket.in(`${paraleloId}`).emit(labels.ESTUDIANTES_CONECTADOS, RESPUESTAS)
        })
      }
    })
    socket.on('disconnect', function() {
      const CANTIDAD_CONECTADOS = Object.keys(io.sockets.connected).length
      logger.info(`cantidad-usuarios-conectados ${CANTIDAD_CONECTADOS}`)
      let socketDesconectado = sockets.find(socketObjeto => socketId == socketObjeto.socketId)
      sockets = sockets.filter(socketObjeto => socketId != socketObjeto.socketId)
      if (socketDesconectado) {
        // let socketIdReal = socketDesconectado['socket']['id'].split('#')[1]
        delete socketDesconectado['socket'] // .destroy() .close() .disconnect(0) .close()
        delete socketDesconectado
      }
    })
  })
}