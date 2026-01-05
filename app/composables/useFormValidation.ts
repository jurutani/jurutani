/**
 * Reusable form validation utilities
 * Provides common validation rules and helpers
 */

export interface ValidationRule {
    condition: boolean
    field: string
    message: string
}

export interface ValidationErrors {
    [key: string]: string
}

export const useFormValidation = () => {
    /**
     * Validate URL format
     */
    const isValidUrl = (url: string): boolean => {
        if (!url) return true
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    /**
     * Validate email format
     */
    const isValidEmail = (email: string): boolean => {
        if (!email) return true
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    /**
     * Validate phone number (Indonesian format)
     */
    const isValidPhone = (phone: string): boolean => {
        if (!phone) return true
        // Allow formats: 08xxx, +628xxx, 628xxx
        const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
        return phoneRegex.test(phone.replace(/[\s-]/g, ''))
    }

    /**
     * Validate required field
     */
    const isRequired = (value: any): boolean => {
        if (typeof value === 'string') {
            return value.trim().length > 0
        }
        return value !== null && value !== undefined && value !== ''
    }

    /**
     * Validate minimum length
     */
    const hasMinLength = (value: string, minLength: number): boolean => {
        return value.trim().length >= minLength
    }

    /**
     * Validate maximum length
     */
    const hasMaxLength = (value: string, maxLength: number): boolean => {
        return value.trim().length <= maxLength
    }

    /**
     * Validate number range
     */
    const isInRange = (value: number, min?: number, max?: number): boolean => {
        if (min !== undefined && value < min) return false
        if (max !== undefined && value > max) return false
        return true
    }

    /**
     * Process validation rules and return errors
     */
    const validateRules = (rules: ValidationRule[]): ValidationErrors => {
        const errors: ValidationErrors = {}

        rules.forEach(rule => {
            if (rule.condition) {
                errors[rule.field] = rule.message
            }
        })

        return errors
    }

    /**
     * Check if form has errors
     */
    const hasErrors = (errors: ValidationErrors): boolean => {
        return Object.keys(errors).length > 0
    }

    /**
     * Clear specific field error
     */
    const clearFieldError = (errors: ValidationErrors, field: string): ValidationErrors => {
        const newErrors = { ...errors }
        delete newErrors[field]
        return newErrors
    }

    /**
     * Common validation rule builders
     */
    const rules = {
        required: (field: string, value: any, label?: string): ValidationRule => ({
            condition: !isRequired(value),
            field,
            message: `${label || field} wajib diisi`
        }),

        url: (field: string, value: string, label?: string): ValidationRule => ({
            condition: value && !isValidUrl(value),
            field,
            message: `Format ${label || field} tidak valid`
        }),

        email: (field: string, value: string, label?: string): ValidationRule => ({
            condition: value && !isValidEmail(value),
            field,
            message: `Format ${label || field} tidak valid`
        }),

        phone: (field: string, value: string, label?: string): ValidationRule => ({
            condition: value && !isValidPhone(value),
            field,
            message: `Format ${label || field} tidak valid`
        }),

        minLength: (field: string, value: string, minLength: number, label?: string): ValidationRule => ({
            condition: value && !hasMinLength(value, minLength),
            field,
            message: `${label || field} minimal ${minLength} karakter`
        }),

        maxLength: (field: string, value: string, maxLength: number, label?: string): ValidationRule => ({
            condition: value && !hasMaxLength(value, maxLength),
            field,
            message: `${label || field} maksimal ${maxLength} karakter`
        }),

        range: (field: string, value: number, min?: number, max?: number, label?: string): ValidationRule => ({
            condition: !isInRange(value, min, max),
            field,
            message: `${label || field} harus antara ${min} dan ${max}`
        })
    }

    return {
        // Validators
        isValidUrl,
        isValidEmail,
        isValidPhone,
        isRequired,
        hasMinLength,
        hasMaxLength,
        isInRange,

        // Helpers
        validateRules,
        hasErrors,
        clearFieldError,

        // Rule builders
        rules
    }
}
