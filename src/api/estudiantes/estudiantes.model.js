const mongoose = require('mongoose')
const shortid = require('shortid')
const moment = require('moment')
mongoose.Promise = global.Promise

const EstudiantesRealtimeSchema = mongoose.Schema({
  _id: {
    type: String,
    'default': require('shortid').generate
  },
  // id: { type: String },
  correo: { type: String },
  yaIngresoCodigo: { type: Boolean, 'default': true },
  yaIngresoCodigoCorrecto: { type: Boolean, 'default': false },
  paraleloId: { type: String },
  leccionId: { type: String }
},{ timestamps: true, versionKey: false, collection: 'estudiantesRealtime' })

EstudiantesRealtimeSchema.methods.Crear = function () {
  let self = this
  return new Promise(function(resolve) {
    resolve(self.save())
  })
}

EstudiantesRealtimeSchema.statics = {
  Obtener ({ id }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ _id: id }))
    })
  },
  ObtenerPorLeccionYParalelo ({ leccionId, paraleloId }) {
    const self = this
    return new Promise(function (resolve) {
      resolve(self.findOne({ $and: [{ leccionId: leccionId }, { paraleloId: paraleloId }] }))
    })
  },
  CodigoCorrecto ({ leccionId, paraleloId }) {
    const self = this
    return new Promise(function (resolve) {
      self.updateOne({ $and: [{ leccionId: leccionId }, { paraleloId: paraleloId }] }, { $set: { yaIngresoCodigoCorrecto: true } }).then((accionEstado) => {
        resolve(!!accionEstado.nModified)
      })
    })
  }
}

module.exports = mongoose.model('EstudiantesRealtime', EstudiantesRealtimeSchema)