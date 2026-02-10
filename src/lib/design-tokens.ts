/**
 * Design Tokens for MoneyPilot PWA
 * 
 * Centralized design system tokens for colors, spacing, typography, and more.
 * All components should reference these tokens for consistency.
 */

export const designTokens = {
  // Colors - Dark "Carbon" Theme
  colors: {
    // Base colors
    background: '#09090b',
    foreground: '#ffffff',
    
    // Card colors
    card: '#18181b',
    cardForeground: '#ffffff',
    cardBorder: '#27272a',
    
    // Primary (Neon Green)
    primary: '#22c55e',
    primaryForeground: '#000000',
    primaryHover: '#16a34a',
    primaryActive: '#15803d',
    
    // Secondary
    secondary: '#27272a',
    secondaryForeground: '#ffffff',
    secondaryHover: '#3f3f46',
    
    // Accent (Violet/Purple)
    accent: '#8b5cf6',
    accentForeground: '#ffffff',
    
    // Destructive/Error
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    destructiveHover: '#dc2626',
    
    // Success
    success: '#22c55e',
    successForeground: '#000000',
    successBg: 'rgba(34, 197, 94, 0.1)',
    
    // Warning
    warning: '#eab308',
    warningForeground: '#000000',
    warningBg: 'rgba(234, 179, 8, 0.1)',
    
    // Error
    error: '#ef4444',
    errorForeground: '#ffffff',
    errorBg: 'rgba(239, 68, 68, 0.1)',
    
    // Info
    info: '#3b82f6',
    infoForeground: '#ffffff',
    infoBg: 'rgba(59, 130, 246, 0.1)',
    
    // Muted
    muted: '#71717a',
    mutedForeground: '#a1a1aa',
    
    // Border & Input
    border: '#27272a',
    input: '#27272a',
    ring: '#22c55e',
    
    // Zinc scale (for various UI elements)
    zinc: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
      950: '#09090b',
    },
  },
  
  // Spacing (8pt grid system)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans), system-ui, sans-serif',
      mono: 'var(--font-geist-mono), monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.25rem',    // 20px
      xl: '1.5rem',     // 24px
      '2xl': '2rem',    // 32px
      '3xl': '2.5rem',  // 40px
      '4xl': '3rem',    // 48px
      '5xl': '3.75rem', // 60px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    primary: '0 0 8px 2px rgba(34, 197, 94, 0.5)',
    none: 'none',
  },
  
  // Transitions
  transitions: {
    fast: '120ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
} as const;

// Type exports for TypeScript
export type DesignTokens = typeof designTokens;
export type ColorToken = keyof typeof designTokens.colors;
export type SpacingToken = keyof typeof designTokens.spacing;
export type FontSizeToken = keyof typeof designTokens.typography.fontSize;
export type BorderRadiusToken = keyof typeof designTokens.borderRadius;
export type ShadowToken = keyof typeof designTokens.shadows;
