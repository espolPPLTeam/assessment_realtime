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

function ingresar () {
  let paraleloId = 'abcdff'
  let estudianteId = 'eeee'
  let codigo = document.getElementById('codigo').value

  /*
    Esta api se llamara dos veces, 
    
    1. una cuando ingresa a la pagina verificar codigo. De aqui depedendiendo de la respuesta quedara para que ingrese el codigo, esperando a que empiece la leccion o se lo redireccionara a la leccion

    2. En la segunda vez se la llamara si es necesario cuando ingresa el codigo


    Esta parte es media rara.
    1. Codigo, siempre el codigo es enviado asi sea un string no valido
      Enviado: para verificar el codigo
      No enviado: para determinar en que estado esta el estudiante
  */

  fetch(`http:localhost:8011/api/realtime/estudiante/verificarCodigo/${paraleloId}/${estudianteId}/${codigo}`, {
      method: "GET",
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
    console.log(data)
    // if (data.estado) {
    //   // socket.emit('COMENZAR_LECCION', { leccionId: 'abdccss', paraleloId: 'aaaa', fechaInicioTomada: fecha.toISOString(), tiempoEstimado: 150, usuarioId: 5 })
    //   // let area = document.getElementById('leccion')
    //   // area.value = JSON.stringify( data )
    // } else {
    //   console.error('Error al empezarla')
    // }
  })
}