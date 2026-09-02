const mongoose = require('mongoose')
const { PAGE_KEYS } = require('../utils/pageContent')

// One document per marketing page. `data` holds only the admin's overrides;
// the public API merges it on top of the shipped defaults.
const pageContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: PAGE_KEYS,
      index: true
    },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, minimize: false }
)

module.exports = mongoose.model('PageContent', pageContentSchema)
