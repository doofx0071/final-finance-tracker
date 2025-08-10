import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string | null
}

const FormError = React.forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ className, error, children, ...props }, ref) => {
    if (!error && !children) return null

    return (
      <p
        ref={ref}
        className={cn(
          "text-sm font-medium text-red-500 dark:text-red-400",
          className
        )}
        {...props}
      >
        {error || children}
      </p>
    )
  }
)
FormError.displayName = "FormError"

export { FormError }
