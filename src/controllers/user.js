import User from '../models/user'
import {errorResponse} from '../lib/controller-util'
import moment from 'moment'
const debug = require('debug')('adattivo:controllers:users')
const logerror = require('debug')('adattivo:controllers:users')

// get /users
exports.index = (req, res) => {
  var findParams = {}
  if (req.query.admin) {
    findParams={ type: 'admin' }
  }
  User.find(findParams, (err, users) => {
    if (err) {
      errorResponse(err, res)
    } else {
      res.json(users)
    }
  }).sort({ name: 1 })
}

// post /users
exports.new = (req, res) => {
  const {firstName, lastName, email, phone, type, state, city, month, day, year, password} = req.body
  var user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    type: type || 'user',
    status: 'pending',
    address: {city: city, state: state},
    password: password,
    bornAt: new Date(year, parseInt(month)-1, day)
  })
  user.confirmationCode = user.buildConfirmationCode()
  user.confirmationAt = new Date()
  // save the user and check for errors
  user.save((err) => {
    if (err) {
      errorResponse(err, res)
    } else {
      user.sendConfirmationToken()
      res.json(user)
    }
  })
}

// post /users/admin
exports.newAdmin = (req, res) => {
  const {firstName, lastName, email, clientURL} = req.body
  var user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    type: 'admin',
    status: 'active'
  })

  user.save().then(user => {
    user.sendResetPW(clientURL)
    return User.find({type: 'admin'}).sort({ name: 1 })
  }).then(users => {
    res.json(users)
  }).catch((error) => {
    errorResponse(error, res)
  })
}

// post /user/:userId/verify
exports.verify = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      errorResponse(err, res)
    } else {
      if (user && user.confirmationCode === req.body.code &&
          moment().diff(user.confirmationAt, 'minutes') <= 10) {
        user.status = 'active'
        user.confirmationCode = null
        user.confirmationAt = null
        user.lastSignInAt = new Date()
        user.signInCount = user.signInCount + 1
        user.save(err => {
          if (err) {
            errorResponse(err, res)
          } else {
            res.json({
              user: user,
              token: user.buildJWT()
            })
          }
        })
      } else {
        errorResponse('Invalid or expired code, please try again or resend code to your email address.', res)
      }
    }
  })
}

// put or patch /user/:userId/verify
exports.verifyResend = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) {
      errorResponse(err, res)
    } else {
      if (user) {
        user.confirmationCode = user.buildConfirmationCode()
        user.confirmationAt = new Date()
        user.save(err => {
          if (err) {
            errorResponse(err, res)
          } else {
            user.sendConfirmationToken()
            res.json(user)
          }
        })
      } else {
        errorResponse('User not found.', res)
      }
    }
  })
}

// get /user/:userId
exports.view = (req, res) => {
  res.json(req.user)
}

// put/patch get /user/:userId
exports.update = (req, res) => {
  const {firstName, lastName, email, phone, type, state, city, month, day, year, password} = req.body
  var user = req.user
  user.firstName = firstName
  user.lastName = lastName
  user.email = email
  user.phone = phone
  // save the user and check for errors
  user.save((err) => {
    if (err) {
      res.json(err)
    } else {
      res.json(user)
    }
  })
}

// delete /user/:userId
exports.delete = (req, res) => {
  User.remove({
    _id: req.params.userId
  }).then(user => {
    return User.find({type: 'admin'}).sort({ name: 1 })
  }).then(users => {
    res.json(users)
  }).catch((error) => {
    errorResponse(error, res)
  })
}
