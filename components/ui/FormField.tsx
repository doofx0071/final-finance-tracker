import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "./Label"
import { Input, type InputProps } from "./Input"
import { FormError } from "./FormError"

export interface FormFieldProps extends Omit<InputProps, 'error'> {
  label: string
  error?: string | null
  hint?: string
  required?: boolean
  showRequiredIndicator?: boolean
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    label, 
    error, 
    hint, 
    required = false,
    showRequiredIndicator = true,
    id,
    className,
    disabled,
    ...props 
  }, ref) => {
    // Generate ID if not provided
    const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`
    const errorId = `${fieldId}-error`
    const hintId = hint ? `${fieldId}-hint` : undefined
    
    // Combine aria-describedby for error and hint
    const ariaDescribedBy = [
      error ? errorId : null,
      hint ? hintId : null
    ].filter(Boolean).join(' ') || undefined

    return (
      <div className="space-y-2">
        <Label 
          htmlFor={fieldId}
          className={cn(
            "flex items-center gap-1",
            disabled && "opacity-70 cursor-not-allowed"
          )}
        >
          {label}
          {required && showRequiredIndicator && (
            <span className="text-red-500 dark:text-red-400" aria-label="required">
              *
            </span>
          )}
        </Label>
        
        <Input
          ref={ref}
          id={fieldId}
          error={!!error}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
          className={className}
          {...props}
        />
        
        {hint && !error && (
          <p 
            id={hintId}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {hint}
          </p>
        )}
        
        {error && (
          <FormError 
            id={errorId}
            error={error}
            role="alert"
            aria-live="polite"
          />
        )}
      </div>
    )
  }
)

FormField.displayName = "FormField"

export { FormField }
