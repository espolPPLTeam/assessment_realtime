module.exports = ({ app, controller, logger }) => {
  app
  .route('/leccion/tomar')
  .post((req, res) => {
    let { paraleloId, leccionId } = req.body
    controller.Tomar({ paraleloId, leccionId })
    .then((resp) => {
      res.status(resp.codigoEstado).json(resp)
    })
    .catch((err, resp) => {
      logger.error(err)
      res.status(resp.codigoEstado).json(resp)
    })
  })

  app
  .route('/leccion/comenzar')
  .post((req, res) => {
    res.send('hello')
  })

  app
  .route('/leccion/pausar')
  .post((req, res) => {
    res.send('hello')
  })

  app
  .route('/leccion/continuar')
  .post((req, res) => {
    res.send('hello')
  })

  app
  .route('/leccion/aumentar')
  .post((req, res) => {
    res.send('hello')
  })

  app
  .route('/estudiante/verificarCodigo/:codigo/:paraleloId')
  .get((req, res) => {
    //TODO: si no tiene grupo? y si no tiene paralelo?
    let { codigo, paraleloId } = req.params
    controller.VerificarCodigoEstudiante({ codigo, paraleloId })
    .then((resp) => {
      res.status(resp.codigoEstado).json(resp)
    })
    .catch((err, resp) => {
      logger.error(err)
      res.status(resp.codigoEstado).json(resp)
    })
  })

  app
  .route('/estudiante/leccion')
  .get((req, res) => {
    res.send('hello')
  })
}