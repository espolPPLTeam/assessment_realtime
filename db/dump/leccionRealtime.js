let grupos = require('./grupos.json')
let estudiantes = require('./estudiantes.json')
let lecciones = require('./lecciones.json')
let profesores = require('./profesores.json')
let paralelos = require('./paralelos.json')
module.exports = {
  codigo: lecciones[0]['codigo'],
  paralelo: {
    _id: paralelos[0]['_id'],
    nombre: paralelos[0]['nombre'],
    nombreMateria: paralelos[0]['nombreMateria']
  }
}