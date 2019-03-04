var _ = require('lodash')
var debug = require('debug')('aim:api')
var logerror = require('debug')('aim:error')

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
    var result = {
      message: error
    }
    return result
  } else {
    var result = {
      ...error,
      message: (error.message) ? error.message : '' + error
    }
    delete result.toJSON
    delete result.result
    return result
  }
}

export const errorResponse = (e, res, normalize = false) => {
  const {
    req
  } = res
  logerror(`${req.method} ${req.baseUrl}`, e, e.stack)
  if (normalize) {
    if (_.isString(e)) {
      res.status(400).json(errorToJson({
        message: e
      }))
    } else {
      res.status(400).json(errorToJson({
        ...e,
        message: normalizeError(e)
      }))
    }
  } else {
    res.status(400).json(errorToJson(e))
  }
}

// this method includes handling for mongoose specific errors with types
const normalizeError = error => {
  if (error.errors) {
    let arr = []
    for (let key of Object.keys(error.errors)) {
      arr.push(error.errors[key].message)
    }
    return `${arr.join(' and ')}`
  }
  return error.message
}
