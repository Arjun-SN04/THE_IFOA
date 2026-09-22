const mongoose = require('mongoose')

// A conditional rule: "this field is required / visible only if <fieldId> equals <value>".
// `fieldId` refers to another field in the SAME section.
const conditionSchema = new mongoose.Schema(
  {
    fieldId: { type: String, required: true },
    equals: { type: String, required: true }
  },
  { _id: false }
)

const fieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, default: '' },
    type: {
      type: String,
      required: true,
      enum: [
        'text',
        'email',
        'tel',
        'country',
        'date',
        'textarea',
        'select',
        'radio',
        'checkbox',
        'checkboxGroup',
        'staticText',
        'intake' // options come from the course's own `intakes` list
      ]
    },
    required: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    options: { type: [String], default: undefined },
    content: { type: String, default: undefined }, // staticText body
    order: { type: Number, default: 0 },
    requiredIf: { type: conditionSchema, default: undefined },
    visibleIf: { type: conditionSchema, default: undefined }
  },
  { _id: false }
)

const sectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, default: 0 },
    fields: { type: [fieldSchema], default: [] }
  },
  { _id: false }
)

const formSchemaSchema = new mongoose.Schema(
  {
    // Exactly one document has isTemplate:true - the default cloned into new courses.
    isTemplate: { type: Boolean, default: false, index: true },
    // The course this schema belongs to. Absent on the template.
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      unique: true,
      sparse: true,
      default: undefined
    },
    sections: { type: [sectionSchema], default: [] }
  },
  { timestamps: true }
)

module.exports = mongoose.model('FormSchema', formSchemaSchema)
