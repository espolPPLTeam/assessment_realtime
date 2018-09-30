app = require('../../app').app
request = require('supertest')
sinon = require('sinon')
expect = require("chai").expect
co = require('co')
moment = require('moment')
validator = require('validator')
const Ajv = require('ajv')
mongo = require('../../databases/mongo/mongo')
ajv = new Ajv({$data: true})

ConectarMongo = async function () {
  try {
    await mongo.Conectar('mongodb://localhost/ppl_testing')
  } catch (err) {
    console.error(err)
    exit(1)
  }
}