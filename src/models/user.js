import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

// Setup schema
var schema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password_digest: {
    type: String,
    required: true
  },
  _type: {
    type: String,
    required: true,
    default: 'CompanyUser'
  },
  auth_token: String,
  reset_password_token: String,
  reset_password_sent_at: Date,
  sign_in_count: {
    type: Number,
    default: 0
  },
  last_sign_in_at: Date,
  u_at: Date,
  c_at: Date
})
schema.methods = {
  authenticate(password) {
    return bcrypt.compare(password, this.passwordHash).then((result) => {
      if (result) {
        return Promise.resolve()
      } else {
        return Promise.reject()
      }
    })
  },
  authorize(authToken) {
    return this.auth_token === authToken
  }
}
schema.pre('save', function (next) {
  this.u_at = new Date()
  if (this.email) {
    this.email = this.email.toLowerCase()
  }
  if (!this.isNew) {
    return next()
  } else {
    this.c_at = this.u_at
    next()
  }
})
schema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    delete ret.password_digest
    delete ret.auth_token
    delete ret.reset_password_token
    delete ret.reset_password_sent_at
    return ret
  }
})
schema.virtual('password').set(function (password) {
  this._password = password
  this.password_digest = bcrypt.hashSync(password, parseInt(process.env.PASSWORD_HASH_SALT))
})
// Export User model
var User = module.exports = mongoose.model('user', schema)

module.exports.get = (callback, limit) => {
  User.find(callback).limit(limit)
}
