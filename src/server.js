const db = require('./config/db')
const { PORT, urlDB } = require('./config')
const startDB = async () => {
  try {
    await db.Conectar(urlDB())
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

const { app, server } = require('./app')
const port = PORT
app.set('port', port)
startDB()
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const port = process.env.PORT
  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} correr en otro puerto, este puerto requiere permisos de root`)
      process.exit(1)
    case 'EADDRINUSE':
      console.error(`${bind} el puerto ya esta en uso client`)
      process.exit(1)
    default:
      throw error
  }
}

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `Pipe ${addr}`
    : `Port ${addr.port}`
  if (process.env.NODE_ENV !== 'testing') {
    console.info(`server corriendo en  ${bind}`)
  }
}

server.on('error', onError)
server.on('listening', onListening)
server.listen(app.get('port'))
