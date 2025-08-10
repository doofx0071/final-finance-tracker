import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: "At least 8 characters",
    test: (password) => password.length >= 8
  },
  {
    label: "One uppercase letter",
    test: (password) => /[A-Z]/.test(password)
  },
  {
    label: "One lowercase letter",
    test: (password) => /[a-z]/.test(password)
  },
  {
    label: "One number",
    test: (password) => /\d/.test(password)
  },
  {
    label: "One special character (@$!%*?&)",
    test: (password) => /[@$!%*?&]/.test(password)
  }
]

export interface PasswordStrengthIndicatorProps {
  password: string
  showWhenEmpty?: boolean
  className?: string
}

export function PasswordStrengthIndicator({ 
  password, 
  showWhenEmpty = false,
  className 
}: PasswordStrengthIndicatorProps) {
  if (!password && !showWhenEmpty) {
    return null
  }

  const strength = passwordRequirements.filter(req => req.test(password)).length
  const strengthPercentage = (strength / passwordRequirements.length) * 100

  const strengthLabel = 
    strength === 0 ? "Very Weak" :
    strength === 1 ? "Weak" :
    strength === 2 ? "Fair" :
    strength === 3 ? "Good" :
    strength === 4 ? "Strong" :
    "Very Strong"

  const strengthColor = 
    strength === 0 ? "bg-gray-300 dark:bg-gray-600" :
    strength === 1 ? "bg-red-500" :
    strength === 2 ? "bg-orange-500" :
    strength === 3 ? "bg-yellow-500" :
    strength === 4 ? "bg-green-500" :
    "bg-green-600"

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Password strength</span>
          <span className={cn(
            "font-medium",
            strength === 0 ? "text-gray-500 dark:text-gray-400" :
            strength <= 2 ? "text-red-500 dark:text-red-400" :
            strength === 3 ? "text-yellow-500 dark:text-yellow-400" :
            "text-green-500 dark:text-green-400"
          )}>
            {strengthLabel}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-300 ease-out rounded-full",
              strengthColor
            )}
            style={{ width: `${strengthPercentage}%` }}
            role="progressbar"
            aria-valuenow={strength}
            aria-valuemin={0}
            aria-valuemax={passwordRequirements.length}
            aria-label={`Password strength: ${strengthLabel}`}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Password must contain:
        </p>
        <ul className="space-y-1" role="list">
          {passwordRequirements.map((requirement, index) => {
            const isMet = requirement.test(password)
            return (
              <li 
                key={index}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  isMet 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-gray-500 dark:text-gray-400"
                )}
                role="listitem"
              >
                {isMet ? (
                  <Check className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                ) : (
                  <X className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                )}
                <span>{requirement.label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

/**
 * Hook to get password strength
 */
export function usePasswordStrength(password: string) {
  const metRequirements = passwordRequirements.filter(req => req.test(password))
  const strength = metRequirements.length
  const isValid = strength === passwordRequirements.length
  
  return {
    strength,
    isValid,
    metRequirements,
    totalRequirements: passwordRequirements.length
  }
}
