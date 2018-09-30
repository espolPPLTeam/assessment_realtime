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