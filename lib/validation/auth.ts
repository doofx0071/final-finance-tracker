import { z } from 'zod'

// Email validation
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

// Password validation
const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  )

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

// Registration schema
export const registrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Keep backward compatibility
export const registerSchema = registrationSchema

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
})

// Keep backward compatibility
export const resetRequestSchema = passwordResetRequestSchema

// Password reset schema
export const passwordResetSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Keep backward compatibility
export const resetPasswordSchema = passwordResetSchema

// Update profile schema
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: emailSchema.optional(),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
export type ResetRequestInput = z.infer<typeof resetRequestSchema>
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
