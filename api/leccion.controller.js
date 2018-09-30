module.exports = ({ responses, logger, db }) => {
  const proto = {
    async VerificarCodigoEstudiante({ codigo, paraleloId }) {
      let estado = await db.VerificarCodigoEstudiante({ codigo, paraleloId })
      return responses.OK({ datos: estado })
    },
    // enviar el codigo
    // los estudiantes con sus grupos
    // los estudiantes conectados
    // habilitar que el paraleloEstaDandoLeccion
    async Tomar({ paraleloId, leccionId }) {
      return responses.OK({ datos: 'bien' })
    }
  }
  return Object.assign(Object.create(proto), {})
}