<!-- // const routes = require('./api/leccion.routes')
// const responses = require('../config/responses')
// const logger = require('../config/logger')
// const schema = require('./db/schema')
// const db = require('./db/database')({ schema, logger })
// const controller = require('./api/leccion.controller')({ responses, logger, db })
// module.exports = (app, io) => {
//   routes({ app, controller, logger })
// } -->


## Arquitectura


1. Se hara una copia o se 'cachearan' los datos a la base de datos que se este usando para el realtime y seran:
	* Leccion que se tomara
	* Preguntas del paralelo
	* Paralelo
	* Estudiantes de este paralelo
	* Profesor del paralelo
	* Peers del paralelo
	* Grupos del paralelo

La analogia de toda esta parte es un grupo de chat

Cada paralelo es un grupo de chat. En donde el moderador es el profesor que en este caso sera mas general y solo lo llamaremos moderador

Tenemos dos tipos de usuarios: Moderador y estudiante

__Moderador__

Realiza las acciones de la leccion, como son: comenzar-leccion, cancelar-leccion, terminar-leccion, aumentar-tiempo-leccion, pausar-leccion, continuar-leccion. Ademas que recibe las respuestas de los estudiantes

__Estudiante__

Las acciones son: enviar-respuesta

## Metodos

Socketio usa dos metodos, que son los on y los emit. Los __on__ solo escuchan lo que los clientes envien y los __emit__ que envian datos al cliente

## Metodos ON

#### comenzar-leccion

Inicia la leccion y comienza a enviar en tiempo a todos los estudiantes que esten en el paralelo

__recibe__

```json
 {
 	"leccionId"
 	"paraleloId"
 	"fechaInicioTomada" // string, en formato isoTime
 	"tiempoEstimado" // number, en segundos
 	"usuarioId"
 }
```

####  aumentar-tiempo-leccion

__recibe__

####  pausar-leccion

__recibe__

####  continuar-leccion

__recibe__

####  terminar-leccion

__recibe__

####  respuesta-estudiante

__recibe__

####  usuario

__recibe__

####  reconectar-estudiante

__recibe__

####  reconectar-profesor

__recibe__

__database__



## Metodos EMIT

Porque en parlelo y no en eleccion emit in(paraleloId)
* Posible: Si un estudiante desconoce su paralelo

#### tiempo-restante-leccion(emit in(paraleloId))

__envio__


#### terminada-leccion(emit in(paraleloId))

	terminado leccion = terminada-leccion
	
__envio__

#### empezar-leccion(emit in(paraleloId))

__envio__


#### estudiante-conectado(emit in(paraleloId))  leccion datos

__envio__

estados leccion
pendiente, sin-empezar, tomando, pausado, terminado, calificado

estados estudiante leccion
ingresando-codigo, esperando-empiece-leccion, dando-leccion


<!-- 

# que tanto heap usa
# cantidad de cpu que usar
# verificar si crea memory leaks
[] stress testing
[] perfomance testing
[] unit test
[] integration test

# Guardar en local los datos de profesor y estudiantes
progresive web apps

https://github.com/rajaraodv/redispubsub

https://github.com/shihern/airwaves-server/blob/master/sockets2/index.js
https://devpost.com/software/airwaves-clvb90


https://devpost.com/software/built-with/socket-io

# modulo timer development
# diagrama de flujo e interaccion de bases de datos

* timer que no se apage cuando el profesor se desconecta
* que peticiones get y post se haran a la api


* Redis (para manejo de lecccion)
* Mongodb(para guardar metadata lecciones)


* Diagramas de flujo leccions

* como se volcaran los datos a redis

* 

// // Count down from 10 seconds
// (function countDown (counter) {
//   console.log(counter);
//   if (counter > 0)
//     return setTimeout(countDown, 1000, counter - 1);

//   // Close the server
//   server.close(function () { console.log('Server closed!'); });
//   // Destroy all open sockets
//   for (var socketId in sockets) {
//     console.log('socket', socketId, 'destroyed');
//     sockets[socketId].destroy();
//   }
// })(10);
// server.close(callback);
// setImmediate(function(){server.emit('close')});
// io.sockets.emit('message', "casa")

// socket.once('close', function () {
// console.log('socket', socketId, 'closed')
// delete sockets[socketId]
// }) -->

<!-- 
 copiarLeccionDatos({ leccionId }) { // debe copiarse cuando se crea porque si el estudiante entra antes de que se tome la leccion, no se trackeara
      // tratara de organizar y de copiar los datos de alguna base de datos
    },
    // actualizar los grupos de la leccion o cualquier cosa antes
    // puede ser usada con un boton que diga actualizar, para que cuando el profesor mientras da una leccion
    // actualize los datos de grupos, estudiantes y todo eso
    actualizarLeccion({ leccionId }) {

    },
    estaLogeado({ usuarioId }) { // usado solo para las paginas ingresar-codigo(tomar-leccion), leccion-panel(profesor) y leccion(estudiante)
      // generar el token de sesion con jsonwebtoken de la leccion
    },
    // estudiantes
    verificarCodigo({ codigoLeccion, estudianteId }) { // verifica el codigo del estudiante /api/estudiantes/tomar_leccion/

    },
    obtenerDatosEstudianteIngresarCodigo({ estudianteId }) { // obtiene los datos al iniciar la pagina de ingresar-codigo(tomar-leccion) '/api/paralelos/estudiante/'+ usuario._id,
      // retornara los datos del estudiante si ha ingresado codigo junto con los datos del estado de la leccion 

    },
    obtenerDatosEstudianteLeccion({ paraleloId }) { // /api/estudiantes/leccion/datos_leccion

    },
    // profesores
    // copia los datos necesarios de la leccion en una tabla temporal exclusiva para lecciones realtime
    tomarLeccion({ leccionId }) {

    },
    // copia los datos de la leccion, cuando el profesor la guarda. 
    // TODO: si el profesor elimina la leccion que puede pasar?
    cacheLeccion({ leccionDatos }) {
      return new Promise(function(resolve, reject) {
        let leccion = new LeccionesRealtime(leccionDatos)
        leccion['codigo'] = random()
        leccion.crearLeccion().then(leccionCreda => {
          resolve(leccion['codigo'])
        }).catch(err => logger.error(err))
      })
    },
    obtenerDatosParaLeccionProfesor({ paraleloId }) { // /api/estudiantes/leccion/datos_leccion

    },
    // realtime
    pausarLeccion({ leccionId, paraleloId, usuarioId, usuarioDatos }) {

    },
    continuarLeccion({ leccionId, paraleloId, usuarioId, usuarioDatos }) {

    },
    aumentarTiempoLeccion({ leccionId, paraleloId, usuarioId, usuarioDatos }) {

    },
    terminarLeccion({ leccionId, paraleloId, usuarioId, usuarioDatos }) {
      return new Promise((resolve, reject) => {
       	if (process.env.NODE_ENV !== 'testing')
        	console.log('DB: terminar leccion')
       	resolve(true)	
       })
    },
    profesorSeConecto({ leccionId, usuarioId, dispositivo, socketId }) {

    },
    estudianteSeConecto({ leccionId, paraleloId, usuarioId, socketId, estado, dispositivo }) { 
    },
    obtenerRespuestas({ leccionId }) {

    },
    guardarRespuesta({ leccionId, respuesta }) {

    },
    // test
    obtenerLeccionPorCodigo({ codigo }) {
      return new Promise((resolve, reject) => {
        resolve(LeccionesRealtime.obtenerLeccionPorCodigo({ codigo }))
      })
    }


    
    // terminarLeccion() {
    //   LeccionModel.leccionTerminada(id_leccion, (err, res) => {
    //     if (err) return console.log(err);
    //     console.log('leccion terminado ' + id_leccion);
    //   })
    //   // cambia valor dandoLeccion en paralelo por false
    //   ParaleloModel.leccionTerminada(paralelo._id, (err, res) => {
    //     if (err) return console.log(err);
    //     console.log('leccion terminada ' + paralelo._id);
    //   })
    //   var promises = []
    //   // anade a cada estudiante la leccion y cambia el boolean dandoLeccion por false
    //   // TODO: anadir fecha empezado leccion
    //   paralelo.estudiantes.forEach(estudiante => {
    //     promises.push(new Promise((resolve, reject) => {
    //       EstudianteModel.leccionTerminada(estudiante._id, (err, e) => {
    //         if (err) return reject(err)
    //         return resolve(true)
    //       })
    //     }))
    //   })
    //   return Promise.all(promises).then(values => {
    //     for (var i = 0; i < values.length; i++) {
    //       if (values[i] != true){
    //         return false
    //       }
    //     }
    //     return true
    //     console.log('terminado leccion estudiantes');
    //   }, fail => {
    //    console.log(fail);
    //   })
    // },




      // grupos: [{ // sera actualizado al momento de colocar tomar-leccion
  //   _id: { type: String },
  //   nombre: { type: String },
  //   estudiantes: [{
  //     _id: { type: String },
  //     nombres: { type: String },
  //     apellidos: { type: String },
  //     matricula: { type: String },
  //     correo: { type: String }
  //   }]
  // }],
  // leccion: {
  //   _id: { type: String },
  //   creador: { 
  //     _id: { type: String },
  //     nombres: { type: String },
  //     apellidos: { type: String },
  //     correo: { type: String }
  //   },  // datos del profesor en texto plano
  //   nombre: { type: String },
  //   tiempoEstimado: { type: Number }, // en minutos
  //   tipo: { type: String }
  // },
  // preguntas: [{
  //   _id: { type: String },
  //   nombre: { type: String },
  //   tiempoEstimado: { type: Number },
  //   puntaje: { type: Number },
  //   descripcion: { type: String },
  //   subpreguntas: [{
  //     orden: { type: Number },
  //     puntaje: { type: String },
  //     contenido: { type: String }
  //   }],
  //   tipoPregunta: { type: String }
  // }],
  // estudiantes: [{ // sera actualizado al momento de colocar tomar-leccion
  //   _id: { type: String },
  //   nombres: { type: String },
  //   apellidos: { type: String },
  //   matricula: { type: String },
  //   correo: { type: String },
  //   conexiones: [{ fecha: Date }],
  //   desconexiones: [{ fecha: Date }]
  // }],

  // Datos para manejar la leccion
  // moderadoresConectados: [{
  //   _id: { type: String },
  //   nombres: { type: String },
  //   apellidos: { type: String },
  //   tipo: { type: String },
  //   nivelPeer: { type: Number },
  //   correo: { type: String }
  // }],

    respuestas: [{
    estudianteId: { type: String },
    estudianteNombre: { type: String },
    estudianteApellido: { type: String },
    grupoId: { type: String },
    grupoNombre: { type: String },
    leccion: { type: String },
    paralelo: { type: String },
    pregunta: { type: String },
    preguntaNombre: { type: String },
    descripcion: { type: String },
    subpreguntas: [{
      orden: { type: Number },
      puntaje: { type: String },
      contenido: { type: String },
      respuesta: { type: Number },
      imagen:  { type: Number }
    }],
    orden: { type: Number },
    respuesta: { type: String },
    imagenes: { type: String }
  }]

    // grupos: [
  //   {
  //     _id: grupos[0]['_id'],
  //     nombre: grupos[0]['nombre'],
  //     estudiantes: [
  //       estudiantes[0],
  //       estudiantes[1],
  //       estudiantes[2]
  //     ]
  //   },
  //   {
  //     _id: grupos[1]['_id'],
  //     nombre: grupos[1]['nombre'],
  //     estudiantes: [
  //       estudiantes[3],
  //       estudiantes[4],
  //       estudiantes[5]
  //     ]
  //   }
  // ],
  // leccion: {
  //   creador: profesores[0],
  //   nombre: lecciones[0]['nombre'],
  //   tiempoEstimado: lecciones[0]['tiempoEstimado'],
  //   tipo: lecciones[0]['tipo']
  // } -->