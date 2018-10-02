const mongoose = require('mongoose')
const shortid = require('shortid')
const moment = require('moment')
mongoose.Promise = global.Promise

const LeccionesDatosSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': require('shortid').generate
  },
  id: { type: String },
  codigo: { type: String }, // generado en preSave
  estado: {
    type: String,
    enum: ['esperando', 'tomando', 'pausado', 'terminado'],
    'default': 'esperando'
  },
  paralelo: {
    _id: { type: String },
    nombre: { type: String }
  },
  fechaEmpezada: { type: String, 'default':  moment().toISOString() },
  // fechaPausada: { type: String, 'default':  moment().toISOString() }, 
  leccion: { type: String } // la leccion en json
},{ timestamps: true, versionKey: false, collection: 'leccionesDatos' })

LeccionesDatosSchema.methods.Crear = function () {
  let self = this
  return new Promise(function(resolve) {
    resolve(self.save())
  })
}

LeccionesDatosSchema.statics = {
  ObtenerPorParaleloId ({ paraleloId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ 'paralelo._id': paraleloId }))
    })
  },
  Obtener ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ _id: id }))
    })
  },
  CambiarEstado ({ id, estado }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ id: id }, { $set: { estado } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  Empezo ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ id: id }, { $set: { fechaEmpezada: moment().toISOString(), estado: 'tomando' } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  },
  ObtenerPorCodigo ({ codigo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ codigo }))
    })
  },
  ObtenerPorId ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ id: id }))
    })
  }
}

module.exports = mongoose.model('Lecciones', LeccionesDatosSchema)



 // // manejo del realtime
 //  activo: { // cambiado a false cuando el profesor termine la leccion
 //    type: Boolean,
 //    'default': true
 //  },
 //  pausas: [{
 //    fecha: { type: Date },
 //    moderador: {
 //      _id: { type: String },
 //      nombres: { type: String },
 //      apellidos: { type: String }
 //    }
 //  }],
 //  continuadas: [{
 //    fecha: { type: Date },
 //    segundosPausado: { type: String },
 //    moderador: {
 //      _id: { type: String },
 //      nombres: { type: String },
 //      apellidos: { type: String }
 //    }
 //  }],
 //  aumentados: [{
 //    fecha: { type: Date },
 //    segundos: { type: Date },
 //    moderador: { 
 //      _id: { type: String },
 //      nombres: { type: String },
 //      apellidos: { type: String }
 //    }
 //  }],
 //  estado: {
 //    type: String,
 //    enum: ['tomando', 'pausado', 'terminado'],
 //    'default': 'tomando'
 //  },
 //  fechaInicio: { type: Date },
 //  fechaFin: { type: Date },

 //  // Datos Otros
 //  estudiantesDandoLeccion: [{ // solo hace add cuando el estudiante ingresa el codigo
 //    _id: { type: String },
 //    socketId: { type: String },
 //    dispositivo: { type: String, 'default': ' ' }, // sera un json pasado a string. Porque no se sabe que informacion tendra
 //    nombres: { type: String },
 //    apellidos: { type: String },
 //    matricula: { type: String },
 //    correo: { type: String },
 //    grupoId: { type: String },
 //    grupoNombre: { type: String },
 //    estado: {
 //      type: String,
 //      enum: ['ingresandoCodigo', 'esperandoEmpieceLeccion', 'dandoLeccion'],
 //      'default': 'ingresandoCodigo' // ingresando codigo solo es algo que indicar que el estudiante ingreso el codigo nada mas
 //    }
 //  }]