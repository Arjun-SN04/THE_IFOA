const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, default: '' },
    line2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  { _id: false }
)

const registrationSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    courseTitle: { type: String, default: '' }, // denormalised so old rows survive course deletion
    courseRefCode: { type: String, default: '' },

    // 1. Personal information
    salutation: { type: String, enum: ['Mr.', 'Ms.', 'Mrs.', ''], default: '' },
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, default: '', trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, default: null },
    age: { type: Number, default: null },
    gender: { type: String, enum: ['Male', 'Female', 'Person with Disability', ''], default: '' },

    fatherName: { type: String, default: '' },
    fatherOccupation: { type: String, default: '' },
    motherName: { type: String, default: '' },
    motherOccupation: { type: String, default: '' },

    permanentAddress: { type: addressSchema, default: () => ({}) },
    sameAsCommunication: { type: Boolean, default: true },
    communicationAddress: { type: addressSchema, default: () => ({}) },

    mobilePhone: { type: String, required: true, trim: true },
    landlinePhone: { type: String, default: '' },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },

    employmentStatus: {
      type: String,
      enum: ['Student', 'Not Employed', 'Employed', 'Self Employed', ''],
      default: ''
    },
    employerName: { type: String, default: '' },
    jobTitle: { type: String, default: '' },

    // 2. Background
    highestQualification: { type: String, default: '' },
    aviationExperience: {
      type: String,
      enum: ['Entry Level', '1-3 Years', '3-5 Years', '5+ Years', ''],
      default: ''
    },
    licenseNumber: { type: String, default: '' },
    sponsoringCompany: { type: String, default: '' },
    notes: { type: String, default: '' },

    consent: { type: Boolean, default: false },

    // Admin workflow
    status: {
      type: String,
      enum: ['new', 'contacted', 'confirmed', 'rejected'],
      default: 'new',
      index: true
    },
    adminNotes: { type: String, default: '' }
  },
  { timestamps: true }
)

registrationSchema.virtual('fullName').get(function fullName() {
  return [this.firstName, this.middleName, this.lastName].filter(Boolean).join(' ')
})

registrationSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Registration', registrationSchema)
