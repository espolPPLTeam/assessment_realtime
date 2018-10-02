var socket = io('http://localhost:8011/leccion', {
    reconnect: true
})

socket.on('connect', function() {
  socket.emit('USUARIO', { leccionId: 'abdccss', paraleloId: 'aaaa', usuarioId: 5, tipoUsuario: 'moderador', estado: 'tomando', dispositivo: '', usuarioDatos: 'joell' })
})


let fecha = new Date()
console.log(fecha.toISOString())

function comenzar () {
  fetch(` http:localhost:8011/api/realtime/leccion/abdccss/empezar`, {
      method: "POST",
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      })
  })
  .then(function(res){
    return res.json()
  })
  .then(function(data){
    if (data.estado) {
      socket.emit('COMENZAR_LECCION', { leccionId: 'abdccss', paraleloId: 'aaaa', fechaInicioTomada: fecha.toISOString(), tiempoEstimado: 150, usuarioId: 5 })
      let area = document.getElementById('leccion')
      area.value = JSON.stringify( data )
    } else {
      console.error('Error al empezarla')
    }
  })
}

function terminar () {
  fetch(` http:localhost:8011/api/realtime/leccion/abdccss/terminar`, {
      method: "POST",
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      })
  })
  .then(function(res){
    return res.json()
  })
  .then(function(data){
    if (data.estado) {
      socket.emit('TERMINAR_LECCION', { leccionId: 'abdccss', paraleloId: 'aaaa', usuarioId: 5 })
      let area = document.getElementById('leccion')
      area.value = JSON.stringify( data )
    } else {
      console.error('Error al empezarla')
    }
  })
}

function tomar () {
  let paralelo = {
    _id: 'abcdff',
    nombre: '1',
    anio: '2018',
    termino: '1',
    estudiantes: [],
    grupos: [],
    materia: 'asdsde'
  }

  let leccion = {
    id: 'abdccss',
    nombre: 'Mi primera leccion',
    secciones: [
    ],
    grupos: [
    ]
  }

  let send = { leccion, paralelo }
  console.log(send)
  var data = new FormData()
  data.append( "json", JSON.stringify( send ) )
  fetch(` http:localhost:8011/api/realtime/lecciones/tomar`, {
      method: "POST",
      body: JSON.stringify(send),
      mode: 'cors',
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      })
  })
  .then(function(res){
    return res.json() 
  })
  .then(function(data){
    let area = document.getElementById('leccion')
    area.value = JSON.stringify( data )
  })
}

socket.on('TIEMPO_RESTANTE', function(tiempo) {
  console.log(tiempo)
})

socket.on('ESTUDIANTES_CONECTADOS', function(ESTUDIANTES) {
  console.log(ESTUDIANTES)
})