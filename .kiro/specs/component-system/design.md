# Design Document: Component System

## Overview

The MoneyPilot component system provides a comprehensive library of reusable UI components built with React 19, TypeScript, Tailwind CSS v4, and Framer Motion. The system eliminates code duplication, ensures design consistency, and accelerates feature development by providing fully typed, accessible components that integrate seamlessly with the existing Carbon dark theme.

The component system follows these core principles:

1. **Composition over Configuration**: Components are designed to be composed together rather than configured with dozens of props
2. **Type Safety First**: All components are fully typed with TypeScript for excellent developer experience
3. **Accessibility by Default**: ARIA attributes, keyboard navigation, and focus management are built into every component
4. **Design Token Integration**: All styling uses centralized design tokens from globals.css
5. **Animation Ready**: Framer Motion integration for smooth, performant animations
6. **Variant Management**: CVA (class-variance-authority) for type-safe variant handling

## Architecture

### Component Organization

```
src/
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── modal.tsx
│       ├── select.tsx
│       ├── textarea.tsx
│       ├── checkbox.tsx
│       ├── radio.tsx
│       ├── spinner.tsx
│       ├── skeleton.tsx
│       ├── progress.tsx
│       ├── toast.tsx
│       ├── dropdown.tsx
│       └── tabs.tsx
├── lib/
│   ├── cn.ts (existing)
│   ├── design-tokens.ts (new)
│   └── hooks/
│       ├── use-toast.ts
│       ├── use-focus-trap.ts
│       └── use-click-outside.ts
└── app/
    └── globals.css (existing, with design tokens)
```

### Technology Stack

- **React 19**: Latest React features including automatic batching and improved TypeScript support
- **TypeScript**: Full type safety across all components
- **Tailwind CSS v4**: Utility-first CSS with design token integration
- **CVA**: Type-safe variant management
- **Framer Motion**: Declarative animations and transitions
- **Lucide React**: Consistent icon system
- **clsx + tailwind-merge**: Conditional class name handling (via existing cn utility)

### Design Token System

The design token system extends the existing globals.css CSS custom properties and provides a TypeScript interface for type-safe access:

```typescript
// lib/design-tokens.ts
export const designTokens = {
  colors: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    card: 'var(--card)',
    cardForeground: 'var(--card-foreground)',
    cardBorder: 'var(--card-border)',
    primary: 'var(--primary)',
    primaryForeground: 'var(--primary-foreground)',
    secondary: 'var(--secondary)',
    secondaryForeground: 'var(--secondary-foreground)',
    accent: 'var(--accent)',
    accentForeground: 'var(--accent-foreground)',
    destructive: 'var(--destructive)',
    destructiveForeground: 'var(--destructive-foreground)',
    muted: 'var(--muted)',
    mutedForeground: 'var(--muted-foreground)',
    border: 'var(--border)',
    input: 'var(--input)',
    ring: 'var(--ring)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    full: '9999px',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
} as const;

export type DesignTokens = typeof designTokens;
```

## Components and Interfaces

### 1. Button Component

The Button component provides a flexible, accessible button with multiple variants and states.

**Interface:**

```typescript
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-11 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

**Key Features:**
- CVA-based variant management for type-safe props
- Loading state with spinner integration
- Icon support (left/right positioning)
- Full-width option for mobile layouts
- Disabled state handling
- Focus ring using design tokens

### 2. Input Component

The Input component provides a comprehensive form input with label, error, and helper text support.

**Interface:**

```typescript
import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
```

**Key Features:**
- Label with required indicator
- Error state with message display
- Helper text for additional context
- Prefix/suffix icon support
- Focus ring using design tokens
- Proper label association for accessibility

**Structure:**

```
<div className="space-y-2">
  {label && <label htmlFor={id}>{label}{required && '*'}</label>}
  <div className="relative">
    {leftIcon && <span className="absolute left-3">{leftIcon}</span>}
    <input className={cn(baseStyles, error && errorStyles, leftIcon && 'pl-10')} />
    {rightIcon && <span className="absolute right-3">{rightIcon}</span>}
  </div>
  {error && <p className="text-destructive text-sm">{error}</p>}
  {helperText && <p className="text-muted-foreground text-sm">{helperText}</p>}
</div>
```

### 3. Card Component

The Card component provides a consistent container with the glass-panel aesthetic from the Carbon theme.

**Interface:**

```typescript
import { HTMLAttributes, ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';

interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
}

const cardVariants = cva(
  'rounded-[2rem] bg-card border border-card-border transition-all',
  {
    variants: {
      padding: {
        default: 'p-6',
        compact: 'p-4',
        none: 'p-0',
      },
    },
    defaultVariants: {
      padding: 'default',
    },
  }
);
```

**Key Features:**
- Glass-panel styling from existing theme
- Optional header and footer sections
- Hover state with elevation change
- Clickable variant with cursor pointer
- Framer Motion integration for entrance animations

### 4. Badge Component

The Badge component provides status indicators with multiple variants.

**Interface:**

```typescript
import { HTMLAttributes, ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  children: ReactNode;
  icon?: ReactNode;
}

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-medium',
  {
    variants: {
      variant: {
        success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        error: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        info: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
      },
      shape: {
        pill: 'rounded-full',
        square: 'rounded-md',
      },
    },
    defaultVariants: {
      variant: 'info',
      size: 'sm',
      shape: 'pill',
    },
  }
);
```

### 5. Modal Component

The Modal component provides an accessible dialog with focus trap and animations.

**Interface:**

```typescript
import { ReactNode } from 'react';
import { VariantProps } from 'class-variance-authority';

interface ModalProps extends VariantProps<typeof modalVariants> {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

const modalVariants = cva(
  'bg-card border border-card-border rounded-2xl shadow-xl',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
```

**Key Features:**
- Focus trap using custom hook
- Body scroll lock when open
- Escape key handling
- Overlay click handling
- Framer Motion animations (fade + scale)
- ARIA attributes (role="dialog", aria-modal="true")

**Animation Pattern:**

```typescript
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(modalVariants({ size }))}
      >
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### 6. Select Component

The Select component provides a custom-styled dropdown that matches the Carbon theme.

**Interface:**

```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  searchable?: boolean;
}
```

**Key Features:**
- Custom dropdown with keyboard navigation
- Search/filter for long lists
- Disabled state for component and options
- Error state styling
- Click-outside handling
- ARIA attributes (role="combobox", aria-expanded)

### 7. Form Components (Textarea, Checkbox, Radio)

**Textarea Interface:**

```typescript
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  autoResize?: boolean;
}
```

**Checkbox Interface:**

```typescript
interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}
```

**Radio Interface:**

```typescript
interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
```

**Key Features:**
- Textarea with auto-resize option
- Checkbox with indeterminate state
- Custom styling matching Carbon theme
- Proper label association
- ARIA attributes

### 8. Loading State Components

**Spinner Interface:**

```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Skeleton Interface:**

```typescript
interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rectangle';
  width?: string;
  height?: string;
  className?: string;
}
```

**Progress Interface:**

```typescript
interface ProgressProps {
  value?: number; // 0-100
  indeterminate?: boolean;
  className?: string;
}
```

**Key Features:**
- Spinner with CSS animation
- Skeleton with pulse animation
- Progress bar with determinate/indeterminate modes
- Design token integration

### 9. Toast Notification System

**Interface:**

```typescript
interface Toast {
  id: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: () => void;
}

// Hook interface
function useToast() {
  return {
    toast: (options: Omit<Toast, 'id'>) => void;
    dismiss: (id: string) => void;
    dismissAll: () => void;
  };
}
```

**Architecture:**
- Context-based state management
- Custom hook for triggering toasts
- Fixed positioning (top-right by default)
- Auto-dismiss with configurable duration
- Stacking support with animations
- ARIA live regions for screen readers

**Usage Pattern:**

```typescript
const { toast } = useToast();

toast({
  variant: 'success',
  title: 'Transaction added',
  description: 'Your transaction has been saved successfully',
  duration: 3000,
});
```

### 10. Dropdown Menu Component

**Interface:**

```typescript
interface DropdownMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'danger';
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: (DropdownMenuItem | 'divider')[];
  align?: 'start' | 'center' | 'end';
}
```

**Key Features:**
- Click-outside handling
- Escape key handling
- Keyboard navigation (arrow keys)
- Collision detection for positioning
- Icon support
- Dividers for grouping
- ARIA attributes (role="menu", role="menuitem")

### 11. Tabs Component

**Interface:**

```typescript
interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  value?: string;
  onChange?: (tabId: string) => void;
  orientation?: 'horizontal' | 'vertical';
}
```

**Key Features:**
- Controlled and uncontrolled modes
- Keyboard navigation (arrow keys)
- Animated indicator using Framer Motion
- Horizontal and vertical orientations
- ARIA attributes (role="tablist", role="tab", role="tabpanel")

## Data Models

### Component Prop Types

All component props extend native HTML element types to ensure full compatibility with standard attributes:

```typescript
// Button extends native button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { ... }

// Input extends native input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { ... }

// Card extends native div
interface CardProps extends HTMLAttributes<HTMLDivElement> { ... }
```

### Variant Type System

CVA provides type-safe variant management:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(baseStyles, { variants, defaultVariants });

// Extract variant types
type ButtonVariantProps = VariantProps<typeof buttonVariants>;

// Use in component props
interface ButtonProps extends ButtonVariantProps {
  // variant and size are now typed as string literals
}
```

### Toast State Model

```typescript
interface ToastState {
  toasts: Toast[];
}

type ToastAction =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'REMOVE_TOAST'; id: string }
  | { type: 'REMOVE_ALL_TOASTS' };

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [...state.toasts, action.toast] };
    case 'REMOVE_TOAST':
      return { toasts: state.toasts.filter(t => t.id !== action.id) };
    case 'REMOVE_ALL_TOASTS':
      return { toasts: [] };
  }
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Button Component Properties

**Property 1: Button variant rendering**
*For any* Button component with variant prop set to 'primary', 'secondary', 'ghost', or 'danger', the rendered button should have the corresponding CSS classes for that variant.
**Validates: Requirements 1.1**

**Property 2: Button size rendering**
*For any* Button component with size prop set to 'sm', 'md', or 'lg', the rendered button should have the corresponding height and padding classes for that size.
**Validates: Requirements 1.2**

**Property 3: Button disabled state**
*For any* Button component with disabled prop set to true, the button should have the disabled attribute, opacity-50 class, and pointer-events-none class.
**Validates: Requirements 1.3, 1.5**

**Property 4: Button loading state**
*For any* Button component with isLoading prop set to true, the button should render a Spinner component as a child.
**Validates: Requirements 1.4**

**Property 5: Button full-width**
*For any* Button component with fullWidth prop set to true, the button should have the w-full class.
**Validates: Requirements 1.7**

### Input Component Properties

**Property 6: Input type support**
*For any* Input component with type prop set to 'text', 'email', 'password', 'number', or 'tel', the underlying input element should have that type attribute.
**Validates: Requirements 2.1**

**Property 7: Input error display**
*For any* Input component with error prop containing a string, the component should render an error message element with text-destructive class containing that string.
**Validates: Requirements 2.2**

**Property 8: Input helper text display**
*For any* Input component with helperText prop containing a string, the component should render a helper text element with text-muted-foreground class containing that string.
**Validates: Requirements 2.3**

**Property 9: Input required indicator**
*For any* Input component with both label and required props set to true, the label should contain an asterisk character.
**Validates: Requirements 2.4**

**Property 10: Input icon rendering**
*For any* Input component with leftIcon or rightIcon prop, the component should render the icon in the appropriate position (left or right) relative to the input field.
**Validates: Requirements 2.6**

### Card Component Properties

**Property 11: Card glass-panel styling**
*For any* Card component, the rendered element should have bg-card and border-card-border classes.
**Validates: Requirements 3.1**

**Property 12: Card padding variants**
*For any* Card component with padding prop set to 'default', 'compact', or 'none', the component should have the corresponding padding class (p-6, p-4, or p-0).
**Validates: Requirements 3.2**

**Property 13: Card header and footer**
*For any* Card component with header or footer props, the component should render those elements in separate sections with appropriate spacing.
**Validates: Requirements 3.3**

**Property 14: Card clickable state**
*For any* Card component with clickable prop set to true, the component should have cursor-pointer class.
**Validates: Requirements 3.5**

### Badge Component Properties

**Property 15: Badge variant rendering**
*For any* Badge component with variant prop set to 'success', 'warning', 'error', or 'info', the component should have the corresponding color classes for that variant.
**Validates: Requirements 4.1**

**Property 16: Badge size rendering**
*For any* Badge component with size prop set to 'sm' or 'md', the component should have the corresponding text size and padding classes.
**Validates: Requirements 4.2**

**Property 17: Badge shape rendering**
*For any* Badge component with shape prop set to 'pill' or 'square', the component should have the corresponding border radius class (rounded-full or rounded-md).
**Validates: Requirements 4.3**

**Property 18: Badge icon rendering**
*For any* Badge component with icon prop, the component should render the icon before the text content.
**Validates: Requirements 4.5**

### Modal Component Properties

**Property 19: Modal focus trap**
*For any* Modal component with isOpen set to true, pressing Tab should cycle focus only through elements within the modal, not elements outside it.
**Validates: Requirements 5.1**

**Property 20: Modal body scroll lock**
*For any* Modal component with isOpen set to true, the body element should have overflow-hidden style applied.
**Validates: Requirements 5.2**

**Property 21: Modal escape key handling**
*For any* Modal component with isOpen set to true and closeOnEscape not set to false, pressing the Escape key should trigger the onClose callback.
**Validates: Requirements 5.3**

**Property 22: Modal overlay click handling**
*For any* Modal component with isOpen set to true and closeOnOverlayClick not set to false, clicking the overlay should trigger the onClose callback.
**Validates: Requirements 5.4**

**Property 23: Modal size variants**
*For any* Modal component with size prop set to 'sm', 'md', or 'lg', the modal content should have the corresponding max-width class.
**Validates: Requirements 5.6**

**Property 24: Modal ARIA attributes**
*For any* Modal component with isOpen set to true, the modal element should have role="dialog" and aria-modal="true" attributes.
**Validates: Requirements 5.11**

### Select Component Properties

**Property 25: Select placeholder display**
*For any* Select component with no value and a placeholder prop, the trigger should display the placeholder text.
**Validates: Requirements 6.1**

**Property 26: Select dropdown opening**
*For any* Select component that is not disabled, clicking the trigger should open the dropdown menu.
**Validates: Requirements 6.2**

**Property 27: Select option selection**
*For any* Select component with an open dropdown, clicking a non-disabled option should call onChange with that option's value and close the dropdown.
**Validates: Requirements 6.3**

**Property 28: Select search functionality**
*For any* Select component with searchable set to true, typing in the search input should filter the visible options to only those whose labels contain the search text.
**Validates: Requirements 6.4**

**Property 29: Select disabled state**
*For any* Select component with disabled set to true, clicking the trigger should not open the dropdown.
**Validates: Requirements 6.5**

### Form Component Properties

**Property 30: Textarea auto-resize**
*For any* Textarea component with autoResize set to true, changing the content should adjust the textarea height to fit the content without scrolling.
**Validates: Requirements 7.2**

**Property 31: Checkbox indeterminate state**
*For any* Checkbox component with indeterminate set to true, the checkbox should display an indeterminate indicator (dash) instead of a checkmark.
**Validates: Requirements 7.3**

**Property 32: Checkbox label click target**
*For any* Checkbox component with a label, clicking the label text should toggle the checkbox checked state.
**Validates: Requirements 7.4**

**Property 33: Radio label click target**
*For any* Radio component with a label, clicking the label text should select the radio button.
**Validates: Requirements 7.6**

### Loading Component Properties

**Property 34: Spinner size variants**
*For any* Spinner component with size prop set to 'sm', 'md', or 'lg', the spinner should have the corresponding width and height classes.
**Validates: Requirements 8.1**

**Property 35: Spinner animation**
*For any* Spinner component, the rendered element should have an animation class (animate-spin or equivalent).
**Validates: Requirements 8.2**

**Property 36: Skeleton variant rendering**
*For any* Skeleton component with variant prop set to 'text', 'circle', or 'rectangle', the component should have the corresponding shape classes.
**Validates: Requirements 8.4**

**Property 37: Skeleton pulse animation**
*For any* Skeleton component, the rendered element should have animate-pulse class.
**Validates: Requirements 8.5**

**Property 38: Progress value display**
*For any* Progress component with value prop set to a number between 0 and 100, the progress bar should have width set to that percentage.
**Validates: Requirements 8.6**

**Property 39: Progress indeterminate mode**
*For any* Progress component with indeterminate set to true, the progress bar should have an animation class for continuous movement.
**Validates: Requirements 8.7**

### Toast System Properties

**Property 40: Toast variant rendering**
*For any* toast triggered with variant 'success', 'error', 'warning', or 'info', the toast should render with the corresponding color classes.
**Validates: Requirements 9.1**

**Property 41: Toast fixed positioning**
*For any* toast container, it should have fixed positioning classes (fixed top-4 right-4 or similar).
**Validates: Requirements 9.2**

**Property 42: Toast auto-dismiss**
*For any* toast triggered with a duration value, the toast should be automatically removed from the DOM after that duration in milliseconds.
**Validates: Requirements 9.3**

**Property 43: Toast manual dismiss**
*For any* visible toast, clicking the close button should immediately remove that toast from the DOM.
**Validates: Requirements 9.4**

**Property 44: Toast stacking**
*For any* toast system, triggering multiple toasts should display all of them simultaneously in a stacked layout.
**Validates: Requirements 9.5**

**Property 45: Toast hook availability**
*For any* component using the useToast hook, the hook should return an object with a toast function.
**Validates: Requirements 9.9**

**Property 46: Toast ARIA live region**
*For any* toast container, it should have aria-live="polite" or aria-live="assertive" attribute.
**Validates: Requirements 9.11**

### Dropdown Component Properties

**Property 47: Dropdown trigger opening**
*For any* Dropdown component, clicking the trigger should open the dropdown menu.
**Validates: Requirements 10.1**

**Property 48: Dropdown outside click**
*For any* Dropdown component with an open menu, clicking outside the dropdown should close the menu.
**Validates: Requirements 10.2**

**Property 49: Dropdown escape key**
*For any* Dropdown component with an open menu, pressing the Escape key should close the menu.
**Validates: Requirements 10.3**

**Property 50: Dropdown menu item icons**
*For any* Dropdown menu item with an icon prop, the item should render the icon before the label text.
**Validates: Requirements 10.4**

**Property 51: Dropdown disabled items**
*For any* Dropdown menu item with disabled set to true, clicking that item should not trigger its onClick handler.
**Validates: Requirements 10.5**

**Property 52: Dropdown dividers**
*For any* Dropdown items array containing 'divider' strings, the dropdown should render separator elements at those positions.
**Validates: Requirements 10.6**

### Tabs Component Properties

**Property 53: Tabs controlled mode**
*For any* Tabs component with value and onChange props, clicking a tab should call onChange with that tab's id and not change the active tab until value prop changes.
**Validates: Requirements 11.1**

**Property 54: Tabs uncontrolled mode**
*For any* Tabs component with defaultTab but no value prop, clicking a tab should immediately activate that tab and display its content.
**Validates: Requirements 11.1**

**Property 55: Tabs content display**
*For any* Tabs component, only the content of the currently active tab should be visible in the DOM or rendered.
**Validates: Requirements 11.2**

**Property 56: Tabs keyboard navigation**
*For any* Tabs component with focus on a tab, pressing the right arrow key should move focus to the next tab, and left arrow key should move to the previous tab.
**Validates: Requirements 11.3**

**Property 57: Tabs active indicator**
*For any* Tabs component, the active tab should have distinct visual styling (different background, border, or underline) compared to inactive tabs.
**Validates: Requirements 11.4**

**Property 58: Tabs orientation**
*For any* Tabs component with orientation prop set to 'vertical', the tabs should be arranged vertically instead of horizontally.
**Validates: Requirements 11.5**

### Cross-Component Properties

**Property 59: Design token usage**
*For any* component in the component system, all color, spacing, and border radius values should reference CSS custom properties from globals.css (var(--*)) rather than hardcoded Tailwind classes with specific color values.
**Validates: Requirements 1.8, 2.7, 3.6, 4.4, 6.7, 7.7, 7.8, 8.3, 8.8, 9.8, 10.8, 11.6, 12.1, 12.3**

**Property 60: ARIA attributes presence**
*For any* interactive component (Button, Input, Select, Modal, Dropdown, Tabs, Checkbox, Radio), the component should have appropriate ARIA attributes (role, aria-label, aria-expanded, aria-checked, etc.) based on its type.
**Validates: Requirements 5.11, 6.9, 7.10, 10.10, 11.8, 13.3, 13.6**

**Property 61: Keyboard navigation support**
*For any* interactive component, the component should respond to appropriate keyboard events (Enter, Space, Arrow keys, Escape, Tab) based on its type.
**Validates: Requirements 13.1**

**Property 62: Focus indicators**
*For any* interactive component, when focused via keyboard, the component should have visible focus-visible ring styling.
**Validates: Requirements 13.2**

**Property 63: Label association**
*For any* form component (Input, Textarea, Checkbox, Radio, Select) with a label prop, the label element should have an htmlFor attribute matching the input's id.
**Validates: Requirements 13.4**

**Property 64: Native attribute passthrough**
*For any* component that wraps a native HTML element (Button, Input, Textarea, Checkbox, Radio), all native HTML attributes passed as props should be applied to the underlying element.
**Validates: Requirements 1.10, 2.9**

**Property 65: Custom className merging**
*For any* component that accepts a className prop, the custom className should be merged with the component's base classes without overriding them.
**Validates: Requirements 3.8, 4.7**

**Property 66: Contrast ratio compliance**
*For any* component with text content, the contrast ratio between text color and background color should meet WCAG 2.1 AA standards (minimum 4.5:1 for normal text, 3:1 for large text).
**Validates: Requirements 12.2, 13.7**



## Error Handling

### Component Error Boundaries

All components should be wrapped in error boundaries at the application level to prevent component failures from crashing the entire app. Individual components should handle their own error states gracefully:

**Input Validation Errors:**
- Input, Textarea, Select components display error messages via error prop
- Error state changes border color to destructive (red)
- Error messages use text-destructive color for visibility
- Error messages include appropriate ARIA attributes (aria-invalid, aria-describedby)

**Modal and Dropdown Errors:**
- If focus trap fails, log error and fall back to standard focus behavior
- If click-outside detection fails, provide manual close button
- If animation library fails, render without animations

**Toast System Errors:**
- If toast context is not available, log error to console
- Provide fallback toast function that uses console.warn
- Ensure toast system never crashes the app

**Component Prop Validation:**
- Use TypeScript for compile-time prop validation
- Provide sensible defaults for all optional props
- Log warnings for invalid prop combinations in development mode

### Accessibility Error Prevention

**Focus Management:**
- Always provide visible focus indicators
- Ensure focus is never lost (trapped in modals, restored after close)
- Provide skip links for keyboard users

**ARIA Errors:**
- Validate ARIA attribute combinations in development
- Ensure all interactive elements have accessible names
- Provide fallback text for icon-only buttons

**Color Contrast:**
- Use design tokens that meet WCAG AA standards
- Test all color combinations during development
- Provide high-contrast mode support

## Testing Strategy

The component system requires comprehensive testing using both unit tests and property-based tests to ensure correctness, accessibility, and maintainability.

### Dual Testing Approach

**Unit Tests:**
- Verify specific examples and edge cases
- Test integration between components
- Test error conditions and boundary cases
- Focus on concrete scenarios that demonstrate correct behavior

**Property-Based Tests:**
- Verify universal properties across all inputs
- Test with randomized props to catch edge cases
- Ensure properties hold for all valid input combinations
- Provide comprehensive coverage through randomization

Both testing approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs and verify specific behaviors, while property tests verify general correctness across all possible inputs.

### Testing Tools

**Testing Framework:** Vitest (already used in Next.js projects)
**React Testing:** React Testing Library for component rendering and interaction
**Property-Based Testing:** fast-check (JavaScript/TypeScript property-based testing library)
**Accessibility Testing:** jest-axe or @testing-library/jest-dom for ARIA validation
**Visual Regression:** Optional - Chromatic or Percy for visual testing

### Property-Based Test Configuration

Each property-based test must:
- Run minimum 100 iterations (due to randomization)
- Reference its design document property in a comment
- Use tag format: `// Feature: component-system, Property {number}: {property_text}`
- Generate random valid inputs using fast-check arbitraries

**Example Property Test:**

```typescript
import fc from 'fast-check';
import { render } from '@testing-library/react';
import { Button } from './button';

// Feature: component-system, Property 1: Button variant rendering
test('Button renders correct variant classes', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('primary', 'secondary', 'ghost', 'danger'),
      (variant) => {
        const { container } = render(<Button variant={variant}>Click</Button>);
        const button = container.querySelector('button');
        
        // Verify button has variant-specific classes
        const variantClasses = {
          primary: 'bg-primary',
          secondary: 'bg-secondary',
          ghost: 'hover:bg-accent',
          danger: 'bg-destructive',
        };
        
        expect(button?.className).toContain(variantClasses[variant]);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Test Strategy

**Component Rendering Tests:**
- Test that components render without crashing
- Test that props are correctly applied
- Test that children are rendered correctly

**Interaction Tests:**
- Test button clicks trigger onClick handlers
- Test form inputs update on change
- Test keyboard navigation works correctly
- Test focus management in modals and dropdowns

**Accessibility Tests:**
- Test ARIA attributes are present
- Test keyboard navigation works
- Test focus indicators are visible
- Test screen reader announcements

**Integration Tests:**
- Test form components work together
- Test modal with form inputs
- Test dropdown with keyboard navigation
- Test toast system with multiple toasts

**Example Unit Test:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

test('Button calls onClick when clicked', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  const button = screen.getByRole('button', { name: /click me/i });
  fireEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('Button shows spinner when loading', () => {
  render(<Button isLoading>Submit</Button>);
  
  // Spinner should be present
  expect(screen.getByRole('status')).toBeInTheDocument();
});

test('Button is disabled when disabled prop is true', () => {
  render(<Button disabled>Click me</Button>);
  
  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
  expect(button).toHaveClass('opacity-50');
});
```

### Test Coverage Goals

- **Line Coverage:** Minimum 80% for all component files
- **Branch Coverage:** Minimum 75% for conditional logic
- **Property Coverage:** 100% of correctness properties must have property-based tests
- **Accessibility Coverage:** 100% of interactive components must have accessibility tests

### Testing Workflow

1. **During Development:**
   - Write unit tests for each component as it's built
   - Write property tests for universal behaviors
   - Run tests in watch mode during development

2. **Before Commit:**
   - Run full test suite
   - Check test coverage
   - Run accessibility tests

3. **In CI/CD:**
   - Run all tests on every pull request
   - Block merge if tests fail
   - Generate coverage reports

### Refactoring Validation

After refactoring existing pages to use the component system:

1. **Visual Regression Tests:**
   - Compare screenshots before and after refactoring
   - Ensure UI looks identical

2. **Integration Tests:**
   - Test that pages still function correctly
   - Test that user flows work end-to-end

3. **Performance Tests:**
   - Ensure refactoring doesn't degrade performance
   - Measure bundle size impact

4. **Code Quality Checks:**
   - Verify zero duplicated styling code
   - Verify all inline styles are removed
   - Verify consistent component usage

## Implementation Notes

### CVA Setup

Install class-variance-authority:

```bash
npm install class-variance-authority
```

### Custom Hooks

**useFocusTrap:**
```typescript
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (!isActive) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [isActive]);
  
  return containerRef;
}
```

**useClickOutside:**
```typescript
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);
  
  return ref;
}
```

### Migration Strategy

1. **Phase 1: Core Components**
   - Implement Button, Input, Card components
   - Test thoroughly
   - Refactor one page as proof of concept

2. **Phase 2: Form Components**
   - Implement Select, Textarea, Checkbox, Radio
   - Refactor form-heavy pages

3. **Phase 3: Overlay Components**
   - Implement Modal, Dropdown, Toast
   - Refactor pages with dialogs and menus

4. **Phase 4: Advanced Components**
   - Implement Tabs, Progress, Skeleton, Spinner
   - Complete refactoring of all pages

5. **Phase 5: Polish**
   - Add animations
   - Optimize performance
   - Complete documentation

### Performance Considerations

- Use React.memo for components that receive stable props
- Avoid inline function definitions in render
- Use CSS transitions instead of JavaScript animations where possible
- Lazy load heavy components (Modal, Dropdown) if needed
- Tree-shake unused components in production builds

### Design Token Updates

If design tokens need to be updated in the future:

1. Update CSS custom properties in globals.css
2. Update TypeScript definitions in design-tokens.ts
3. Run visual regression tests
4. Update documentation

All components will automatically reflect the changes since they reference CSS variables.
