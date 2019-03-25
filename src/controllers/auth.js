import User from '../models/user'
import { errorResponse } from '../lib/controller-util'
import moment from 'moment'
const debug = require('debug')('adattivo:controller:auth')
const logerror = require('debug')('adattivo:error')

var authError = new Error('Invalid email or password')
authError.code = 401

// post /auth
exports.logIn = (req, res) => {
  const { password } = req.body
  let { email } = req.body
  email = email ? email.toLowerCase() : ''
  User.findOne({
    email
  }).then(user => {
    if (!user) {
      return Promise.reject({
        status: 401,
        message: 'Invalid email or password'
      })
    } else if (user.status != 'active') {
      return Promise.reject({
        status: 401,
        message: 'User not active'
      })
    } else {
      return user.comparePassword(password)
    }
  }).then(user => {
    user.lastSignInAt = new Date()
    user.signInCount = user.signInCount + 1
    return user.save()
  }).then(user => {
    res.json({
      user,
      token: user.buildJWT()
    })
  }).catch((error) => {
    errorResponse(error, res)
  })
}

// post /auth/forgot-password
exports.forgotPassword = (req, res) => {
  var { email, clientURL } = req.body
  email = email ? email.toLowerCase() : ''
  User.findOne({
    email
  }).then((user) => {
    if (!user) {
      res.json(true)
    } else {
      user.forgotPasswordToken = user.buildForgotPasswordToken()
      user.forgotPasswordAt = new Date()
      return user.save()
    }
  }).then((user) => {
    user.sendResetPW(clientURL)
    res.json(true)
  }).catch((error) => {
    errorResponse(error, res)
  })
}

// put /auth/forgot-password
exports.resetPassword = (req, res) => {
  User.findOne({
    forgotPasswordToken: req.body.token
  }).then(user => {
    if (user && moment().diff(user.forgotPasswordAt, 'minutes') <= 10) {
      user.status = 'active'
      user.password = req.body.password
      user.forgotPasswordToken = null
      user.forgotPasswordAt = null
      return user.save()
    } else {
      return Promise.reject({
        status: 401,
        message: 'Invalid or expired code, please try again or resend reset password instructions to your email address.'
      })
    }
  }).then(user => {
    res.json(true)
  }).catch((error) => {
    errorResponse(error, res)
  })
}
