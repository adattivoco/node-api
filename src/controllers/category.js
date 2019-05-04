import Category from '../models/category'
import Product from '../models/product'
import {errorResponse} from '../lib/controller-util'
const debug = require('debug')('adattivo:controllers:categories')
const logerror = require('debug')('adattivo:controllers:categories')

// get or /categories
exports.index = (req, res) => {
  var sort = {}
  if (req.query.sort === 'name') {
    sort = { name: 1 }
  } else if (req.query.sort === 'type') {
    sort = { type: -1, name: 1 }
  } else {
    sort = { preferred: -1, sort_order: 1, name: 1 }
  }
  var findParams = {}
  if (req.query.filter === 'catetories') {
    findParams = { type: 'CATEGORY' }
  } else if (req.query.filter === 'verticals') {
    findParams = { type: 'VERTICAL' }
  } else if (req.query.filter === 'bundles') {
    findParams = { type: 'BUNDLE' }
  } else if (req.query.filter === 'preferred') {
    findParams = { preferred: true, type: 'CATEGORY' }
  }

  if (req.query.active === 'true') {
    findParams.active = true
  }
  Category.find(findParams, (err, categories) => {
    if (err) {
      errorResponse(err, res)
    } else {
      res.json(categories)
    }
  }).sort(sort)
}

// post /categories
exports.new = (req, res) => {
  var category = new Category()
  category.name = req.body.name ? req.body.name : category.name

  // save the category and check for errors
  category.save((err) => {
    if (err) {
      errorResponse(err, res)
    }
    res.json(category)
  })
}

// get /categories/:catId
exports.view = (req, res) => {
  Category.findOne({ key: req.params.catId }, (err, category) => {
    if (err) {
      Category.findById(req.params.catId, (err, category) => {
        if (err) {
          errorResponse(err, res)
        } else {
          res.json(category)
        }
      })
    } else {
      res.json(category)
    }
  })
}

// put or patch /categories/:catId
exports.update = (req, res) => {
  Category.findById(req.params.catId, (err, category) => {
    if (err) {
      errorResponse(err, res)
    } else {
      category.name = req.body.name ? req.body.name : category.name

      // save the category and check for errors
      category.save((err) => {
        if (err) {
          errorResponse(err, res)
        } else {
          res.json(category)
        }
      })
    }
  })
}

// delete /categories/:catId
exports.delete = (req, res) => {
  Category.remove({
    _id: req.params.catId
  }).then(cat => {
    return Category.find({}).sort({ name: 1 })
  }).then(cats => {
    res.json(cats)
  }).catch((error) => {
    errorResponse(error, res)
  })
}

// Handle view category info
exports.products = (req, res) => {
  // category = Category.find_by(key: params[:id].downcase)
  // category ||= Category.find(params[:id])
  // if category
  //   cats = []
  //   prods = Product.where(active: true)
  //   if category.key == 'just-added'
  //     prods = prods.just_added
  //     if prods.length < 10
  //       prods = Product.where(active: true).last_ten
  //     end
  //   elsif category.key == 'cue-managed'
  //     prods = prods.where(sale_type: 'RESELLER')
  //     cats = Category.only(:key, :active, :name, :summary, :icon, :type, :preferred).where({active: true, "products.sale_type" => 'RESELLER', type: 'CATEGORY'}).order(preferred: :desc, sort_order: :asc, name: :asc)
  //   else
  //     prods = prods.in(key: params[:keys].nil? ? category.products.map {|prod| prod[:key]} : params[:keys])
  //   end
  //   render(json: { category: category, products: prods, categories: cats }, methods: :logo)
  // else
  //   render json: { error: 'Category not found. Please try again.' }, status: :not_found
  // end
  debug('begin')
  Category.findOne({ key: req.params.catId }, (err, category) => {
    if (err) {
      errorResponse(err, res)
    } else {
      var cats = []
      var sort = {}
      var findParams = {}
      var limit = null
      if (category.key === 'just-added') {
        findParams = { active: true }
        sort = { c_at: -1 }
        limit = 10
      } else if (category.key === 'cue-managed') {
        findParams = { active: true, sale_type: 'RESELLER' }
        sort = { name: 1 }
      } else {
        if (req.query.keys) {
          findParams = { active: true, key: { $in: req.query.keys } }
        } else {
          var keys = category.products.map(prod => { return prod.key })
          findParams = { active: true, key: { $in: keys } }
        }
      }
      Product.find(findParams, (err, products) => {
        if (err) {
          errorResponse(err, res)
        } else {
          products.forEach(prod => {
            prod.categories.forEach(cat => {
              if (!cats.find(c => { return c.key === cat })) {
                cats.push({ key: cat, name: cat, summary: cat })
              }
            })
          })
          debug('end')
          res.json({ 'category': category, 'categories': cats, 'products': products })
        }
      }).sort(sort).limit(limit)
    }
  })
}
