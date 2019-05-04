import catController from '../controllers/category'
import { isAdminAuthenticated } from '../lib/auth-util'
var router = require('express').Router()

router.route('/')
  .get(catController.index)
  .post(isAdminAuthenticated(), catController.new)

router.route('/:catId')
  .get(catController.view)
  .patch(isAdminAuthenticated(), catController.update)
  .put(isAdminAuthenticated(), catController.update)
  .delete(isAdminAuthenticated(), catController.delete)

module.exports = router
