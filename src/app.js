import Promise from 'bluebird'
import setupDb from './service/db'
import setupWebapp from './service/webapp'
import setupSchedule from './service/schedule'
import express from 'express'
import dotenv from 'dotenv'

//require('console-stamp')(console, '[HH:MM:ss.l]')

let debug = require('debug')('adattivo:app')
let logerror = require('debug')('adattivo:error')

// // Connect to Mongoose and set connection variable
// mongoose.connect(process.env.MONGO_URI)
//
// var db = mongoose.connection
//
// var port = process.env.PORT || 3000
//
// // Send message for default URL
// app.get('/', (req, res) => res.send('Hello World with Express'))
//
// // Use Api routes in the App
// app.use('/', routes)
//
// // Launch app to listen to specified port
// app.listen(port, function () {
//   console.log('Running node-api on port:' + port)
// })

dotenv.config()

if (process.env.LOAD_POLYFILL !== 'false') {
  require('@babel/polyfill')
}

const app = express()
app.state = 'stopped'
app.start = (done) => {
  if (app.state !== 'stopped') {
    done()
    return
  }
  app.state = 'initializing'
  debug('server initializing')
  Promise.all([
    setupDb(),
    setupWebapp(app),
    setupSchedule()
  ]).then(() => {
    app.state = 'started'
    debug('server started')
    if (done) {
      done()
    }
  }).catch((err) => {
    logerror('error in server setup', err)
    process.exit(1)
  })
}
app.start()
debug(2)
exports = module.exports = app
