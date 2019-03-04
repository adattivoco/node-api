import mongoose from 'mongoose'

// Setup schema
var schema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    required: true,
    validate: {
      isAsync: true,
      validator: (type, next) => {
        if (type === 'CATEGORY' || type === 'VERTICAL' || type === 'BUNDLE') {
          next(true)
        } else {
          next(false, 'Must be CATEGORY, VERTICAL, OR BUNDLE')
        }
      }
    }
  },
  key: {
    type: String,
    required: true
  },
  summary: String,
  preferred: {
    type: Boolean,
    default: true
  },
  icon: String,
  sort_order: {
    type: Number,
    default: 1
  },
  products: Array,
  u_at: Date,
  c_at: Date
})

// Export User model
var Category = module.exports = mongoose.model('category', schema)

module.exports.get = (callback, limit) => {
  Category.find(callback).limit(limit)
}
