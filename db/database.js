// El objetivo de esto que sea totalmente independiente de el resto de la aplicacion
// faltaria ver como se hara con lo de responder preguntas, si se lo deja como esta o se lo coloca aqui por ser parte de la leccion
// Si la leccion esta pausada y si estaYaCorriendoTiempo, si LeccionYaComenzo, estadoLeccion('pendiente', 'tomando', 'terminado')
// estados leccion
// pendiente, sin-empezar, tomando, pausado, terminado, calificado

// estados estudiante leccion
// ingresando-codigo, esperando-empiece-leccion, dando-leccion
const _ = require('lodash')
module.exports = ({ schema, logger }) => {
  let LeccionRealtime = schema.LeccionRealtime
  const proto = {
    VerificarCodigoEstudiante({ codigo, paraleloId }) {
      // estados leccion 'sinEmpezar', 'tomando', 'pausado', 'terminado'
      // estudiantesDandoLeccion 'ingresandoCodigo', 'esperandoEmpieceLeccion', 'dandoLeccion'

      // si ingreso el codigo y no hay leccion en base de datos => noHayLeccionEnParalelo
      // si leccion existe en base de datos y codigo mal ingresado => codigoIncorrecto
      // si le codigo esta correcto y leccion sinEmpezar => esperandoEmpieceLeccion
      // si el codigo esta correcto y leccion diferente de sinEmpezar => dandoLeccion
      // {tieneGrupo: true, paraleloDandoLeccion: true, codigoLeccion: false, leccionYaComenzo: false}
      return new Promise((resolve, reject) => {
        Promise.all([
          LeccionRealtime.ObtenerPorParaleloId({ paraleloId }),
          LeccionRealtime.ObtenerPorCodigo({ codigo })
        ])
        .then((values) => {
          let leccionTomada = values[0]
          let codigoValido = values[0] && values[1]
          
        })
        .catch((err) => {
          logger.error(err)
          reject()
        })
      })
    }
  }
  return Object.assign(Object.create(proto), {})
}