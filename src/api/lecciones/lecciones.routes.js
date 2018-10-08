module.exports = (app, db) => {
  const Controller = require('./lecciones.controller')({ db })
  /*
    Recibira la leccion con todas las secciones y todo.
    Sera un json independiente y no tendra nada que ver con el resto
  */
  app
    .route('/lecciones/tomar')
    .post(async (req, res) => {
      let { leccion, paralelo } = req.body
      let resp = await Controller.Tomar({ leccion, paralelo })
      return res.status(resp.codigoEstado).send(resp)
    })

  app
    .route('/leccion/:id/empezar')
    .post(async (req, res) => {
      let { id } = req.params
      let resp = await Controller.Empezar({ id })
      return res.status(resp.codigoEstado).send(resp)
    })

  app
    .route('/leccion/:id/terminar')
    .post(async (req, res) => {
      let { id } = req.params
      let resp = await Controller.Terminar({ id })
      return res.status(resp.codigoEstado).send(resp)
    })

  app
    .route('/leccion/:id/pausar')
    .post(async (req, res) => {
      let { id } = req.params
      let resp = await Controller.Pausar({ id })
      return res.status(resp.codigoEstado).send(resp)
    })

  app
    .route('/leccion/:id/continuar')
    .post(async (req, res) => {
      let { id } = req.params
      let resp = await Controller.Continuar({ id })
      return res.status(resp.codigoEstado).send(resp)
    })

  app
    .route('/leccion/:id/aumentarTiempo')
    .post(async (req, res) => {
      res.send('aumentarTiempo')
    })

  /*
    Endpoint multiproposito
    Se usa cuando el estudiante entre a ingresar codigo (en este caso ingresar como codigo cualquier palabra)
    y cuando el estudiante ingrese codigo
  */
  app
    .route('/estudiante/verificarCodigo/:paraleloId/:correo/:codigo')
    .get(async (req, res) => {
      let { paraleloId, correo, codigo } = req.params
      let resp = await Controller.VerificarCodigoEstudiante({ paraleloId, correo, codigo })
      return res.status(resp.codigoEstado).send(resp)
    })

  /*
    Devolvera los datos de la leccion:
    Las preguntas, leccion, respuestas
  */
  app
    .route('/estudiante/leccion')
    .get((req, res) => {
    })

  app
    .route('/ping')
    .get((req, res) => {
      res.send({ hello: 'Hello World!' })
    })
}