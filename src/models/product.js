import mongoose from 'mongoose'
const Schema = mongoose.Schema

// Setup schema
var schema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  key: {
    type: String,
    trim: true,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  logo_url: String,
  summary: String,
  sale_type: {
    type: String,
    required: true,
    trim: true,
    default: 'INFORMATIONAL',
    enum: ['RESELLER', 'INFORMATIONAL', 'AFFILIATE']
  },
  price_type: {
    type: String,
    required: true,
    trim: true,
    default: 'COMPANY',
    enum: ['RECURRING', 'ONE_TIME']
  },
  price_options: {
    type: Array,
    default: []
  },
  price_info: String,
  click_thru: String,
  brand_color: {
    type: String,
    trim: true,
    default: '326295'
  },
  expert: {
    name: String,
    quote: String,
    image_url: String
  },
  key_features: {
    platforms: Array,
    support: Array,
    business_size: Array,
    free_trial: Boolean,
    free_plan: Boolean,
    demos: Boolean,
    multiple_price_plans: Boolean,
    locations: Array,
    business_types: Array
  },
  image: {
    _id: Schema.Types.ObjectId,
    attachment_file_name: String,
    attachment_content_type: String,
    attachment_file_size: Number,
    attachment_fingerprint: String,
    attachment_updated_at: Date
  },
  categories: {
    type: Array,
    default: []
  },
  u_at: Date,
  c_at: Date
})
schema.virtual('logo').get(function() {
  var version = 'medium'
  if (!this.image._id) {
    return `${process.env.ASSET_HOST}products/logos/${this.logo_url}`
  } else {
    var path = `${process.env.IMAGE_BUCKET_PATH}/images/${this.image._id}/attachments/${version}.${this.image.attachment_file_name}.`
    if (this.image.attachment_content_type === 'image/png') {
      path = path + 'png'
    } else if (this.image.attachment_content_type === 'image/gif') {
      path = path + 'gif'
    } else if (this.image.attachment_content_type === 'image/jpeg') {
      path = path + 'jpg'
    } else if (this.image.attachment_content_type === 'image/svg+xml') {
      path = path + 'svg'
    } else if (this.image.attachment_content_type === 'image/tiff') {
      path = path + 'tiff'
    }
    return path
  }
})
schema.set('toJSON', { virtuals: true })

// Export Product model
var Product = module.exports = mongoose.model('product', schema)

module.exports.get = (callback, limit) => {
  Product.find(callback).limit(limit)
}
