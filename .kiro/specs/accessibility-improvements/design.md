# Design Document: Accessibility Improvements

## Overview

This design document outlines the technical approach for implementing comprehensive accessibility improvements to the MoneyPilot PWA. The implementation will follow WCAG 2.1 Level AA guidelines and leverage React 19's built-in accessibility features, ARIA attributes, and modern web accessibility patterns.

The design focuses on five key areas:
1. **ARIA Enhancement Layer** - Adding semantic labels and roles to existing components
2. **Keyboard Navigation System** - Implementing focus management and keyboard shortcuts
3. **Form Accessibility Framework** - Proper label associations and error handling
4. **Live Region Announcer** - Dynamic content change notifications
5. **Visual Accessibility** - Focus indicators and non-color-based information

## Architecture

### Component Hierarchy

```
RootLayout (layout.tsx)
├── SkipLink (new)
├── KeyboardShortcutsProvider (new)
├── LiveRegionAnnouncer (new)
└── AppShell
    ├── AccessibleNav (enhanced)
    └── Page Content
        ├── AccessibleButtons (enhanced)
        ├── AccessibleForms (enhanced)
        └── AccessibleModals (enhanced)
```

### Key Design Decisions

1. **Non-invasive Enhancement**: Accessibility features will be added to existing components without major refactoring, using composition and wrapper patterns where appropriate.

2. **Context-based State Management**: Keyboard shortcuts and live region announcements will use React Context to avoid prop drilling.

3. **Progressive Enhancement**: Core functionality remains unchanged; accessibility features enhance the experience without breaking existing behavior.

4. **Focus Management Library**: Use `focus-trap-react` for modal focus trapping to ensure robust keyboard navigation.

5. **Tailwind Focus Utilities**: Leverage Tailwind CSS 4's built-in focus utilities (`focus:ring-2 focus:ring-primary focus:outline-none`) for consistent focus indicators.

## Components and Interfaces

### 1. SkipLink Component

**Purpose**: Provide keyboard users a way to skip repetitive navigation and jump directly to main content.

**Location**: `src/components/skip-link.tsx`

**Interface**:
```typescript
interface SkipLinkProps {
  targetId: string;
  label?: string;
}

export function SkipLink({ 
  targetId, 
  label = "Skip to main content" 
}: SkipLinkProps): JSX.Element
```

**Implementation Details**:
- Positioned absolutely at top-left, initially off-screen
- Becomes visible on keyboard focus using `focus:translate-y-0` utility
- High z-index (z-50) to appear above all content
- Styled with high contrast (white text on black background)
- Uses `href="#main-content"` to jump to main element

**Styling**:
```typescript
className="absolute -top-12 left-4 z-50 bg-black text-white px-4 py-2 
           rounded-md focus:top-4 focus:outline-none focus:ring-2 
           focus:ring-primary transition-all"
```

### 2. LiveRegionAnnouncer Component

**Purpose**: Announce dynamic content changes to screen readers without interrupting user flow.

**Location**: `src/components/live-region-announcer.tsx`

**Interface**:
```typescript
interface Announcement {
  id: string;
  message: string;
  priority: 'polite' | 'assertive';
  timestamp: number;
}

interface LiveRegionContextValue {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

export function LiveRegionAnnouncer({ children }: { children: ReactNode }): JSX.Element
export function useLiveRegion(): LiveRegionContextValue
```

**Implementation Details**:
- Maintains two live regions: one for `aria-live="polite"` and one for `aria-live="assertive"`
- Uses React state to manage announcement queue
- Automatically clears announcements after 5 seconds to prevent stale content
- Positioned off-screen using `sr-only` class (screen reader only)
- Context provider pattern for easy access throughout the app

**Usage Example**:
```typescript
const { announce } = useLiveRegion();
announce("Transaction added: Groceries $50", "polite");
```

### 3. KeyboardShortcutsProvider Component

**Purpose**: Manage global keyboard shortcuts and provide help dialog.

**Location**: `src/components/keyboard-shortcuts-provider.tsx`

**Interface**:
```typescript
interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'general';
}

interface KeyboardShortcutsContextValue {
  registerShortcut: (shortcut: Shortcut) => void;
  unregisterShortcut: (key: string) => void;
  showHelp: () => void;
}

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }): JSX.Element
export function useKeyboardShortcuts(): KeyboardShortcutsContextValue
```

**Implementation Details**:
- Global keydown event listener attached to document
- Ignores shortcuts when user is typing in input/textarea/contenteditable
- Help dialog triggered by "?" key, displays all registered shortcuts
- Uses `useEffect` for event listener cleanup
- Shortcuts organized by category for better UX in help dialog

**Keyboard Shortcuts Map**:
```typescript
const shortcuts = {
  '?': { description: 'Show keyboard shortcuts', category: 'general' },
  'n': { description: 'New transaction', category: 'actions' },
  'b': { description: 'Go to budgets', category: 'navigation' },
  'h': { description: 'Go to home', category: 'navigation' },
  't': { description: 'Go to transactions', category: 'navigation' },
  'Escape': { description: 'Close modal/dialog', category: 'general' }
}
```

### 4. AccessibleButton Component

**Purpose**: Enhance existing buttons with proper ARIA labels and focus management.

**Location**: `src/components/accessible-button.tsx`

**Interface**:
```typescript
interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function AccessibleButton({ 
  ariaLabel, 
  children, 
  variant = 'ghost',
  className,
  ...props 
}: AccessibleButtonProps): JSX.Element
```

**Implementation Details**:
- Wraps button with `aria-label` attribute
- Adds consistent focus styles: `focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`
- Includes `cursor-pointer` for hover state
- Supports all standard button props via spread operator

### 5. FocusTrap Component (for Modals)

**Purpose**: Trap keyboard focus within modal dialogs.

**Location**: `src/components/focus-trap.tsx`

**Interface**:
```typescript
interface FocusTrapProps {
  active: boolean;
  children: ReactNode;
  onEscape?: () => void;
  initialFocus?: RefObject<HTMLElement>;
  returnFocus?: RefObject<HTMLElement>;
}

export function FocusTrap({ 
  active, 
  children, 
  onEscape,
  initialFocus,
  returnFocus 
}: FocusTrapProps): JSX.Element
```

**Implementation Details**:
- Uses `focus-trap-react` library for robust focus management
- Listens for Escape key to close modal
- Automatically focuses first focusable element on mount
- Returns focus to trigger element on unmount
- Sets `aria-modal="true"` on container
- Adds `aria-hidden="true"` to siblings when active

**Usage in Modal**:
```typescript
<FocusTrap active={isOpen} onEscape={() => setIsOpen(false)}>
  <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
    {/* Modal content */}
  </div>
</FocusTrap>
```

### 6. AccessibleForm Component

**Purpose**: Provide accessible form patterns with proper label associations.

**Location**: `src/components/accessible-form.tsx`

**Interface**:
```typescript
interface AccessibleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function AccessibleInput({ 
  label, 
  error, 
  helperText, 
  required,
  id,
  ...props 
}: AccessibleInputProps): JSX.Element
```

**Implementation Details**:
- Generates unique ID if not provided using `useId()` hook
- Associates label with input using `htmlFor` and `id`
- Links error message using `aria-describedby`
- Sets `aria-invalid="true"` when error exists
- Sets `aria-required="true"` for required fields
- Displays error with role="alert" for immediate announcement

**Structure**:
```typescript
<div className="space-y-1">
  <label htmlFor={inputId} className="text-sm font-medium">
    {label} {required && <span aria-label="required">*</span>}
  </label>
  <input
    id={inputId}
    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
    aria-invalid={!!error}
    aria-required={required}
    className="focus:ring-2 focus:ring-primary focus:outline-none"
    {...props}
  />
  {helperText && <p id={`${inputId}-helper`} className="text-xs text-muted">{helperText}</p>}
  {error && <p id={`${inputId}-error`} role="alert" className="text-xs text-red-500">{error}</p>}
</div>
```

## Data Models

### Announcement Model

```typescript
interface Announcement {
  id: string;              // Unique identifier (UUID)
  message: string;         // Text to announce
  priority: 'polite' | 'assertive';  // ARIA live region priority
  timestamp: number;       // Creation time (Date.now())
}
```

### Keyboard Shortcut Model

```typescript
interface KeyboardShortcut {
  key: string;             // Key to trigger (e.g., 'n', '?', 'Escape')
  description: string;     // Human-readable description
  action: () => void;      // Function to execute
  category: 'navigation' | 'actions' | 'general';  // Grouping for help dialog
  enabled?: boolean;       // Optional: conditionally enable/disable
}
```

### Focus History Model

```typescript
interface FocusHistoryEntry {
  element: HTMLElement | null;  // Previously focused element
  timestamp: number;             // When focus changed
  reason: 'modal-open' | 'modal-close' | 'navigation' | 'deletion';  // Why focus changed
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: ARIA Label Presence

*For any* interactive element (button, link, input) without visible text content, the element should have an `aria-label` or `aria-labelledby` attribute that provides a descriptive label.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6**

### Property 2: Focus Indicator Visibility

*For any* interactive element that receives keyboard focus, the element should display a visible focus indicator with minimum 2px ring and primary color.

**Validates: Requirements 2.3**

### Property 3: Keyboard Navigation Completeness

*For any* page in the application, all interactive elements should be reachable via sequential keyboard navigation (Tab key).

**Validates: Requirements 2.1, 2.2**

### Property 4: Modal Focus Trap

*For any* open modal dialog, pressing Tab at the last focusable element should move focus to the first focusable element within the same modal, and pressing Shift+Tab at the first element should move to the last element.

**Validates: Requirements 2.6, 7.2, 7.3**

### Property 5: Form Label Association

*For any* form input element, there should exist a corresponding label element with matching `htmlFor` and `id` attributes.

**Validates: Requirements 3.1**

### Property 6: Error Announcement

*For any* form validation error, the error message should be associated with the input via `aria-describedby` and have `role="alert"` for immediate screen reader announcement.

**Validates: Requirements 3.2, 6.5**

### Property 7: Skip Link Functionality

*For any* page load, the first focusable element should be a skip link that, when activated, moves focus to the main content area.

**Validates: Requirements 4.1, 4.2, 4.3, 4.5**

### Property 8: Transaction Type Indicators

*For any* transaction display, both color coding and text symbols (+ or -) should be present to indicate transaction type.

**Validates: Requirements 5.1, 5.2**

### Property 9: Live Region Announcement

*For any* state-changing action (add, delete, update), an announcement should be added to the live region queue with appropriate priority level.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 10: Modal Escape Dismissal

*For any* open modal, pressing the Escape key should close the modal and return focus to the element that triggered the modal.

**Validates: Requirements 2.5, 7.4**

### Property 11: Keyboard Shortcut Isolation

*For any* keyboard shortcut trigger, if the active element is an input, textarea, or contenteditable element, the shortcut should not execute.

**Validates: Requirements 8.5**

### Property 12: Focus Return After Deletion

*For any* item deletion from a list, focus should move to the next item in the list, or to the add button if no items remain.

**Validates: Requirements 11.3**

### Property 13: Semantic Heading Hierarchy

*For any* page, heading levels should follow a logical hierarchy without skipping levels (h1 → h2 → h3, never h1 → h3).

**Validates: Requirements 12.3**

### Property 14: Color Contrast Compliance

*For any* text element, the contrast ratio between text color and background color should be at least 4.5:1 for normal text or 3:1 for large text.

**Validates: Requirements 10.1, 10.2, 10.4**

## Error Handling

### Focus Management Errors

**Scenario**: Focus target element no longer exists in DOM
- **Detection**: Check if element reference is null before calling `.focus()`
- **Recovery**: Fall back to focusing the nearest parent container or main content area
- **User Feedback**: No visible error; graceful degradation

**Scenario**: Modal focus trap fails to initialize
- **Detection**: `focus-trap-react` throws error during mount
- **Recovery**: Log error to console, allow normal focus behavior
- **User Feedback**: Modal still functions, but focus may escape (degraded experience)

### Live Region Announcement Errors

**Scenario**: Announcement queue grows too large
- **Detection**: Queue length exceeds 10 items
- **Recovery**: Remove oldest announcements (FIFO)
- **User Feedback**: No visible impact; prevents memory leaks

**Scenario**: Duplicate announcements in quick succession
- **Detection**: Same message announced within 1 second
- **Recovery**: Debounce and only announce once
- **User Feedback**: Cleaner screen reader experience

### Keyboard Shortcut Conflicts

**Scenario**: Multiple shortcuts registered for same key
- **Detection**: Check existing shortcuts map before registration
- **Recovery**: Log warning, use most recently registered shortcut
- **User Feedback**: Help dialog shows only active shortcut

**Scenario**: Shortcut triggered while typing
- **Detection**: Check if `document.activeElement` is input/textarea
- **Recovery**: Ignore shortcut, allow normal typing
- **User Feedback**: No interruption to typing

### Form Validation Errors

**Scenario**: Error message element not found for `aria-describedby`
- **Detection**: Element with error ID doesn't exist in DOM
- **Recovery**: Create error element dynamically or use inline error
- **User Feedback**: Error still displayed and announced

**Scenario**: Multiple errors on same field
- **Detection**: Error prop changes while previous error exists
- **Recovery**: Replace previous error message
- **User Feedback**: Only latest error announced

## Testing Strategy

### Dual Testing Approach

This feature requires both **unit tests** and **property-based tests** to ensure comprehensive coverage:

- **Unit tests** will verify specific examples, edge cases, and integration points
- **Property tests** will verify universal properties across all inputs using randomized testing
- Both approaches are complementary and necessary for accessibility compliance

### Unit Testing

**Focus Areas**:
1. **Component Rendering**: Verify ARIA attributes are correctly applied
2. **Event Handlers**: Test keyboard event listeners and focus management
3. **Edge Cases**: Empty states, missing props, null references
4. **Integration**: Component interactions (modal + focus trap, form + live region)

**Example Unit Tests**:
```typescript
describe('AccessibleButton', () => {
  it('should render with aria-label', () => {
    render(<AccessibleButton ariaLabel="Close menu"><X /></AccessibleButton>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close menu');
  });

  it('should apply focus styles on keyboard focus', () => {
    render(<AccessibleButton ariaLabel="Test">Click</AccessibleButton>);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveClass('focus:ring-2');
  });
});

describe('FocusTrap', () => {
  it('should trap focus within modal', () => {
    const { container } = render(
      <FocusTrap active={true}>
        <button>First</button>
        <button>Last</button>
      </FocusTrap>
    );
    const buttons = screen.getAllByRole('button');
    buttons[1].focus();
    userEvent.tab(); // Should cycle to first button
    expect(buttons[0]).toHaveFocus();
  });

  it('should close on Escape key', () => {
    const onEscape = jest.fn();
    render(<FocusTrap active={true} onEscape={onEscape}><div /></FocusTrap>);
    userEvent.keyboard('{Escape}');
    expect(onEscape).toHaveBeenCalled();
  });
});
```

**Testing Library**: Jest + React Testing Library + @testing-library/user-event

### Property-Based Testing

**Configuration**: Minimum 100 iterations per property test

**Property Test Library**: `@fast-check/jest` (TypeScript-friendly property-based testing)

**Property Test Examples**:

```typescript
import fc from 'fast-check';

describe('Property: ARIA Label Presence', () => {
  /**
   * Feature: accessibility-improvements, Property 1
   * For any interactive element without visible text, aria-label should exist
   */
  it('should have aria-label on all icon-only buttons', () => {
    fc.assert(
      fc.property(
        fc.record({
          icon: fc.constantFrom('Calendar', 'Plus', 'MoreHorizontal', 'X'),
          hasText: fc.constant(false)
        }),
        ({ icon, hasText }) => {
          const { container } = render(
            <AccessibleButton ariaLabel={`${icon} action`}>
              {!hasText && <span data-icon={icon} />}
            </AccessibleButton>
          );
          const button = container.querySelector('button');
          expect(button).toHaveAttribute('aria-label');
          expect(button?.getAttribute('aria-label')).toBeTruthy();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property: Focus Indicator Visibility', () => {
  /**
   * Feature: accessibility-improvements, Property 2
   * For any interactive element, focus should show visible indicator
   */
  it('should display focus ring on all interactive elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('button', 'a', 'input'),
        fc.string({ minLength: 1, maxLength: 20 }),
        (elementType, label) => {
          const Component = elementType === 'button' ? AccessibleButton :
                           elementType === 'a' ? 'a' : AccessibleInput;
          
          const props = elementType === 'input' 
            ? { label, id: 'test-input' }
            : { ariaLabel: label, children: label };

          const { container } = render(<Component {...props} />);
          const element = container.querySelector(elementType);
          element?.focus();
          
          const computedStyle = window.getComputedStyle(element!);
          // Check for focus ring in computed styles
          expect(element).toHaveClass('focus:ring-2');
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property: Modal Focus Trap', () => {
  /**
   * Feature: accessibility-improvements, Property 4
   * For any modal, Tab at last element should cycle to first
   */
  it('should cycle focus within modal boundaries', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 10 }), // Number of focusable elements
        (numElements) => {
          const buttons = Array.from({ length: numElements }, (_, i) => (
            <button key={i}>Button {i}</button>
          ));

          render(<FocusTrap active={true}>{buttons}</FocusTrap>);
          
          const allButtons = screen.getAllByRole('button');
          const lastButton = allButtons[allButtons.length - 1];
          const firstButton = allButtons[0];

          lastButton.focus();
          userEvent.tab(); // Should cycle to first
          expect(firstButton).toHaveFocus();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property: Form Label Association', () => {
  /**
   * Feature: accessibility-improvements, Property 5
   * For any form input, label should be properly associated
   */
  it('should associate labels with inputs via htmlFor/id', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        (labelText, inputValue) => {
          render(<AccessibleInput label={labelText} defaultValue={inputValue} />);
          
          const input = screen.getByRole('textbox');
          const label = screen.getByText(labelText);
          
          const inputId = input.getAttribute('id');
          const labelFor = label.getAttribute('for');
          
          expect(inputId).toBeTruthy();
          expect(labelFor).toBe(inputId);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property: Live Region Announcement', () => {
  /**
   * Feature: accessibility-improvements, Property 9
   * For any state change, announcement should be added to queue
   */
  it('should announce all transaction additions', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 50 }),
          amount: fc.integer({ min: 1, max: 100000 }),
          type: fc.constantFrom('income', 'expense')
        }),
        (transaction) => {
          const { result } = renderHook(() => useLiveRegion(), {
            wrapper: LiveRegionAnnouncer
          });

          act(() => {
            result.current.announce(
              `Transaction added: ${transaction.title} $${transaction.amount}`,
              'polite'
            );
          });

          const liveRegion = screen.getByRole('status');
          expect(liveRegion).toHaveTextContent(transaction.title);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property: Keyboard Shortcut Isolation', () => {
  /**
   * Feature: accessibility-improvements, Property 11
   * For any shortcut, should not trigger when typing in input
   */
  it('should not trigger shortcuts while typing', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('n', 'b', 'h', 't'),
        fc.string({ minLength: 1, maxLength: 100 }),
        (shortcutKey, inputText) => {
          const mockAction = jest.fn();
          
          render(
            <KeyboardShortcutsProvider>
              <input type="text" defaultValue={inputText} />
            </KeyboardShortcutsProvider>
          );

          const input = screen.getByRole('textbox');
          input.focus();
          
          userEvent.keyboard(shortcutKey);
          
          // Action should NOT be called when typing in input
          expect(mockAction).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Manual Accessibility Testing

**Screen Reader Testing**:
- Test with NVDA (Windows) or VoiceOver (macOS)
- Verify all interactive elements are announced correctly
- Confirm live region announcements work as expected
- Check form validation error announcements

**Keyboard Navigation Testing**:
- Navigate entire app using only Tab, Shift+Tab, Enter, Escape
- Verify focus indicators are visible at all times
- Test modal focus trapping
- Verify skip link functionality

**Color Contrast Testing**:
- Use browser DevTools or online contrast checkers
- Verify all text meets 4.5:1 ratio (or 3:1 for large text)
- Test in both light and dark modes if applicable

**Automated Accessibility Audits**:
- Run Lighthouse accessibility audit
- Use axe DevTools browser extension
- Integrate `@axe-core/react` for runtime checks in development

### Test Coverage Goals

- **Unit Test Coverage**: Minimum 80% for new accessibility components
- **Property Test Coverage**: All 14 correctness properties must have corresponding property tests
- **Integration Test Coverage**: All user flows (add transaction, create budget, etc.) tested with keyboard navigation
- **Manual Test Coverage**: All pages tested with screen reader and keyboard-only navigation
