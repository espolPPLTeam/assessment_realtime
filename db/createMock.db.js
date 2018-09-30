const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://localhost/'

const dbName = 'ppl_testing'
const leccionRealtime = require('./dump/leccionRealtime')

MongoClient.connect(url, function(err, client) {
  console.log("Connected successfully to server");
 
  const db = client.db(dbName)
  const collection = db.collection('leccionesRealtime')
  collection.insertMany([leccionRealtime], function(err, result) {
    console.log(err)
    console.log(result)
    client.close()
  })
})