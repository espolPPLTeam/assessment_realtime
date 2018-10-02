let controller = require('./lecciones.controller')({ db: modelos })
describe('Routes - Integration', () => {
  let leccion = dump.lecciones[0]
  let paralelo = dump.paralelos[0]
  afterEach(async function() {
    await mongo.Limpiar()
  })
  before('Limpiar la base de datos', async () => {
    await mongo.Conectar(URL_DB)
  })
  after('Desconectar la base de datos', () => {
    mongo.Desconectar()
  })

  describe('@T10 Tomar', () => {
    it('OK', async () => {
      let send = { leccion, paralelo }
      let res = await request(app).post(`/api/realtime/lecciones/tomar`).send(send)
      expect(res.body.estado).to.equal(true)
      expect(res.body.codigoEstado).to.equal(200)

      // verificar que se creo el codigo
      expect(res.body.datos.codigo).to.not.equal(null)

      let leccionEncontrada = await modelos.Lecciones.Obtener({ id: res.body.datos.id })
      // verificar que esta esperando comenzar la leccion
      expect(leccionEncontrada).to.have.property('estado', 'esperando')
    })
  })

  describe('@T20 Empezar', () => {
    it('OK', async () => {
      let leccionCreada = await controller.Tomar({ leccion, paralelo })
      let id = leccionCreada['datos']['id']
      let res = await request(app).post(`/api/realtime/leccion/${id}/empezar`)
      // console.log(res.body)
      let leccionEncontrada = await modelos.Lecciones.Obtener({ id })
      console.log(leccionEncontrada)
      // verificar que esta esperando comenzar la leccion
      // expect(leccionEncontrada).to.have.property('estado', 'esperando')
    })
  })

  describe('@T30 Pausar', () => {
    it('OK', async () => {
      let leccionCreada = await controller.Tomar({ leccion, paralelo })
      let id = leccionCreada['datos']['id']
      let res = await request(app).post(`/api/realtime/leccion/${id}/pausar`)
      console.log(res.body)
    })
  })

  describe('@T40 Continuar', () => {
    it('OK', async () => {
      let leccionCreada = await controller.Tomar({ leccion, paralelo })
      let id = leccionCreada['datos']['id']
      let res = await request(app).post(`/api/realtime/leccion/${id}/continuar`)
      console.log(res.body)
    })
  })

})