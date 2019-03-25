import User from '../models/user'

var passport = require('passport')
var compose = require('compose-middleware').compose
var debug = require('debug')('adattivo:auth-utils')
var logerror = require('debug')('adattivo:auth-utils:error')
var JwtStrategy = require('passport-jwt').Strategy
var ExtractJwt = require('passport-jwt').ExtractJwt

export const isAuthenticated = () => {
  return compose([
    (req, res, next) => {
      passport.authenticate('jwt', {
        session: false
      }, (err, user, info) => {
        if (err || !user) {
          res.status(401).json({
            message: 'Invalid token'
          })
        } else if (user.status !== 'active' ||
                   (req.params.userId !== user.id && user.type !== 'admin')) {
          res.status(401).json({
            message: 'User not authorized'
          })
        } else {
          req.user = user
          next()
        }
      })(req, res, next)
    }
  ])
}
export const isAdminAuthenticated = () => {
  return compose([
    (req, res, next) => {
      passport.authenticate('jwt', {
        session: false
      }, (err, user, info) => {
        if (err || !user) {
          res.status(401).json({
            message: 'Invalid token'
          })
        } else if (user.status !== 'active' || user.type !== 'admin') {
          res.status(401).json({
            message: 'User not authorized'
          })
        } else {
          req.user = user
          next()
        }
      })(req, res, next)
    }
  ])
}
export const setupAuth = () => {
  var options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  }
  passport.use(new JwtStrategy(options, (jwtPayload, done) => {
    User.findOne({
      _id: jwtPayload._id
    }).then((user) => {
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    }).catch((err) => {
      logerror(err.message, err, err.stack)
      done(null, false)
    })
  }))
}
