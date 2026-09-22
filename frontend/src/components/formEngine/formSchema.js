// Client-side helpers for the dynamic enrollment form. Mirrors the server
// rules in backend/utils/validateAnswers.js - keep the two in sync.

export function emptyValueForField(field) {
  if (field.type === 'checkbox') return false
  if (field.type === 'checkboxGroup') return []
  return ''
}

export function buildEmptyAnswers(sections) {
  const answers = {}
  for (const section of sections) {
    answers[section.id] = {}
    for (const field of section.fields) {
      if (field.type === 'staticText') continue
      answers[section.id][field.id] = emptyValueForField(field)
    }
  }
  return answers
}

export function isFieldEmpty(field, value) {
  if (field.type === 'checkbox') return value !== true
  if (field.type === 'checkboxGroup') return !Array.isArray(value) || value.length === 0
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (typeof value === 'string' && value.trim() === '')
  )
}

function conditionMet(condition, sectionAnswers) {
  const refValue = sectionAnswers?.[condition.fieldId]
  if (Array.isArray(refValue)) return refValue.includes(condition.equals)
  return refValue === condition.equals
}

export function isFieldRequired(field, sectionAnswers) {
  const idLower = String(field.id || '').toLowerCase()
  const isConsentOrAgreement =
    field.type === 'checkbox' &&
    (field.required ||
      idLower.includes('terms') ||
      idLower.includes('consent') ||
      idLower.includes('acknowledgement') ||
      idLower.includes('dataprocessing'))

  return Boolean(
    field.required ||
      (field.requiredIf && conditionMet(field.requiredIf, sectionAnswers)) ||
      isConsentOrAgreement
  )
}

export function isFieldVisible(field, sectionAnswers) {
  return !field.visibleIf || conditionMet(field.visibleIf, sectionAnswers)
}

// A section reads as "Completed" only once its required fields are filled.
export function isSectionComplete(section, sectionAnswers = {}) {
  const fillableFields = section.fields.filter(
    (field) => field.type !== 'staticText' && isFieldVisible(field, sectionAnswers)
  )
  if (fillableFields.length === 0) return false

  const requiredFields = fillableFields.filter((field) => isFieldRequired(field, sectionAnswers))
  if (requiredFields.length > 0) {
    return requiredFields.every((field) => !isFieldEmpty(field, sectionAnswers[field.id]))
  }
  return fillableFields.some((field) => !isFieldEmpty(field, sectionAnswers[field.id]))
}

export function isTrackableSection(section) {
  return section.fields.some((field) => field.type !== 'staticText')
}

export function getSubmissionDisplayName(submission) {
  const sections = submission.formSchemaSnapshot || []
  let firstName
  let surname
  let email

  for (const section of sections) {
    for (const field of section.fields) {
      const val = submission.answers?.[section.id]?.[field.id]
      if (typeof val !== 'string' || !val) continue
      if ((field.id === 'firstName' || field.id === 'first_name') && !firstName) firstName = val
      if ((field.id === 'surname' || field.id === 'lastName') && !surname) surname = val
      if (field.type === 'email' && !email) email = val
    }
  }

  if (firstName || surname) return [firstName, surname].filter(Boolean).join(' ')
  if (email) return email
  return `Submission ${String(submission._id).slice(-6)}`
}

export function getSubmissionQuickInfo(submission) {
  const sections = submission.formSchemaSnapshot || []
  const info = {
    name: getSubmissionDisplayName(submission),
    email: null,
    phone: null,
    citizenship: null,
    passportNumber: null
  }

  for (const section of sections) {
    for (const field of section.fields) {
      const val = submission.answers?.[section.id]?.[field.id]
      if (typeof val !== 'string' || !val) continue
      if (field.type === 'email' && !info.email) info.email = val
      if (field.type === 'tel' && !info.phone) info.phone = val
      if (field.id === 'citizenship' && !info.citizenship) info.citizenship = val
      if (field.id === 'passportNumber' && !info.passportNumber) info.passportNumber = val
    }
  }

  return info
}

export function getSubmissionSearchText(submission) {
  return JSON.stringify(submission.answers || {}).toLowerCase()
}

export function getDetailedValidationErrors(sections, answers) {
  const errors = []

  for (const section of sections) {
    const sectionAnswers = answers?.[section.id] || {}
    for (const field of section.fields) {
      // `intake` is validated against the course's live intakes by the caller.
      if (field.type === 'staticText' || field.type === 'intake') continue
      if (!isFieldVisible(field, sectionAnswers)) continue
      if (isFieldRequired(field, sectionAnswers) && isFieldEmpty(field, sectionAnswers[field.id])) {
        const label = field.label || field.id
        const message =
          field.type === 'checkbox'
            ? `${section.title}: You must accept ${
                label.length > 50 ? label.slice(0, 47) + '…' : label
              }.`
            : `${section.title}: ${label} is required.`
        errors.push({ sectionId: section.id, fieldId: field.id, label, message })
      }
    }
  }

  return errors
}

export function validateSchemaAnswers(sections, answers) {
  return getDetailedValidationErrors(sections, answers).map((e) => e.message)
}
