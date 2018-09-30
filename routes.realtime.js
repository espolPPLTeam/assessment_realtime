const routes = require('./api/leccion.routes')
const responses = require('../config/responses')
const logger = require('../config/logger')
const schema = require('./db/schema')
const db = require('./db/database')({ schema, logger })
const controller = require('./api/leccion.controller')({ responses, logger, db })
module.exports = (app, io) => {
  routes({ app, controller, logger })
}
