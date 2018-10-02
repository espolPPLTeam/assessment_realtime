const timer = require('./timer')

global.lecciones = [] // [{ paraleloId, tiempo, empezo }]

socketMock = () => {
  const proto = {
   join(paraleloIdJoin) {
      global.lecciones.push({ paraleloId: paraleloIdJoin, tiempo: -1, empezo: false })

    }
  }
  return Object.assign(Object.create(proto), {})
}

SocketMock = () => {
  const proto = {
    obtenerEmpezarLeccion (paraleloId) {
      let leccion = global.lecciones.find(leccion => paraleloId == leccion.paraleloId)
      if (leccion != undefined)
        return  leccion.empezo
      return false
    },
    obtenerTerminadaLeccion (paraleloId) {
      let leccion = lecciones.find(leccion => paraleloId == leccion.paraleloId)
      if (leccion != undefined )
        return  false
      return true
    },
    obtenerTiempoRestante (paraleloId) {
      let leccion = global.lecciones.find(leccion => paraleloId == leccion.paraleloId)
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


describe('Timer test', function() {
  beforeEach(function () {
    Timer = timer({ moment, logger })
    clock = lolex.install()
    socket = socketMock()
    Socket = SocketMock()
    fechaInicioTomada = moment().toISOString()
    paraleloId = 5
    leccionId = 1
    usuarioId = 2
  })
  afterEach(function () {
    clock.uninstall()
  })

  it('@t1 terminar y por tiempo acabado', function() {
    expect(Socket.obtenerEmpezarLeccion(paraleloId)).to.equal(false)
    Timer.run({ 
      accion: 'comenzar',
      socket, 
      Socket, 
      leccionId, 
      paraleloId, 
      fechaInicioTomada, 
      tiempoEstimado: 20, 
      usuarioId 
    })
    clock.tick(5000) // leccion tomandose
    expect(Socket.obtenerTiempoRestante(paraleloId)).to.equal(15)
    // expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(false)
    // expect(Socket.obtenerEmpezarLeccion(paraleloId)).to.equal(true)
    // expect(Timer.obtenerIntervals().length).to.equal(1)
    // clock.tick(15000)
    // expect(Timer.obtenerIntervals().length).to.equal(0)
    // expect(Timer.obtenerTimeouts().length).to.equal(1)
    // expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(true)
    // clock.tick(25000) // leccion termino
    // expect(Timer.obtenerTimeouts().length).to.equal(0)
    // expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(true)
  })

  it('@t2 terminar por moderador', function () {
    Timer.run({ 
      accion: 'comenzar', 
      socket, 
      Socket, 
      leccionId, 
      paraleloId, 
      fechaInicioTomada, 
      tiempoEstimado: 20, 
      usuarioId
    })
    clock.tick(5000)
    expect(Socket.obtenerTiempoRestante(paraleloId)).to.equal(15)
    expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(false)
    expect(Socket.obtenerEmpezarLeccion(paraleloId)).to.equal(true)
    expect(Timer.obtenerTimeouts().length).to.equal(1)
    Timer.terminar({ Socket,  leccionId: 1, paraleloId: 5, usuarioId: 2 })
    expect(Timer.obtenerTimeouts().length).to.equal(0)
    expect(Timer.obtenerIntervals().length).to.equal(0)
    expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(true)
  })

  it('@t3 aumentar y terminadaLeccion', function () {
    Timer.run({ 
      accion: 'comenzar', 
      socket, 
      Socket, 
      leccionId, 
      paraleloId, 
      fechaInicioTomada, 
      tiempoEstimado: 20, 
      usuarioId 
    })
    clock.tick(5000)
    expect(Socket.obtenerTiempoRestante(paraleloId)).to.equal(15)
    expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(false)
    expect(Socket.obtenerEmpezarLeccion(paraleloId)).to.equal(true)
    expect(Timer.obtenerIntervals().length).to.equal(1)
    let tiempoRestante = Socket.obtenerTiempoRestante(paraleloId)
    let tiempoAumentado = 35
    Timer.run({ 
      accion: 'aumentarTiempo', 
      socket, 
      Socket, 
      leccionId, 
      paraleloId, 
      fechaInicioTomada, 
      tiempoEstimado: tiempoRestante + tiempoAumentado,
      usuarioId
    })
    clock.tick(5000)
    expect(Socket.obtenerTiempoRestante(paraleloId)).to.equal(40)
    Timer.terminar({ 
      Socket, 
      leccionId, 
      paraleloId, 
      usuarioId 
    })
    expect(Timer.obtenerTimeouts().length).to.equal(0)
    expect(Timer.obtenerIntervals().length).to.equal(0)
    expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(true)
  })

  it('@t4 aumentar y terminado por que el profesor se olvida de darle terminar', function () {
    Timer.run({ 
      accion: 'comenzar', 
      socket, 
      Socket, 
      leccionId, 
      paraleloId, 
      fechaInicioTomada, 
      tiempoEstimado: 20, 
      usuarioId 
    })
    clock.tick(5000)
    expect(Socket.obtenerTiempoRestante(paraleloId)).to.equal(15)
    expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(false)
    expect(Socket.obtenerEmpezarLeccion(paraleloId)).to.equal(true)
    expect(Timer.obtenerIntervals().length).to.equal(1)
    let tiempoRestante = Socket.obtenerTiempoRestante(paraleloId)
    let tiempoAumentado = 35
    Timer.run({ 
      accion: 'aumentarTiempo', 
      socket, 
      Socket, 
      leccionId, 
      paraleloId, 
      fechaInicioTomada, 
      tiempoEstimado: tiempoRestante + tiempoAumentado, 
      usuarioId 
    })
    clock.tick(5000)
    expect(Socket.obtenerTiempoRestante(paraleloId)).to.equal(40)
    expect(Timer.obtenerTimeouts().length).to.equal(1)
    clock.tick(40000)
    expect(Timer.obtenerIntervals().length).to.equal(0)
    expect(Timer.obtenerTimeouts().length).to.equal(1)
    expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(true)
    clock.tick(25000)
    expect(Timer.obtenerTimeouts().length).to.equal(0)
    expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(true)
  })

  it('@t5 pausar, continuar, terminar por moderador', function () {
    Timer.run({ 
      accion: 'comenzar', 
      socket, 
      Socket, 
      leccionId, 
      paraleloId, 
      fechaInicioTomada, 
      tiempoEstimado: 20, 
      usuarioId 
    })
    clock.tick(5000)
    expect(Socket.obtenerTiempoRestante(paraleloId)).to.equal(15)
    expect(Timer.obtenerTimeouts().length).to.equal(1)
    let tiempoRestante = Socket.obtenerTiempoRestante(paraleloId)
    let fechaPausaInicio = moment()
    Timer.pausar({ 
      Socket, 
      leccionId, 
      paraleloId, 
      usuarioId
    })
    expect(Timer.obtenerTimeouts().length).to.equal(0)
    expect(Timer.obtenerIntervals().length).to.equal(0)
    expect(Socket.obtenerTiempoRestante(paraleloId)).to.equal(LABELS.LECCION_PAUSADA)
    clock.tick(20000)
    let fechaPausaTerminada = moment()
    let tiempoPausado = fechaPausaTerminada.diff(moment(fechaPausaInicio))/1000
    Timer.run({ 
      accion: 'continuar', 
      socket, Socket, 
      leccionId, 
      paraleloId, 
      fechaInicioTomada: fechaPausaInicio, 
      tiempoEstimado: tiempoRestante + tiempoPausado,
      usuarioId 
    })
    clock.tick(1000)
    expect(Timer.obtenerTimeouts().length).to.equal(1)
    expect(Timer.obtenerIntervals().length).to.equal(1)
    expect(Socket.obtenerTiempoRestante(paraleloId)).to.equal(14)
    clock.tick(14000)
    expect(Timer.obtenerIntervals().length).to.equal(0)
    expect(Timer.obtenerTimeouts().length).to.equal(1)
    expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(true)
    clock.tick(25000)
    expect(Timer.obtenerTimeouts().length).to.equal(0)
    expect(Socket.obtenerTerminadaLeccion(paraleloId)).to.equal(true)
  })

  it('@t6 dos lecciones al mismo tiempo', function() {
    let fechaInicioTomadaUno = moment().toISOString()
    let paraleloId_1 = 1
    let paraleloId_2 = 2

    Timer.run({ accion: 'comenzar', 
      socket, Socket, leccionId: 1, 
      paraleloId: paraleloId_1, 
      fechaInicioTomada: fechaInicioTomadaUno, 
      tiempoEstimado: 20, 
      usuarioId: 1 
    })

    clock.tick(5000)
    assert.equal(Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')

    let fechaInicioTomadaDos = moment().toISOString()
    Timer.run({ 
      accion: 'comenzar', 
      socket, 
      Socket, 
      leccionId: 2, 
      paraleloId: paraleloId_2, 
      fechaInicioTomada: fechaInicioTomadaDos, 
      tiempoEstimado: 30, 
      usuarioId: 2 
    })

    expect(Timer.obtenerIntervals().length).to.equal(2)
    expect(Timer.obtenerTimeouts().length).to.equal(2)
    expect(Socket.obtenerTiempoRestante(paraleloId_1)).to.equal(15)

    clock.tick(1000)
    expect(Socket.obtenerTiempoRestante(paraleloId_2)).to.equal(29)

    clock.tick(10000)
    expect(Socket.obtenerTiempoRestante(paraleloId_1)).to.equal(4)
    expect(Socket.obtenerTiempoRestante(paraleloId_2)).to.equal(19)
    expect(Timer.estaCorriendoLeccionInterval(paraleloId_1)).to.equal(true)
    expect(Timer.estaCorriendoLeccionTimeout(paraleloId_1)).to.equal(true)
    expect(Timer.estaCorriendoLeccionInterval(paraleloId_2)).to.equal(true)
    expect(Timer.estaCorriendoLeccionTimeout(paraleloId_2)).to.equal(true)
    expect(Timer.obtenerIntervals().length).to.equal(2)
    expect(Timer.obtenerTimeouts().length).to.equal(2)    
    
    clock.tick(4000)
    expect(Socket.obtenerTiempoRestante(paraleloId_2)).to.equal(15)    
    expect(Timer.estaCorriendoLeccionInterval(paraleloId_1)).to.equal(false)    
    expect(Timer.estaCorriendoLeccionTimeout(paraleloId_1)).to.equal(true)    
    expect(Timer.obtenerTimeouts().length).to.equal(2)
    
    clock.tick(5000)
    expect(Socket.obtenerTiempoRestante(paraleloId_2)).to.equal(10)
    expect(Timer.obtenerTimeouts().length).to.equal(1)
    expect(Socket.obtenerTerminadaLeccion(paraleloId_1)).to.equal(true)
    expect(Socket.obtenerTerminadaLeccion(paraleloId_2)).to.equal(false)
    
    clock.tick(10000)
    expect(Timer.estaCorriendoLeccionInterval(2)).to.equal(false)
    expect(Timer.estaCorriendoLeccionTimeout(2)).to.equal(true)
    
    clock.tick(5000)
    expect(Timer.obtenerTimeouts().length).to.equal(0)
    expect(Timer.obtenerTimeouts().length).to.equal(0)
  })
})