const generarCodigo = () => {
  let text = ""
  const possible = "0123456789" //ABCDEFGHIJKLMNOPQRSTUVWXYZ
  for (let i =0; i < 7; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const responses = require('../../config/responses')
module.exports = ({ db }) => {
  const proto = {
    async Tomar ({ leccion, paralelo }) {
      try {
        if (!leccion.id) {
          return responses.NO_OK(['La leccion no tiene el id'])
        }
        let leccionEncontrada = await db.Lecciones.ObtenerPorId({ id: leccion.id })
        if (leccionEncontrada) {
          return responses.NO_OK(['La leccion ya existe'])
        }
        let codigo = generarCodigo()
        let leccionEnString = JSON.stringify(leccion)
        let leccionObj = new db.Lecciones({ id: leccion.id, leccion: leccionEnString, paralelo, codigo })
        let leccionCreada = await leccionObj.Crear()
        // let grupos = 
        return responses.OK({ 
          codigo: leccionCreada['codigo'],
          id: leccionCreada['_id']
        })
      } catch (err) {
        console.log(err)
        return responses.ERROR_SERVIDOR
      }
      return responses.OK({ datos: ['hello'] })
    },
    async Empezar ({ id }) {
      try {
        let fueEmpezada = await db.Lecciones.Empezo({ id })
        if (!fueEmpezada) {
          return responses.NO_OK(['Error al empezarla'])
        }
        return responses.OK('Leccion fue empezada')
      } catch (err) {
        console.log(err)
        return responses.ERROR_SERVIDOR
      }
    },
    async Pausar ({ id }) {
      try {
        let fuePausada = await db.Lecciones.CambiarEstado({ id, estado: 'pausado' })
        if (!fuePausada) {
          return responses.NO_OK(['Error al pausarla'])
        }
        return responses.OK('Leccion fue pausada')
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async Continuar ({ id }) {
      try {
        let fuePausada = await db.Lecciones.CambiarEstado({ id, estado: 'tomando' })
        if (!fuePausada) {
          return responses.NO_OK(['Error al continuarla'])
        }
        return responses.OK('Leccion fue continuada')
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async Terminar ({ id }) {
      try {
        let fuePausada = await db.Lecciones.CambiarEstado({ id, estado: 'terminado' })
        if (!fuePausada) {
          return responses.NO_OK(['Error al terminarla'])
        }
        return responses.OK('Leccion fue terminada')
      } catch (err) {
        return responses.ERROR_SERVIDOR
      }
    },
    async AumentarTiempo () {

    },
    // estudianteId es para ingresar que ya entro a la leccion
    async VerificarCodigoEstudiante ({ paraleloId, correo, codigo }) {
      // TODO: verificar si tiene grupo el estudiante y paralelo asignado
      // hacerlo en el front posiblemente

      // es imposible que si paraleloEstaDandoLeccion = false y yaIngresoCodigo = true
      let [ elCodigoEsValido, yaComenzoLeccion, paraleloEstaDandoLeccion ]= [ false, false, false ]
      let leccion = null
      // verificar si el paralelo esta dando leccion
      // es necesario que todas la lecciones del paralelo se terminen
      let paraleloExiste = await db.Lecciones.ObtenerPorParaleloIdYEstado({ id: paraleloId })

      if (paraleloExiste) {
        paraleloEstaDandoLeccion = paraleloExiste['estado'] !== 'terminado'
        leccion = JSON.parse(paraleloExiste['leccion'])
        yaComenzoLeccion = (paraleloExiste['estado'] !== 'terminado' && paraleloExiste['estado'] !== 'esperando')
        elCodigoEsValido = (paraleloExiste['codigo'] === codigo)
        let leccionId = paraleloExiste['id']
        let estudianteGuardado = await db.Estudiantes.ObtenerPorLeccionYParalelo({ leccionId, paraleloId })
        if (!estudianteGuardado) {
          let leccionId = paraleloExiste['id']
          let estudiante = new db.Estudiantes({ correo, paraleloId, leccionId, yaIngresoCodigoCorrecto: elCodigoEsValido })
          let estudianteCreado = await estudiante.Crear()
          
        } else if (elCodigoEsValido) {
          await db.Estudiantes.CodigoCorrecto({ leccionId, paraleloId })
        }
      }
      let mensaje = 'paralelo-no-esta-dando-leccion'
      if (!paraleloEstaDandoLeccion) {
        mensaje = 'paralelo-no-esta-dando-leccion'
      } else if (paraleloEstaDandoLeccion && yaComenzoLeccion && elCodigoEsValido) {
        mensaje = 'redirigirlo-directamente'
      } else if (elCodigoEsValido && paraleloEstaDandoLeccion) {
        mensaje = 'tiene-que-esperar-a-que-empiece-la-leccion'
      } else if (paraleloEstaDandoLeccion && yaComenzoLeccion) {
        mensaje = 'al-ingresar-el-codigo-redirigirlo-directamente'
      } else if (!elCodigoEsValido && paraleloExiste) {
        mensaje = 'tiene-que-ingresar-el-codigo'
      } else if (paraleloEstaDandoLeccion) {
        mensaje = 'tiene-que-ingresar-el-codigo'
      }

      return responses.OK({ mensaje, leccion })
    }
  }
  return Object.assign(Object.create(proto), {})
}

// // El objetivo de esto que sea totalmente independiente de el resto de la aplicacion
// // faltaria ver como se hara con lo de responder preguntas, si se lo deja como esta o se lo coloca aqui por ser parte de la leccion
// // Si la leccion esta pausada y si estaYaCorriendoTiempo, si LeccionYaComenzo, estadoLeccion('pendiente', 'tomando', 'terminado')
// // estados leccion
// // pendiente, sin-empezar, tomando, pausado, terminado, calificado

// // estados estudiante leccion
// // ingresando-codigo, esperando-empiece-leccion, dando-leccion
// const _ = require('lodash')
// module.exports = ({ schema, logger }) => {
//   let LeccionRealtime = schema.LeccionRealtime
//   const proto = {
//     VerificarCodigoEstudiante({ codigo, paraleloId }) {
//       // estados leccion 'sinEmpezar', 'tomando', 'pausado', 'terminado'
//       // estudiantesDandoLeccion 'ingresandoCodigo', 'esperandoEmpieceLeccion', 'dandoLeccion'

//       // si ingreso el codigo y no hay leccion en base de datos => noHayLeccionEnParalelo
//       // si leccion existe en base de datos y codigo mal ingresado => codigoIncorrecto
//       // si le codigo esta correcto y leccion sinEmpezar => esperandoEmpieceLeccion
//       // si el codigo esta correcto y leccion diferente de sinEmpezar => dandoLeccion
//       // {tieneGrupo: true, paraleloDandoLeccion: true, codigoLeccion: false, leccionYaComenzo: false}
//       return new Promise((resolve, reject) => {
//         Promise.all([
//           LeccionRealtime.ObtenerPorParaleloId({ paraleloId }),
//           LeccionRealtime.ObtenerPorCodigo({ codigo })
//         ])
//         .then((values) => {
//           let leccionTomada = values[0]
//           let codigoValido = values[0] && values[1]
          
//         })
//         .catch((err) => {
//           logger.error(err)
//           reject()
//         })
//       })
//     }
//   }
//   return Object.assign(Object.create(proto), {})
// }