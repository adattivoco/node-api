import mongoose from 'mongoose'

const debug = require('debug')('adattivo:service:db')
const logerror = require('debug')('adattivo:error')

mongoose.Promise = global.Promise

const connectToDb = () => {
  debug('db initializing')
  if (process.env.MONGO_DEBUG === 'true') {
    mongoose.set('debug', true)
  }
  return mongoose.connect(process.env.MONGO_URI).then(() => {
    debug('db started')
    return Promise.resolve()
  })
}

export default connectToDb
