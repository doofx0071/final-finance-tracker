import {
  loginSchema,
  registrationSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  updateProfileSchema,
} from './auth'

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate valid login credentials', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }
      const result = loginSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address')
      }
    })

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
        password: 'password123',
      }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is required')
      }
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      }
      const result = loginSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required')
      }
    })
  })

  describe('registrationSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      }
      const result = registrationSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject weak password (no uppercase)', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123!',
        confirmPassword: 'password123!',
        firstName: 'John',
        lastName: 'Doe',
      }
      const result = registrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Password must contain')
      }
    })

    it('should reject weak password (no lowercase)', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'PASSWORD123!',
        confirmPassword: 'PASSWORD123!',
        firstName: 'John',
        lastName: 'Doe',
      }
      const result = registrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject weak password (no number)', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password!',
        confirmPassword: 'Password!',
        firstName: 'John',
        lastName: 'Doe',
      }
      const result = registrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject weak password (no special character)', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
      }
      const result = registrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Pa1!',
        confirmPassword: 'Pa1!',
        firstName: 'John',
        lastName: 'Doe',
      }
      const result = registrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters')
      }
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password456!',
        firstName: 'John',
        lastName: 'Doe',
      }
      const result = registrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match")
      }
    })

    it('should reject empty first name', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: '',
        lastName: 'Doe',
      }
      const result = registrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === 'First name is required')).toBe(true)
      }
    })

    it('should reject too long first name', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'A'.repeat(51),
        lastName: 'Doe',
      }
      const result = registrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === 'First name is too long')).toBe(true)
      }
    })

    it('should reject empty last name', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: '',
      }
      const result = registrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.message === 'Last name is required')).toBe(true)
      }
    })

    it('should reject duplicate email format validation', () => {
      // This tests the email format, actual duplicate check would be done at database level
      const invalidData = {
        email: 'not.an.email',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
      }
      const result = registrationSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('passwordResetRequestSchema', () => {
    it('should validate valid email', () => {
      const validData = {
        email: 'test@example.com',
      }
      const result = passwordResetRequestSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
      }
      const result = passwordResetRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty email', () => {
      const invalidData = {
        email: '',
      }
      const result = passwordResetRequestSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('passwordResetSchema', () => {
    it('should validate valid password reset', () => {
      const validData = {
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      }
      const result = passwordResetSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject weak new password', () => {
      const invalidData = {
        password: 'weak',
        confirmPassword: 'weak',
      }
      const result = passwordResetSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject mismatched new passwords', () => {
      const invalidData = {
        password: 'NewPassword123!',
        confirmPassword: 'DifferentPassword123!',
      }
      const result = passwordResetSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Passwords don't match")
      }
    })
  })

  describe('updateProfileSchema', () => {
    it('should validate valid profile update', () => {
      const validData = {
        firstName: 'Jane',
        lastName: 'Smith',
      }
      const result = updateProfileSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should validate profile update with optional email', () => {
      const validData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      }
      const result = updateProfileSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email in profile update', () => {
      const invalidData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'invalid-email',
      }
      const result = updateProfileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty first name in profile update', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Smith',
      }
      const result = updateProfileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty last name in profile update', () => {
      const invalidData = {
        firstName: 'Jane',
        lastName: '',
      }
      const result = updateProfileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
