module.exports = {
  logger () {
    if (process.env.NODE_ENV === 'testing') {
      return {}
    } else {
      return { logger: true }
    }
  },
  urlDB () {
    if (process.env.NODE_ENV === 'testing') {
      return 'mongodb://localhost/assessmente_realtime_test'
    } else if (process.env.NODE_ENV === 'development') {
      return 'mongodb://localhost/assessmente_realtime_dev'
    } else if (process.env.NODE_ENV === 'production') {
      return 'mongodb://localhost/assessmente_realtime_prod'
    } else {
      console.error('No se ha especificado un entorno de variable')
      process.exit(1)
    }
  },
  PORT: process.env.REALTIME_PORT,
  SOCKET_PING_INTERVAL: 60000,
  SOCKET_PING_TIMEOUT: 120000,
  isDevelop: process.NODE_ENV === 'development',
  isProduction: process.NODE_ENV === 'production',
  isTesting: process.NODE_ENV === 'testing'
}
