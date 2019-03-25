var _ = require('lodash')
var debug = require('debug')('adattivo:controller-utils')
var logerror = require('debug')('adattivo:error')

const transformQuery = (Model, additionalQuery) => {
  if (!additionalQuery) {
    return null
  }
  let result = {}
  _.each(_.keys(additionalQuery), (key) => {
    const value = additionalQuery[key]
    if (Model.mappedAttributeName) {
      if (key === 'sort') {
        result.sort = Model.mappedAttributeName(value)
      } else {
        const newkey = Model.mappedAttributeName(key)
        result[newkey] = value
      }
    } else {
      result[key] = value
    }
  })
  return result
}
export const paginate = (Model, req, _options = {}, additionalQuery = {}) => {
  const page = parseInt(req.query.page || 1)
  const limit = parseInt(req.query.limit || 5)
  const params = {
    ..._.omit(transformQuery(Model, req.query), 'page', 'limit', 'sort'),
    ...transformQuery(Model, additionalQuery)
  }
  const options = {
    ...transformQuery(Model, _options),
    page,
    limit
  }
  return Model.paginate(params, options)
}

const errorToJson = (error) => {
  if (_.isString(error)) {
    let result = {
      message: error
    }
    return result
  } else {
    let result = {
      message: (error.message) || ('' + error)
    }
    delete result.toJSON
    delete result.result
    return result
  }
}

export const errorResponse = (e, res) => {
  const {
    req
  } = res
  const status = e.status || 400
  var message = ''
  if (_.isString(e)) {
    message = e
  } else if (e.errors) {
    let arr = []
    for (let key of Object.keys(e.errors)) {
      arr.push(e.errors[key].message)
    }
    message = `${arr.join(' and ')}`
  } else {
    message = e.message || ('' + e)
    delete message.toJSON
    delete message.result
  }
  debug(status)
  debug(message)
  logerror(`${req.method} ${req.baseUrl}`, status, message)
  res.status(status).json({ message: message })
}
