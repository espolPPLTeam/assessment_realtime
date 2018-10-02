var socket = io('http://localhost:8011/leccion', {
    reconnect: true
})

socket.on('connect', function() {
  console.log('Socket conectado')
  socket.emit('USUARIO', { paraleloId: 'aaaa', usuarioDatos: 'joell'})
})


socket.on('TERMINADA', function () {
  console.log('leccion terminada y se derigira al estudiante')
})
// function comenzar () {
//   socket.emit('COMENZAR_LECCION', { leccionId: 'abcd', paraleloId: 'aaaa', fechaInicioTomada: '2018-10-02T15:44:28.166Z', tiempoEstimado: 50000000, usuarioId: 5 })
// }

// function terminar () {
//   socket.emit('TERMINAR_LECCION', { leccionId: 'abcd', paraleloId: 'aaaa', usuarioId: 5 })
// }

socket.on('TIEMPO_RESTANTE', function(tiempo) {
  console.log(tiempo)
})

// usado en ingresar codigo, para determinar la redireccion
socket.on('EMPEZAR_LECCION', function(ESTUDIANTES) {
  console.log('Ya empezo la leccion')
})