import mongoose from 'mongoose'

// Setup schema
var schema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    required: true,
    trim: true,
    default: 'CATEGORY',
    enum: ['CATEGORY', 'VERTICAL', 'BUNDLE']
  },
  key: {
    type: String,
    trim: true,
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

schema.index({ type: -1, sort_order: 1, name: 1 })
schema.index({ active: 1, preferred: 1, sort_order: 1, name: 1 })
schema.index({ type: 1, preferred: 1, sort_order: 1, name: 1 })
schema.index({ key: 1 })
schema.index({ products: 1 })

// Export User model
var Category = module.exports = mongoose.model('category', schema)

module.exports.get = (callback, limit) => {
  Category.find(callback).limit(limit)
}
