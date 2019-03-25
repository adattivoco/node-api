import mongoose from 'mongoose'

const debug = require('debug')('adattivo:service:db')
const logerror = require('debug')('adattivo:error')

mongoose.Promise = global.Promise

const connectToDb = () => {
  debug('db initializing')
  if (process.env.MONGO_DEBUG === 'true') {
    debug('db in debug mode')
    mongoose.set('debug', true)
  }
  return mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => {
    debug('db started')
    return Promise.resolve()
  })
}

export default connectToDb
