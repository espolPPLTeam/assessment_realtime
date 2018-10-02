// https://github.com/adaltas/node-http-status/blob/master/src/index.litcoffee
// 200 OK
// 201 creatre
// 401 NO_AUTORIZADO
// 500 ERROR_SERVIDOR
// 403 soloAdministrador
// 404 urlNoValido
// 406 noJson
// 400 malRequest dd

const ERROR_SERVIDOR = { datos: { mensaje_error: 'Error en el servidor' }, codigoEstado: 500, estado: false }

const NO_AUTORIZADO = { datos: { mensaje_error: 'No autorizado' }, codigoEstado: 401, estado: false }

const NO_ENVIO_JWT = { datos: { mensaje_error: 'No envio el jwt en el Bearer' }, codigoEstado: 401, estado: false }

const OK = (datos) => {
  const resp = { estado: true, datos, codigoEstado: 200 }
  return resp
}

const CREADO = (datos) => {
  const resp = { estado: true, datos, codigoEstado: 201 }
  return resp
}

const NO_OK = (datos) => {
  const resp = { estado: false, datos, codigoEstado: 200 }
  return resp
}

module.exports = {
  ERROR_SERVIDOR,
  NO_AUTORIZADO,
  OK,
  NO_OK,
  CREADO,
  NO_ENVIO_JWT
}
