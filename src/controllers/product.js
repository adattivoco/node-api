import Product from '../models/product'
import {errorResponse} from '../lib/controller-util'
const debug = require('debug')('adattivo:controllers:products')
const logerror = require('debug')('adattivo:controllers:products')

// Handle index actions
exports.index = (req, res) => {
  var sort = {}
  var findParams = {}
  var fields = ''

  if (req.query.keys) {
    if (req.query.load_all === 'true') {
      findParams = { key: { $in: req.query.keys } }
      sort = { name: 1 }
    } else {
      findParams = { active: true, key: { $in: req.query.keys } }
      sort = { sale_type: -1, name: 1 }
    }
  } else if (req.query.type === 'summary') {
    if (req.query.sort === 'type') {
      sort = { sale_type: (req.query.sort_order === 'asc' ? 1 : -1), name: 1 }
    } else {
      sort = { name: (req.query.sort_order === 'asc' ? 1 : -1) }
    }
    fields = 'key, name, active, sale_type, categories'
  } else {
    findParams = { active: true }
    sort = { sale_type: -1, name: 1 }
  }
  Product.find(findParams, fields, (err, products) => {
    if (err) {
      errorResponse(err, res)
    } else {
      res.json(products)
    }
  }).sort(sort)
}

// Handle create product actions
exports.new = (req, res) => {
  var product = new Product()
  product.name = req.body.name ? req.body.name : product.name

  // save the product and check for errors
  product.save((err) => {
    if (err) {
      errorResponse(err, res)
    }
    res.json(product)
  })
}

// Handle view product info
exports.view = (req, res) => {
  Product.findOne({ key: req.params.product_id }, (err, product) => {
    if (err) {
      Product.findById(req.params.product_id, (err, product) => {
        if (err) {
          errorResponse(err, res)
        } else {
          res.json(product)
        }
      })
    } else {
      res.json(product)
    }
  })
}

// Handle update product info
exports.update = (req, res) => {
  Product.findById(req.params.product_id, (err, product) => {
    if (err) {
      errorResponse(err, res)
    } else {
      product.name = req.body.name ? req.body.name : product.name

      // save the product and check for errors
      product.save((err) => {
        if (err) {
          errorResponse(err, res)
        } else {
          res.json(product)
        }
      })
    }
  })
}
