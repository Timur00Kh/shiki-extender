/**
 * Form validation utilities
 */

/**
 * Validation rule interface
 */
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
  message?: string
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Form validation class
 */
export class FormValidator {
  private rules: Record<string, ValidationRule[]> = {}

  /**
   * Add validation rules for a field
   */
  addRule(fieldName: string, rule: ValidationRule): this {
    if (!this.rules[fieldName]) {
      this.rules[fieldName] = []
    }
    this.rules[fieldName].push(rule)
    return this
  }

  /**
   * Add multiple validation rules for a field
   */
  addRules(fieldName: string, rules: ValidationRule[]): this {
    rules.forEach(rule => this.addRule(fieldName, rule))
    return this
  }

  /**
   * Validate a single field
   */
  validateField(fieldName: string, value: any): ValidationResult {
    const fieldRules = this.rules[fieldName] || []
    const errors: string[] = []

    for (const rule of fieldRules) {
      const error = this.validateRule(value, rule)
      if (error) {
        errors.push(error)
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate entire form
   */
  validateForm(formData: Record<string, any>): Record<string, ValidationResult> {
    const results: Record<string, ValidationResult> = {}

    for (const fieldName in this.rules) {
      results[fieldName] = this.validateField(fieldName, formData[fieldName])
    }

    return results
  }

  /**
   * Check if form is valid
   */
  isFormValid(formData: Record<string, any>): boolean {
    const results = this.validateForm(formData)
    return Object.values(results).every(result => result.isValid)
  }

  /**
   * Validate a single rule
   */
  private validateRule(value: any, rule: ValidationRule): string | null {
    // Required validation
    if (rule.required && (value === null || value === undefined || value === '')) {
      return rule.message || 'This field is required'
    }

    // Skip other validations if value is empty and not required
    if (!rule.required && (value === null || value === undefined || value === '')) {
      return null
    }

    // Min length validation
    if (rule.minLength !== undefined && typeof value === 'string' && value.length < rule.minLength) {
      return rule.message || `Minimum length is ${rule.minLength} characters`
    }

    // Max length validation
    if (rule.maxLength !== undefined && typeof value === 'string' && value.length > rule.maxLength) {
      return rule.message || `Maximum length is ${rule.maxLength} characters`
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message || 'Invalid format'
    }

    // Custom validation
    if (rule.custom) {
      const result = rule.custom(value)
      if (result === false) {
        return rule.message || 'Invalid value'
      }
      if (typeof result === 'string') {
        return result
      }
    }

    return null
  }
}

/**
 * Common validation rules
 */
export const CommonRules = {
  required: (message?: string): ValidationRule => ({
    required: true,
    message: message || 'This field is required'
  }),

  email: (message?: string): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: message || 'Please enter a valid email address'
  }),

  url: (message?: string): ValidationRule => ({
    pattern: /^https?:\/\/.+/,
    message: message || 'Please enter a valid URL'
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message: message || `Minimum length is ${length} characters`
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message: message || `Maximum length is ${length} characters`
  }),

  numeric: (message?: string): ValidationRule => ({
    pattern: /^\d+$/,
    message: message || 'Please enter a valid number'
  }),

  alphanumeric: (message?: string): ValidationRule => ({
    pattern: /^[a-zA-Z0-9]+$/,
    message: message || 'Please enter only letters and numbers'
  })
}

/**
 * Link validation rules
 */
export const LinkValidationRules = {
  title: [
    CommonRules.required('Title is required'),
    CommonRules.minLength(1, 'Title cannot be empty'),
    CommonRules.maxLength(200, 'Title is too long')
  ],

  link: [
    CommonRules.required('Link is required'),
    CommonRules.url('Please enter a valid URL')
  ],

  description: [
    CommonRules.maxLength(1000, 'Description is too long')
  ]
}

/**
 * Create validator for links
 */
export function createLinkValidator(): FormValidator {
  const validator = new FormValidator()
  
  validator.addRules('title', LinkValidationRules.title)
  validator.addRules('link', LinkValidationRules.link)
  validator.addRules('description', LinkValidationRules.description)

  return validator
}

/**
 * Validate link object
 */
export function validateLink(link: any): ValidationResult {
  const validator = createLinkValidator()
  const results = validator.validateForm(link)
  
  const allErrors: string[] = []
  let isValid = true

  for (const fieldName in results) {
    const result = results[fieldName]
    if (!result.isValid) {
      isValid = false
      allErrors.push(...result.errors)
    }
  }

  return {
    isValid,
    errors: allErrors
  }
}

/**
 * Sanitize input value
 */
export function sanitizeInput(value: string): string {
  return value
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
}

/**
 * Validate and sanitize form data
 */
export function validateAndSanitizeForm(
  formData: Record<string, any>,
  validator: FormValidator
): { data: Record<string, any>, errors: Record<string, string[]> } {
  const sanitizedData: Record<string, any> = {}
  const errors: Record<string, string[]> = {}

  // Sanitize string values
  for (const key in formData) {
    const value = formData[key]
    if (typeof value === 'string') {
      sanitizedData[key] = sanitizeInput(value)
    } else {
      sanitizedData[key] = value
    }
  }

  // Validate
  const validationResults = validator.validateForm(sanitizedData)
  
  for (const fieldName in validationResults) {
    const result = validationResults[fieldName]
    if (!result.isValid) {
      errors[fieldName] = result.errors
    }
  }

  return { data: sanitizedData, errors }
}

/**
 * Debounce validation function
 */
export function debounceValidation<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}