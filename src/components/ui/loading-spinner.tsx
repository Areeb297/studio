"use client"

/**
 * LoadingSpinner Component
 *
 * A reusable loading spinner component for the Rahah24 ERP application.
 * Uses the brand's teal/cyan primary color with subtle glow effects.
 *
 * @example
 * // Full-screen loading (page transitions)
 * <LoadingSpinner variant="fullscreen" />
 *
 * @example
 * // Inline loading (buttons, sections)
 * <LoadingSpinner size="sm" />
 *
 * @example
 * // Custom size and text
 * <LoadingSpinner size="lg" text="Loading data..." />
 */

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size variant of the spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl"

  /**
   * Display variant
   * - "inline": Renders as inline element (for buttons/sections)
   * - "fullscreen": Renders as full-screen overlay with backdrop
   * @default "inline"
   */
  variant?: "inline" | "fullscreen"

  /**
   * Optional loading text to display below the spinner
   */
  text?: string

  /**
   * Delay before showing the spinner (prevents flicker on fast loads)
   * @default 200ms
   */
  delay?: number
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
}

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
}

export function LoadingSpinner({
  size = "md",
  variant = "inline",
  text,
  delay = 200,
  className,
  ...props
}: LoadingSpinnerProps) {
  const [show, setShow] = React.useState(delay === 0)

  React.useEffect(() => {
    if (delay === 0) return

    const timer = setTimeout(() => {
      setShow(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (!show) {
    return null
  }

  const spinner = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        variant === "inline" ? "inline-flex" : "min-h-screen",
        className
      )}
      {...props}
    >
      <div className="relative">
        {/* Animated glow effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse",
            sizeClasses[size]
          )}
          aria-hidden="true"
        />

        {/* Main spinner */}
        <Loader2
          className={cn(
            "animate-spin text-primary relative z-10",
            sizeClasses[size]
          )}
          role="status"
          aria-label={text || "Loading"}
        />
      </div>

      {text && (
        <p
          className={cn(
            "text-muted-foreground font-medium animate-pulse",
            textSizeClasses[size]
          )}
        >
          {text}
        </p>
      )}

      {/* Screen reader only text */}
      <span className="sr-only">{text || "Loading, please wait..."}</span>
    </div>
  )

  if (variant === "fullscreen") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex flex-col items-center gap-4">
          {/* Rahah24 brand accent - optional "R" logo placeholder */}
          <div className="relative">
            <div
              className={cn(
                "absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse",
                size === "sm" ? "h-12 w-12" : "h-20 w-20"
              )}
              aria-hidden="true"
            />
            <Loader2
              className={cn(
                "animate-spin text-primary relative z-10",
                size === "sm" ? "h-12 w-12" : "h-20 w-20"
              )}
              strokeWidth={2.5}
              role="status"
              aria-label={text || "Loading"}
            />
          </div>

          {text && (
            <p className="text-base text-foreground font-semibold animate-pulse">
              {text}
            </p>
          )}

          <span className="sr-only">{text || "Loading, please wait..."}</span>
        </div>
      </div>
    )
  }

  return spinner
}

LoadingSpinner.displayName = "LoadingSpinner"
