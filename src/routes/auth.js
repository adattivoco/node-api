import authController from '../controllers/auth'
var router = require('express').Router()

router.route('/')
  .post(authController.logIn)
//  .delete(authController.delete)

router.route('/forgot-password')
  .post(authController.forgotPassword)
  .put(authController.resetPassword)

module.exports = router
