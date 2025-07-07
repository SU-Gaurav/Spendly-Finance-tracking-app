import { useState, useEffect, useCallback } from 'react'

export const useAccessibility = () => {
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Detect keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setIsKeyboardNavigation(true)
        document.body.classList.add('keyboard-navigation-active')
      }
    }

    const handleMouseDown = () => {
      setIsKeyboardNavigation(false)
      document.body.classList.remove('keyboard-navigation-active')
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Detect user preferences
  useEffect(() => {
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    setHighContrast(contrastQuery.matches)
    setReducedMotion(motionQuery.matches)

    const handleContrastChange = (e) => setHighContrast(e.matches)
    const handleMotionChange = (e) => setReducedMotion(e.matches)

    contrastQuery.addEventListener('change', handleContrastChange)
    motionQuery.addEventListener('change', handleMotionChange)

    return () => {
      contrastQuery.removeEventListener('change', handleContrastChange)
      motionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  // Screen reader announcements
  const announce = useCallback((message, priority = 'polite') => {
    const id = Date.now()
    setAnnouncements(prev => [...prev, { id, message, priority }])
    
    // Clean up old announcements
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id))
    }, 1000)
  }, [])

  // Focus management
  const focusElement = useCallback((selector) => {
    const element = document.querySelector(selector)
    if (element) {
      element.focus()
      return true
    }
    return false
  }, [])

  const trapFocus = useCallback((containerSelector) => {
    const container = document.querySelector(containerSelector)
    if (!container) return null

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return {
    isKeyboardNavigation,
    highContrast,
    reducedMotion,
    announcements,
    announce,
    focusElement,
    trapFocus
  }
}

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      const modifiers = {
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey
      }

      for (const shortcut of shortcuts) {
        const { key: shortcutKey, modifiers: shortcutModifiers = {}, handler } = shortcut
        
        if (key === shortcutKey.toLowerCase()) {
          const modifierMatch = Object.keys(shortcutModifiers).every(
            mod => modifiers[mod] === shortcutModifiers[mod]
          )
          
          if (modifierMatch) {
            e.preventDefault()
            handler(e)
            break
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

export default useAccessibility
