describe('Routes - Integration', () => {
  let docs = []
  before(function(done) {
    co(function *() {
      yield ConectarMongo()
      yield mongo.Limpiar()
      done()
    })
  })
  after(function(done) {
    mongo.Desconectar()
    done()
  })
  beforeEach(function(done) {
    co(function *() {
      yield mongo.Limpiar()
      done()
    })
  })
  describe('@t1 Leccion Sin Empezar', () => {
    it('@t1.1 Estudiante Ingresa Codigo', (done) => {
      let codigo = 'abcd'
      let paraleloId = 'aaaaa'
      request(app)
      .get(`/api/realtime/estudiante/verificarCodigo/${codigo}/${paraleloId}`)
      .end(function(err, res) {
        // console.log(res.body)
        done()
      })
    })
  })
    // el profesor da click al boton tomarLeccion
  // ACCIONES:
  // Se copiaran los datos necesarios de los otros documentos al que se maneja en el realtime
  // describe('@t2 Tomar', () => {
  //   it('@t2.1 OK', (done) => {
  //   let req = {
  //   paraleloId: '123', 
  //   leccionId: '456'
  // }
  //     expect(1).to.equal(1)
  //     request(app)
  //     .post('/api/realtime/leccion/tomar')
  //     .send(req)
  //     .end(function(err, res) {
  //       done()
  //     })
  //   })
  // })
})