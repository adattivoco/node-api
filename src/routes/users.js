import userController from '../controllers/user'
import { isAdminAuthenticated, isAuthenticated } from '../lib/auth-util'
var router = require('express').Router()

router.route('/')
  .get(isAdminAuthenticated(), userController.index)
  .post(userController.new)

router.route('/:userId')
  .get(isAuthenticated(), userController.view)
  .patch(isAuthenticated(), userController.update)
  .put(isAuthenticated(), userController.update)
  .delete(isAdminAuthenticated(), userController.delete)

router.route('/:userId/verify')
  .post(userController.verify)
  .patch(userController.verifyResend)
  .put(userController.verifyResend)

router.route('/admin')
  .post(isAdminAuthenticated(), userController.newAdmin)

module.exports = router
