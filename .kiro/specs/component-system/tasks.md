# Implementation Plan: Component System

## Overview

This implementation plan breaks down the component system into incremental, testable steps. Each task builds on previous work, with components implemented in order of dependency and utility. The plan follows a phased approach: core utilities first, then basic components, form components, overlay components, and finally refactoring existing pages.

## Tasks

- [x] 1. Set up component infrastructure and design tokens
  - Create `src/lib/design-tokens.ts` with TypeScript definitions for colors, spacing, typography, border radius, and shadows
  - Install class-variance-authority (CVA) package: `npm install class-variance-authority`
  - Create custom hooks directory: `src/lib/hooks/`
  - Verify existing `src/lib/cn.ts` utility works correctly
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

- [ ] 2. Implement core utility hooks
  - [x] 2.1 Create `use-focus-trap.ts` hook for modal and dropdown focus management
    - Implement focus trap logic with Tab and Shift+Tab handling
    - Return ref to attach to container element
    - _Requirements: 5.1, 6.10, 13.5_
  
  - [x] 2.2 Create `use-click-outside.ts` hook for dropdown and modal overlay clicks
    - Implement click detection outside referenced element
    - Return ref to attach to container element
    - _Requirements: 5.4, 10.2_
  
  - [ ]* 2.3 Write unit tests for utility hooks
    - Test focus trap cycles through elements correctly
    - Test click outside triggers callback
    - Test hooks clean up event listeners
    - _Requirements: 5.1, 5.4, 6.10, 10.2_

- [ ] 3. Implement Button component
  - [x] 3.1 Create `src/components/ui/button.tsx` with CVA variants
    - Define buttonVariants with CVA for variant (primary, secondary, ghost, danger) and size (sm, md, lg)
    - Implement ButtonProps interface extending ButtonHTMLAttributes
    - Support isLoading, leftIcon, rightIcon, fullWidth props
    - Use design tokens for all colors
    - Add ARIA attributes and focus-visible ring
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 13.1, 13.2_
  
  - [ ]* 3.2 Write property test for Button variant rendering
    - **Property 1: Button variant rendering**
    - **Validates: Requirements 1.1**
  
  - [ ]* 3.3 Write property test for Button size rendering
    - **Property 2: Button size rendering**
    - **Validates: Requirements 1.2**
  
  - [ ]* 3.4 Write property test for Button disabled state
    - **Property 3: Button disabled state**
    - **Validates: Requirements 1.3, 1.5**
  
  - [ ]* 3.5 Write unit tests for Button component
    - Test loading state shows spinner
    - Test icon positioning (left/right)
    - Test full-width variant
    - Test onClick handler is called
    - Test disabled button prevents clicks
    - _Requirements: 1.4, 1.5, 1.6, 1.7_

- [ ] 4. Implement loading state components (needed for Button)
  - [x] 4.1 Create `src/components/ui/spinner.tsx`
    - Support size variants (sm, md, lg)
    - Use CSS animation (animate-spin)
    - Use design tokens for color
    - Add role="status" for accessibility
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 4.2 Create `src/components/ui/skeleton.tsx`
    - Support variant (text, circle, rectangle)
    - Add animate-pulse class
    - Support custom width and height
    - Use design tokens
    - _Requirements: 8.4, 8.5, 8.8_
  
  - [ ] 4.3 Create `src/components/ui/progress.tsx`
    - Support value prop (0-100) for determinate mode
    - Support indeterminate mode with animation
    - Use design tokens for bar and background
    - _Requirements: 8.6, 8.7, 8.8_
  
  - [ ]* 4.4 Write property tests for loading components
    - **Property 34: Spinner size variants**
    - **Property 35: Spinner animation**
    - **Property 36: Skeleton variant rendering**
    - **Property 37: Skeleton pulse animation**
    - **Property 38: Progress value display**
    - **Property 39: Progress indeterminate mode**
    - **Validates: Requirements 8.1, 8.2, 8.4, 8.5, 8.6, 8.7**

- [ ] 5. Checkpoint - Core components working
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement Input component
  - [ ] 6.1 Create `src/components/ui/input.tsx`
    - Support type variants (text, email, password, number, tel)
    - Implement label, error, helperText, required props
    - Support leftIcon and rightIcon with proper positioning
    - Use design tokens for all styling
    - Add proper label association with htmlFor
    - Add ARIA attributes (aria-invalid, aria-describedby)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 13.4_
  
  - [ ]* 6.2 Write property tests for Input component
    - **Property 6: Input type support**
    - **Property 7: Input error display**
    - **Property 8: Input helper text display**
    - **Property 9: Input required indicator**
    - **Property 10: Input icon rendering**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.6**
  
  - [ ]* 6.3 Write unit tests for Input component
    - Test disabled state styling
    - Test focus ring appears on focus
    - Test native attributes are passed through
    - _Requirements: 2.5, 2.9, 2.10_

- [ ] 7. Implement Card component
  - [ ] 7.1 Create `src/components/ui/card.tsx`
    - Use glass-panel styling (bg-card, border-card-border)
    - Define cardVariants with CVA for padding (default, compact, none)
    - Support header, footer, hoverable, clickable props
    - Integrate with Framer Motion for entrance animations
    - Support custom className merging
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_
  
  - [ ]* 7.2 Write property tests for Card component
    - **Property 11: Card glass-panel styling**
    - **Property 12: Card padding variants**
    - **Property 13: Card header and footer**
    - **Property 14: Card clickable state**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.5**
  
  - [ ]* 7.3 Write unit tests for Card component
    - Test hover state adds elevation
    - Test Framer Motion animation props
    - Test custom className is merged
    - _Requirements: 3.4, 3.8, 3.9_

- [ ] 8. Implement Badge component
  - [ ] 8.1 Create `src/components/ui/badge.tsx`
    - Define badgeVariants with CVA for variant (success, warning, error, info), size (sm, md), and shape (pill, square)
    - Support icon prop with proper positioning
    - Use design tokens for all colors
    - Support custom className
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [ ]* 8.2 Write property tests for Badge component
    - **Property 15: Badge variant rendering**
    - **Property 16: Badge size rendering**
    - **Property 17: Badge shape rendering**
    - **Property 18: Badge icon rendering**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.5**

- [ ] 9. Checkpoint - Basic components complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement form components (Textarea, Checkbox, Radio)
  - [ ] 10.1 Create `src/components/ui/textarea.tsx`
    - Extend Input component features (label, error, helperText, required)
    - Implement autoResize functionality using useEffect to adjust height
    - Use design tokens for styling
    - Add proper label association
    - _Requirements: 7.1, 7.2, 13.4_
  
  - [ ] 10.2 Create `src/components/ui/checkbox.tsx`
    - Support checked, unchecked, and indeterminate states
    - Implement label with proper click target (htmlFor)
    - Use design tokens for border and check color
    - Add ARIA attributes (aria-checked)
    - _Requirements: 7.3, 7.4, 7.7, 7.9, 7.10_
  
  - [ ] 10.3 Create `src/components/ui/radio.tsx`
    - Support checked and unchecked states
    - Implement label with proper click target
    - Use design tokens for border and fill color
    - Add ARIA attributes (aria-checked)
    - _Requirements: 7.5, 7.6, 7.8, 7.9, 7.10_
  
  - [ ]* 10.4 Write property tests for form components
    - **Property 30: Textarea auto-resize**
    - **Property 31: Checkbox indeterminate state**
    - **Property 32: Checkbox label click target**
    - **Property 33: Radio label click target**
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.6**
  
  - [ ]* 10.5 Write unit tests for form components
    - Test Textarea supports all Input features
    - Test Checkbox and Radio use design tokens
    - Test ARIA attributes are present
    - _Requirements: 7.1, 7.7, 7.8, 7.10_

- [ ] 11. Implement Select component
  - [ ] 11.1 Create `src/components/ui/select.tsx`
    - Implement custom dropdown with trigger and options list
    - Support placeholder display when no value selected
    - Implement click to open/close dropdown
    - Implement option selection with onChange callback
    - Support searchable mode with filter functionality
    - Support disabled state for component and individual options
    - Support error state with red border
    - Use design tokens for all styling
    - Add ARIA attributes (role="combobox", aria-expanded, aria-activedescendant)
    - Implement focus trap when dropdown is open
    - Use useClickOutside hook to close on outside click
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10_
  
  - [ ]* 11.2 Write property tests for Select component
    - **Property 25: Select placeholder display**
    - **Property 26: Select dropdown opening**
    - **Property 27: Select option selection**
    - **Property 28: Select search functionality**
    - **Property 29: Select disabled state**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
  
  - [ ]* 11.3 Write unit tests for Select component
    - Test error state styling
    - Test ARIA attributes
    - Test focus trap when open
    - Test click outside closes dropdown
    - _Requirements: 6.6, 6.9, 6.10_

- [ ] 12. Checkpoint - Form components complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement Modal component
  - [ ] 13.1 Create `src/components/ui/modal.tsx`
    - Define modalVariants with CVA for size (sm, md, lg)
    - Implement isOpen, onClose, closeOnOverlayClick, closeOnEscape props
    - Support title (header with close button) and footer props
    - Use useFocusTrap hook for focus management
    - Implement body scroll lock (add overflow-hidden to body when open)
    - Implement Escape key handler
    - Implement overlay click handler
    - Use Framer Motion AnimatePresence for entrance/exit animations
    - Use design tokens for overlay, background, and border
    - Add ARIA attributes (role="dialog", aria-modal="true", aria-labelledby)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11_
  
  - [ ]* 13.2 Write property tests for Modal component
    - **Property 19: Modal focus trap**
    - **Property 20: Modal body scroll lock**
    - **Property 21: Modal escape key handling**
    - **Property 22: Modal overlay click handling**
    - **Property 23: Modal size variants**
    - **Property 24: Modal ARIA attributes**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.6, 5.11**
  
  - [ ]* 13.3 Write unit tests for Modal component
    - Test Framer Motion animations
    - Test header and footer rendering
    - Test design token usage
    - _Requirements: 5.5, 5.7, 5.8, 5.9_

- [ ] 14. Implement Toast notification system
  - [ ] 14.1 Create Toast context and provider in `src/components/ui/toast.tsx`
    - Define Toast interface (id, variant, title, description, duration)
    - Implement ToastContext with reducer for state management
    - Create ToastProvider component to wrap app
    - _Requirements: 9.1, 9.10_
  
  - [ ] 14.2 Create useToast hook in `src/lib/hooks/use-toast.ts`
    - Return toast function to trigger toasts
    - Return dismiss and dismissAll functions
    - Generate unique IDs for toasts
    - _Requirements: 9.9_
  
  - [ ] 14.3 Implement Toast component rendering
    - Support variant styling (success, error, warning, info)
    - Implement fixed positioning (top-right)
    - Implement auto-dismiss with setTimeout based on duration
    - Implement manual dismiss with close button
    - Support stacking multiple toasts
    - Use Framer Motion for entrance/exit animations
    - Use design tokens for styling
    - Add ARIA live region (aria-live="polite")
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.11_
  
  - [ ]* 14.4 Write property tests for Toast system
    - **Property 40: Toast variant rendering**
    - **Property 41: Toast fixed positioning**
    - **Property 42: Toast auto-dismiss**
    - **Property 43: Toast manual dismiss**
    - **Property 44: Toast stacking**
    - **Property 45: Toast hook availability**
    - **Property 46: Toast ARIA live region**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.9, 9.11**
  
  - [ ]* 14.5 Write unit tests for Toast system
    - Test custom duration works
    - Test Framer Motion animations
    - Test design token usage
    - _Requirements: 9.6, 9.7, 9.8_

- [ ] 15. Implement Dropdown Menu component
  - [ ] 15.1 Create `src/components/ui/dropdown.tsx`
    - Support trigger prop (ReactNode to click)
    - Support items array with DropdownMenuItem and 'divider' types
    - Implement click to open/close dropdown
    - Use useClickOutside hook to close on outside click
    - Implement Escape key handler to close
    - Implement keyboard navigation with arrow keys
    - Support menu items with icons
    - Support disabled menu items (prevent onClick)
    - Render dividers as separator elements
    - Implement collision detection for positioning (adjust if near viewport edge)
    - Use design tokens for styling
    - Add ARIA attributes (role="menu", role="menuitem", aria-haspopup)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_
  
  - [ ]* 15.2 Write property tests for Dropdown component
    - **Property 47: Dropdown trigger opening**
    - **Property 48: Dropdown outside click**
    - **Property 49: Dropdown escape key**
    - **Property 50: Dropdown menu item icons**
    - **Property 51: Dropdown disabled items**
    - **Property 52: Dropdown dividers**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6**
  
  - [ ]* 15.3 Write unit tests for Dropdown component
    - Test collision detection positioning
    - Test keyboard navigation
    - Test ARIA attributes
    - Test design token usage
    - _Requirements: 10.7, 10.8, 10.10_

- [ ] 16. Implement Tabs component
  - [ ] 16.1 Create `src/components/ui/tabs.tsx`
    - Support controlled mode (value + onChange props)
    - Support uncontrolled mode (defaultTab prop)
    - Implement tab click to activate and show content
    - Implement keyboard navigation (arrow keys to move between tabs)
    - Highlight active tab with distinct styling
    - Support horizontal and vertical orientations
    - Animate tab indicator movement with Framer Motion
    - Use design tokens for styling
    - Add ARIA attributes (role="tablist", role="tab", role="tabpanel", aria-selected, aria-controls)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9_
  
  - [ ]* 16.2 Write property tests for Tabs component
    - **Property 53: Tabs controlled mode**
    - **Property 54: Tabs uncontrolled mode**
    - **Property 55: Tabs content display**
    - **Property 56: Tabs keyboard navigation**
    - **Property 57: Tabs active indicator**
    - **Property 58: Tabs orientation**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**
  
  - [ ]* 16.3 Write unit tests for Tabs component
    - Test Framer Motion indicator animation
    - Test design token usage
    - Test ARIA attributes
    - _Requirements: 11.6, 11.8, 11.9_

- [ ] 17. Checkpoint - All components implemented
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Write cross-component property tests
  - [ ]* 18.1 Write property test for design token usage across all components
    - **Property 59: Design token usage**
    - **Validates: Requirements 1.8, 2.7, 3.6, 4.4, 6.7, 7.7, 7.8, 8.3, 8.8, 9.8, 10.8, 11.6, 12.1, 12.3**
  
  - [ ]* 18.2 Write property test for ARIA attributes across all interactive components
    - **Property 60: ARIA attributes presence**
    - **Validates: Requirements 5.11, 6.9, 7.10, 10.10, 11.8, 13.3, 13.6**
  
  - [ ]* 18.3 Write property test for keyboard navigation across all interactive components
    - **Property 61: Keyboard navigation support**
    - **Validates: Requirements 13.1**
  
  - [ ]* 18.4 Write property test for focus indicators across all interactive components
    - **Property 62: Focus indicators**
    - **Validates: Requirements 13.2**
  
  - [ ]* 18.5 Write property test for label association across all form components
    - **Property 63: Label association**
    - **Validates: Requirements 13.4**
  
  - [ ]* 18.6 Write property test for native attribute passthrough
    - **Property 64: Native attribute passthrough**
    - **Validates: Requirements 1.10, 2.9**
  
  - [ ]* 18.7 Write property test for custom className merging
    - **Property 65: Custom className merging**
    - **Validates: Requirements 3.8, 4.7**
  
  - [ ]* 18.8 Write property test for contrast ratio compliance
    - **Property 66: Contrast ratio compliance**
    - **Validates: Requirements 12.2, 13.7**

- [ ] 19. Refactor home page (src/app/page.tsx) to use component system
  - Replace inline card styling with Card component
  - Replace inline button styling with Button component
  - Verify visual appearance matches original
  - Verify animations still work
  - _Requirements: 17.1, 17.2, 17.4, 17.5_

- [ ] 20. Refactor transactions page to use component system
  - Replace inline form elements with Input, Select, Button components
  - Replace inline card styling with Card component
  - Replace inline badge styling with Badge component
  - Verify functionality is preserved
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 21. Refactor budgets page to use component system
  - Replace inline form elements with form components
  - Replace inline card styling with Card component
  - Replace inline progress indicators with Progress component
  - Verify functionality is preserved
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 22. Refactor auto expenses page to use component system
  - Replace inline form elements with form components
  - Replace inline card styling with Card component
  - Replace inline button styling with Button component
  - Verify functionality is preserved
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 23. Refactor profile page to use component system
  - Replace inline form elements with form components
  - Replace inline button styling with Button component
  - Replace inline card styling with Card component
  - Verify functionality is preserved
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 24. Add ToastProvider to app layout
  - Wrap app in ToastProvider in `src/app/layout.tsx`
  - Test toast system works across all pages
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 9.11_

- [ ] 25. Final checkpoint - Verify zero code duplication
  - Run code analysis to find any remaining inline styles
  - Verify all pages use component system
  - Verify no duplicated component-level styling code
  - Run full test suite
  - Check test coverage meets goals (80% line coverage, 75% branch coverage)
  - _Requirements: 17.5_

- [ ] 26. Create component documentation
  - Add JSDoc comments to all component files
  - Add JSDoc comments to all component props
  - Create README.md in src/components/ui/ with overview and usage examples
  - _Requirements: 16.1, 16.2, 16.4_

## Notes

- Tasks marked with `*` are optional test-related sub-tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- Refactoring tasks ensure the component system is actually used throughout the app
- All components use design tokens for maintainability and theme consistency
