import React from 'react'
import { motion } from 'framer-motion'
import useAccessibility from '../hooks/useAccessibility'

// Screen Reader Announcements Component
export const ScreenReaderAnnouncements = () => {
  const { announcements } = useAccessibility()

  return (
    <div className="sr-only">
      {announcements.map(({ id, message, priority }) => (
        <div key={id} aria-live={priority} aria-atomic="true">
          {message}
        </div>
      ))}
    </div>
  )
}

// Skip Navigation Link
export const SkipLink = ({ href = "#main-content", children = "Skip to main content" }) => (
  <a href={href} className="skip-link">
    {children}
  </a>
)

// Accessible Button with proper focus and states
export const AccessibleButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ariaLabel,
  ariaDescribedBy,
  className = '',
  ...props 
}) => {
  const { reducedMotion } = useAccessibility()

  const baseClasses = 'btn interactive'
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost'
  }
  
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3',
    large: 'px-6 py-4 text-lg'
  }

  const buttonClasses = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]}
    ${className}
  `.trim()

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={buttonClasses}
      whileHover={!reducedMotion && !disabled ? { scale: 1.02 } : {}}
      whileTap={!reducedMotion && !disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && (
        <div className="loading-spinner" aria-hidden="true" />
      )}
      {children}
    </motion.button>
  )
}

// Accessible Input with proper labeling
export const AccessibleInput = ({
  label,
  id,
  error,
  helpText,
  required = false,
  type = 'text',
  className = '',
  ...props
}) => {
  const errorId = error ? `${id}-error` : undefined
  const helpId = helpText ? `${id}-help` : undefined
  const describedBy = [errorId, helpId].filter(Boolean).join(' ')

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-primary">
        {label}
        {required && <span className="text-error ml-1" aria-label="required">*</span>}
      </label>
      
      <input
        id={id}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy || undefined}
        className={`form-input w-full ${error ? 'error-border' : ''} ${className}`}
        {...props}
      />
      
      {helpText && (
        <div id={helpId} className="text-sm text-muted">
          {helpText}
        </div>
      )}
      
      {error && (
        <div id={errorId} className="error-text" role="alert">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}

// Accessible Modal/Dialog
export const AccessibleModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  className = '' 
}) => {
  const { trapFocus, announce } = useAccessibility()
  const modalId = React.useId()
  const titleId = `${modalId}-title`

  React.useEffect(() => {
    if (isOpen) {
      announce(`Dialog opened: ${title}`)
      const cleanup = trapFocus(`#${modalId}`)
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden'
      
      return () => {
        cleanup?.()
        document.body.style.overflow = ''
        announce('Dialog closed')
      }
    }
  }, [isOpen, title, trapFocus, announce])

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-full mx-4'
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <motion.div
        id={modalId}
        className={`
          relative w-full ${sizeClasses[size]} 
          bg-card border border-border-primary rounded-xl 
          shadow-xl max-h-[90vh] overflow-auto
          ${className}
        `}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-primary">
          <h2 id={titleId} className="text-xl font-semibold text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-card-hover transition-colors focus-ring"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

// Accessible Toast Notification
export const AccessibleToast = ({ 
  message, 
  type = 'info', 
  duration = 5000,
  onClose 
}) => {
  const { announce } = useAccessibility()

  React.useEffect(() => {
    announce(message, type === 'error' ? 'assertive' : 'polite')
    
    if (duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [message, type, duration, onClose, announce])

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  }

  return (
    <motion.div
      className={`toast ${type}`}
      role="alert"
      aria-live="polite"
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-2 p-1 rounded hover:bg-black/10 transition-colors focus-ring"
        aria-label="Dismiss notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}

// Loading State Component
export const LoadingState = ({ 
  size = 'medium', 
  message = 'Loading...', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      <div 
        className={`loading-spinner ${sizeClasses[size]}`}
        aria-hidden="true"
      />
      <span className="sr-only">{message}</span>
      {size !== 'small' && (
        <span className="text-muted">{message}</span>
      )}
    </div>
  )
}

export default {
  ScreenReaderAnnouncements,
  SkipLink,
  AccessibleButton,
  AccessibleInput,
  AccessibleModal,
  AccessibleToast,
  LoadingState
}
