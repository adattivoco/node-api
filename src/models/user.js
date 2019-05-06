import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import validate from 'mongoose-validator'
import uniqueValidator from 'mongoose-unique-validator'
import jwt from 'jsonwebtoken'

//import Notification from './notification'
//import NotificationType from './notification-type'

// Setup schema
var schema = mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: [
      validate({
        validator: 'isEmail',
        message: 'Invalid email address'
      })
    ]
  },
  type: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'active', 'inactive', 'locked'],
    default: 'pending'
  },
  address: {
    street1: String,
    street2: String,
    city: String,
    state: String,
    postalCode: String
  },
  bornAt: Date,
  passwordHash: String,
  confirmationCode: String,
  confirmationAt: Date,
  forgotPasswordToken: String,
  forgotPasswordAt: Date,
  signInCount: {
    type: Number,
    default: 0
  },
  lastSignInAt: Date,
  updatedAt: Date,
  createdAt: Date
})
schema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.passwordHash).then((result) => {
      if (result) {
        return Promise.resolve(this)
      } else {
        return Promise.reject({
          status: 401,
          message: 'Invalid email or password'
        })
      }
    })
  },
  sendConfirmationToken() {
    // const self = this;
    // return NotificationType.findOne({
    //   name: 'email_confirmation'
    // }).then((notificationType) => {
    //   return new Notification({
    //     notificationType: notificationType._id,
    //     user: self._id,
    //     properties: {
    //       confirmationToken: this.confirmationToken
    //     }
    //   }).save()
    // }).then((notification) => {
    //   return notification.queue()
    // })
  },
  sendResetPW(clientURL) {
    // const self = this;
    // return NotificationType.findOne({
    //   name: 'email_confirmation'
    // }).then((notificationType) => {
    //   return new Notification({
    //     notificationType: notificationType._id,
    //     user: self._id,
    //     properties: {
    //       confirmationToken: this.confirmationToken
    //     }
    //   }).save()
    // }).then((notification) => {
    //   return notification.queue()
    // })
  },
  buildConfirmationCode() {
    var buffer = crypto.randomBytes(3)
    return buffer.toString('hex')
  },
  buildForgotPasswordToken() {
    var buffer = crypto.randomBytes(6)
    return buffer.toString('hex')
  },
  buildJWT() {
    return jwt.sign(this.toJSON(), process.env.JWT_SECRET, { expiresIn: '7d' })
  }
}
schema.pre('save', function (next) {
  this.updatedAt = new Date()
  if (this.email) {
    this.email = this.email.toLowerCase()
  }
  if (!this.isNew) {
    return next()
  } else {
    this.createdAt = this.updatedAt
    next()
  }
})
schema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret.passwordHash
    delete ret.forgotPasswordToken
    delete ret.forgotPasswordAt
    delete ret.confirmationCode
    delete ret.confirmationAt
    return ret
  }
})
schema.virtual('password').set(function (password) {
  this._password = password
  this.passwordHash = bcrypt.hashSync(password, parseInt(process.env.PASSWORD_HASH_SALT))
})
schema.virtual('fullname').get(function () {
  return `${this.firstName} ${this.lastName}`
})

schema.plugin(uniqueValidator, { message: 'User with that email already created. Please login with that email or choose another.' })

// indexes
schema.index({forgotPasswordToken: 1})
schema.index({confirmationCode: 1})
schema.index({type: 1})
schema.index({email: 1})

// Export User model
var User = module.exports = mongoose.model('user', schema)

module.exports.get = (callback, limit) => {
  User.find(callback).limit(limit)
}
