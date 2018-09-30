// Todos los que dicen estaticos no deben depender de ninguna otro documento para funcionar

const mongoose = require('mongoose')
const shortid = require('shortid')
mongoose.Promise = global.Promise

const LeccionRealtimev2Schema = mongoose.Schema({
  _id: {
    type: String,
    'default': require('shortid').generate
  },
  // datos obtenidos de otros documentos
  codigo: { type: String },
  paralelo: {
    _id: { type: String },
    nombre: { type: String },
    nombreMateria: { type: String }
  },

  // manejo del realtime
  activo: { // cambiado a false cuando el profesor termine la leccion
    type: Boolean,
    'default': true
  },
  pausas: [{
    fecha: { type: Date },
    moderador: {
      _id: { type: String },
      nombres: { type: String },
      apellidos: { type: String }
    }
  }],
  continuadas: [{
    fecha: { type: Date },
    segundosPausado: { type: String },
    moderador: {
      _id: { type: String },
      nombres: { type: String },
      apellidos: { type: String }
    }
  }],
  aumentados: [{
    fecha: { type: Date },
    segundos: { type: Date },
    moderador: { 
      _id: { type: String },
      nombres: { type: String },
      apellidos: { type: String }
    }
  }],
  estado: {
    type: String,
    enum: ['sinEmpezar', 'tomando', 'pausado', 'terminado'],
    'default': 'sinEmpezar'
  },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },

  // Datos Otros
  estudiantesDandoLeccion: [{ // solo hace add cuando el estudiante ingresa el codigo
    _id: { type: String },
    socketId: { type: String },
    dispositivo: { type: String, 'default': ' ' }, // sera un json pasado a string. Porque no se sabe que informacion tendra
    nombres: { type: String },
    apellidos: { type: String },
    matricula: { type: String },
    correo: { type: String },
    grupoId: { type: String },
    grupoNombre: { type: String },
    estado: {
      type: String,
      enum: ['ingresandoCodigo', 'esperandoEmpieceLeccion', 'dandoLeccion'],
      'default': 'ingresandoCodigo' // ingresando codigo solo es algo que indicar que el estudiante ingreso el codigo nada mas
    }
  }]
},{timestamps: true, versionKey: false, collection: 'leccionesRealtime'})

LeccionRealtimev2Schema.methods.crear = function(){
  let self = this
  return new Promise(function(resolve) {
    resolve(self.save())
  })
}

LeccionRealtimev2Schema.statics = {
  ObtenerPorParaleloId({ paraleloId }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ 'paralelo._id': paraleloId }))
    })
  },
  ObtenerPorCodigo({ codigo }) {
    const self = this
    return new Promise(function(resolve) {
      resolve(self.findOne({ codigo }))
    })
  } 
}

// LeccionRealtimev2Schema.statics.obtenerLecciones = function(){
//   let self = this
//   return new Promise(function(resolve) {
//     resolve(self.find({}))
//   })
// }

// LeccionRealtimev2Schema.statics.obtenerLeccionPorCodigo = function({ codigo }){
//   let self = this
//   return new Promise(function(resolve) {
//     resolve(self.findOne({ codigo }))
//   })
// }


module.exports = {
  LeccionRealtime: mongoose.model('LeccionRealtimev2', LeccionRealtimev2Schema)
}