const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.Promise = Promise
var db

let Conectar = function (url) {
  return new Promise(function (resolve) {
    let options = { useNewUrlParser: true }
    if (process.env.NODE_ENV === 'production') { options = { autoIndex: false } }
    mongoose.connect(url, options)
    db = mongoose.connection
    db.on('error', function (err) {
      console.log(`error ${err}`)
    })

    db.on('connected', function () {
      if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'production') { console.log(`app de PPL conectada con ${url}`) }
    })

    db.on('disconnected', function () {
      if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'production') { console.log('base de datos desconectada') }
    })
    resolve(db)
  })
}

const Lecciones = require('../../api/lecciones/lecciones.model.js')
const Estudiantes = require('../../api/estudiantes/estudiantes.model.js')
// const Capitulos = require('../../modulos/capitulos/capitulos.model.js')
// const Estudiantes = require('../../modulos/estudiantes/estudiantes.model.js')
// const Grupos = require('../../modulos/grupos/grupos.model.js')
// const Lecciones = require('../../api/lecciones/lecciones.model.js')
// const Materias = require('../../modulos/materias/materias.model.js')
// const Paralelos = require('../../modulos/paralelos/paralelos.model.js')
// const Preguntas = require('../../modulos/preguntas/preguntas.model.js')
// const Profesores = require('../../modulos/profesores/profesores.model.js')
// const Respuestas = require('../../modulos/respuestas/respuestas.model.js')
// const Rubricas = require('../../modulos/rubricas/rubricas.model.js')
// const Secciones = require('../../modulos/secciones/secciones.model.js')

let modelos = function () {
  return {
    Lecciones,
    Estudiantes
  }
}

let Desconectar = function () {
  mongoose.connection.close()
}

let Limpiar = function () {
  return new Promise(function (resolve) {
    resolve(mongoose.connection.dropDatabase())
  })
}

module.exports = {
  Conectar,
  Desconectar,
  Limpiar,
  modelos
}
