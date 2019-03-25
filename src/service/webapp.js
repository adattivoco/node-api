import bodyParser from 'body-parser'
import routes from '../routes'
import { setupAuth } from '../lib/auth-util'

const debug = require('debug')('adattivo:service:webapp')
const logerror = require('debug')('adattivo:error')

const setupWebapp = (app) => {
  debug('web container initializing')
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE, HEAD, CONNECT, TRACE, PATCH')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next()
  })

  setupAuth()
  app.use('/', routes)

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3005

  const server = app.listen(port, () => {
    debug(`web container started - ${port}`)
  })

  app.server = server
  return Promise.resolve()
}

export default setupWebapp
