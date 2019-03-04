import User from '../models/user'
import {errorResponse} from '../lib/controller-util'
const debug = require('debug')('adattivo:controllers:users')
const logerror = require('debug')('adattivo:controllers:users')

// Handle index actions
exports.index = (req, res) => {
  var find_params = {}
  if (req.query.admin) {
    find_params={ _type: req.query.admin=='true'?'Admin':'CompanyUser'}
  }
  User.find(find_params, (err, users) => {
    if (err) {
      errorResponse(err, res)
    } else {
      res.json(users)
    }
  }).sort({name: 1})
}

// Handle create user actions
exports.new = (req, res) => {
  var user = new User()
  user.name = req.body.name ? req.body.name : user.name
  user.email = req.body.email

  // save the user and check for errors
  user.save((err) => {
    if (err) {
      errorResponse(err, res)
    } else {
      res.json(user)
    }
  })
}

// Handle view user info
exports.view = (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      res.send(err)
    } else {
      res.json(user)
    }
  })
}

// Handle update user info
exports.update = (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      res.send(err)
    }
    user.name = req.body.name ? req.body.name : user.name
    user.email = req.body.email

    // save the user and check for errors
    user.save((err) => {
      if (err) {
        res.json(err)
      } else {
        res.json(user)
      }
    })
  })
}

// Handle delete user
exports.delete = (req, res) => {
  User.remove({
    id: req.params.user_id
  }, (err, user) => {
    if (err) {
      res.send(err)
    } else {
      res.json({
        status: 'success',
        message: 'User deleted'
      })
    }
  })
}
