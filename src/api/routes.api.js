// logger, responses, db
// const db = require('../config/db').modelos()

const express = require('express')
const app = express()

const db = require('../config/db').modelos()
require('./lecciones/lecciones.routes')(app, db)

app
  .route('*')
  .get((req, res) => {
    res.json({ estado: false, datos: 'Esta ruta no existe' })
  })

module.exports = app
