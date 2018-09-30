sinon = require('sinon')
expect = require("chai").expect
co = require('co')
const Ajv = require('ajv')
mongo = require('../../databases/mongo/mongo')
ajv = new Ajv({$data: true})
const schema = require('./schema')
const logger = require('../../config/logger')
db = require('./database')({ schema, logger })
ConectarMongo = async function () {
  try {
    await mongo.Conectar('mongodb://localhost/ppl_testing')
  } catch (err) {
    console.error(err)
    exit(1)
  }
}