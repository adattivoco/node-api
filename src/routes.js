let routes = require('express').Router()
var healthController = require('./controllers/health')
var categoryController = require('./controllers/category')
var productController = require('./controllers/product')
var userController = require('./controllers/user')

routes.get('/', (req, res) => res.send({ message: 'Hello Adattivo NodeAPI!' }))

routes.route('/health')
  .get(healthController.index)

routes.route('/categories')
  .get(categoryController.index)
  .post(categoryController.new)

routes.route('/categories/:category_id')
  .get(categoryController.view)
  .patch(categoryController.update)
  .put(categoryController.update)

routes.route('/categories/:category_id/products')
  .get(categoryController.products)

routes.route('/products')
  .get(productController.index)
  .post(productController.new)

routes.route('/products/:product_id')
  .get(productController.view)
  .patch(productController.update)
  .put(productController.update)

routes.route('/users')
  .get(userController.index)
  .post(userController.new)

routes.route('/users/:user_id')
  .get(userController.view)
  .patch(userController.update)
  .put(userController.update)
  .delete(userController.delete)

routes.use((req, res) => {
  res.status(404).send({ message: 'Page Not Found (404)' })
})

module.exports = routes
