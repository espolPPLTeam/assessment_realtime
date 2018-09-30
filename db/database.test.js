describe('DATABASE', () => {
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
  describe('@t1 Tomar', () => {
    it('@t1.1 OK', (done) => {
      db.crearLeccion().then((resp) => {
        done()
      })
    })
  })
})