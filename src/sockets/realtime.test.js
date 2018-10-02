// Si se edita algo de timer, se debe editar esto tambien o como se haria?
// 'usuario' emit: ser conectan los usuarios
// 'comenzar-leccion' emit: profesor comienza leccion 
// 'nuevo-estudiante-conectado' on: se detecta al nuevo estudiante conectado
// 'tiempo-restante-leccion' on: se verifica que el tiempo de la leccion sea el correcto
// 'terminar-leccion' emit: se termina la lecion
// 'terminada-leccion' on: se detecta que se termino la leccion

describe('Realtime', function(){
  beforeEach(function(){
    server.listen(process.env.PORT || 3000)
    moderador = io(`http://localhost:${process.env.PORT || 3000}/leccion`, ioOptions)
    estudiante = io(`http://localhost:${process.env.PORT || 3000}/leccion`, ioOptions)
  })
  afterEach(function(){
    moderador.disconnect()
    estudiante.disconnect()
    server.close()
  })
  after(function() {
    server.close()
  })
  describe('Lecciones',   function(done) {
    it('Comenzar leccion, estudiante recibe tiempo, terminar leccion (1s)', (done) => {
      done()
    })
  })
})