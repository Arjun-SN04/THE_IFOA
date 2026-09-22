// Server-side validation of a submitted `answers` object against a form's
// `sections`. Mirrors the client-side rules in
// frontend/src/components/formEngine/formSchema.js - keep the two in sync.

function isEmpty(field, value) {
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
  const refValue = sectionAnswers ? sectionAnswers[condition.fieldId] : undefined
  if (Array.isArray(refValue)) return refValue.includes(condition.equals)
  return refValue === condition.equals
}

// Locate the (first) intake field so the controller can pull the chosen value
// out of the nested answers for denormalisation onto the submission.
function findIntakeFieldId(sections) {
  for (const section of sections) {
    const field = section.fields.find((f) => f.type === 'intake')
    if (field) return { sectionId: section.id, fieldId: field.id }
  }
  return null
}

function validateAnswers(sections, answers) {
  const errors = []

  for (const section of sections) {
    const sectionAnswers = (answers && answers[section.id]) || {}
    for (const field of section.fields) {
      // `intake` options depend on the course, not the schema - the controller
      // enforces it separately once it knows the course's active intakes.
      if (field.type === 'staticText' || field.type === 'intake') continue
      if (field.visibleIf && !conditionMet(field.visibleIf, sectionAnswers)) continue

      const idLower = String(field.id || '').toLowerCase()
      const isConsentOrAgreement =
        field.type === 'checkbox' &&
        (field.required ||
          idLower.includes('terms') ||
          idLower.includes('consent') ||
          idLower.includes('acknowledgement') ||
          idLower.includes('dataprocessing'))

      const isRequired =
        field.required ||
        (field.requiredIf && conditionMet(field.requiredIf, sectionAnswers)) ||
        isConsentOrAgreement

      if (isRequired && isEmpty(field, sectionAnswers[field.id])) {
        const label = field.label || field.id
        const msg =
          field.type === 'checkbox'
            ? `${section.title}: You must accept "${label.length > 50 ? label.slice(0, 47) + '…' : label}".`
            : `${section.title}: ${label} is required.`
        errors.push(msg)
      }
    }
  }

  return errors
}

module.exports = { validateAnswers, findIntakeFieldId }
