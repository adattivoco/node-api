import healthController from '../controllers/health'
var router = require('express').Router()

router.route('/').get(healthController.index)
router.route('/health').get(healthController.health)

router.use('/users', require('./users'))

router.use('/auth', require('./auth'))

router.use((req, res) => {
  res.status(404).send({ message: 'Page Not Found (404)' })
})

module.exports = router
