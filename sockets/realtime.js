// https://stackoverflow.com/questions/14626636/how-do-i-shutdown-a-node-js-https-server-immediately
// https://github.com/faisalman/ua-parser-js
// FIXME: no se limpia el bojeto io.sockets al momento que un usuario de desconecta
const shortid = require('shortid')
const co = require('co')

module.exports = function({ io, db, logger, timer }) {
  const Socket = io.of('/leccion')
  let sockets = [] // socket por paralelo [{ socketId, socket, usuarioId, paraleloId }] leccionId
  Socket.on('connection', function(socket) {
    const socketId = shortid.generate
    sockets.push({ socketId, socket })
  
    socket.on('comenzar-leccion', function({ leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) { // comenzar leccion
      // .emit('empezar-leccion'
      // .emit('tiempo-restante-leccion'
      timer.run({ accion: 'comenzar', socket, Socket, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId })
    })
    socket.on('terminar-leccion', function({ leccionId, paraleloId, usuarioId }) { // parar leccion
      // .emit('terminada-leccion'
      // TODO: limpiar todos los sockets del paralelo
      timer.terminar({ Socket,  leccionId: leccionId, paraleloId: paraleloId, usuarioId: usuarioId })
    })
    socket.on('aumentar-tiempo-leccion', function({ leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) { // aumentar tiempo
      timer.run({ accion: 'aumentarTiempo', socket, Socket, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId })
    })
    socket.on('pausar-leccion', function({ leccionId, paraleloId, usuarioId }) { // pausar leccion
      timer.pausar({ Socket, leccionId, paraleloId, usuarioId })
    })
    socket.on('continuar-leccion', function({ leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) { // continuar leccion
      timer.run({ accion: 'continuar', socket, Socket, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId })
    })
    socket.on('respuesta-estudiante', function({ leccionId, respuesta }) { // respuesta estudiante
      db.guardarRespuesta({ leccionId, respuesta })
      Socket.in(`${paraleloId}`).emit('respuesta-estudiante', respuesta) // respuesta para profesor
    })
    socket.on('usuario', function({ leccionId, paraleloId, usuarioId, tipoUsuario, estado, dispositivo, usuarioDatos }) { // usuario   // un usuario tiene tres estados ['ingresando-codigo, esperando-empiece-leccion, dando-leccion'] dispositivo
      const index = sockets.findIndex(obj => obj.socketId == socketId) // FIXME: esto puede dar error?
      sockets[index]['paraleloId'] = paraleloId
      sockets[index]['usuarioId'] = usuarioId
      socket.join(`${paraleloId}`)
      if (tipoUsuario === 'moderador') {
        co(function* (){
          const ESTUDIANTES = yield db.estudiantesConectados({ leccionId })
          db.profesorSeConecto({ leccionId, usuarioId, dispositivo, socketId })
          Socket.in(paraleloId).emit('estudiante-conectados', ESTUDIANTES)
        })
      } else if (tipoUsuario === 'estudiante') {
        Socket.in(`${paraleloId}`).emit('nuevo-estudiante-conectado', usuarioDatos) // leccion datos
        db.estudianteSeConecto({ leccionId, paraleloId, usuarioId, socketId, estado, dispositivo }) // la leccion id es null porque esto puede ser usado en la pagina tomar-leccion y ahi no se sabe la leccion que se esta tomando ahora
      }
    })
    socket.on('reconectar-estudiante', function({ leccionId, paraleloId, usuarioId, estado, dispositivo }) { // reconectar estudiante
      socket.join(`${paraleloId}`)
      logger.info(`reconectar-estudiante usuarioId: ${usuarioId}, leccionId: ${leccionId}, paraleloId: ${paraleloId}`)
      db.estudianteSeConecto({ leccionId, paraleloId, usuarioId, socketId, estado, dispositivo }) // solo necesito la leccionId para guardarlo
    })
    socket.on('reconectar-moderador', function({ estadoLeccion, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId }) { // reconectar profesor
      if (estadoLeccion === 'tomando') {
        timer.run({ accion: 'reconectar', socket, Socket, leccionId, paraleloId, fechaInicioTomada, tiempoEstimado, usuarioId })
        co(function* (){
          const ESTUDIANTES = yield db.estudiantesConectados({ leccionId })
          Socket.in(`${paraleloId}`).emit('estudiante-conectados', ESTUDIANTES)
        })
      } else if (estadoLeccion === 'pausado') { // porque solo debe enviar los que se conectaron mientras estuvo desconectado y no debe correr la leccion
        co(function* (){
          socket.join(`${paraleloId}`)
          const ESTUDIANTES = yield db.estudiantesConectados({ leccionId })
          db.profesorSeConecto({ leccionId, usuarioId, dispositivo, socketId })
          Socket.in(`${paraleloId}`).emit('estudiante-conectados', ESTUDIANTES)
          const RESPUESTAS = yield db.obtenerRespuestas({ leccionId })
          Socket.in(`${paraleloId}`).emit('respuestas-estudiantes', RESPUESTAS)
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