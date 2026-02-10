import { useEffect, useRef } from 'react';

/**
 * useFocusTrap - Traps focus within a container element
 * 
 * Useful for modals, dropdowns, and other overlay components to ensure
 * keyboard navigation stays within the component.
 * 
 * @returns ref - Attach this ref to the container element
 * 
 * @example
 * ```tsx
 * const Modal = ({ isOpen }) => {
 *   const trapRef = useFocusTrap<HTMLDivElement>();
 *   
 *   if (!isOpen) return null;
 *   
 *   return (
 *     <div ref={trapRef}>
 *       <button>First</button>
 *       <button>Last</button>
 *     </div>
 *   );
 * };
 * ```
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      if (!element) return [];
      
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      return Array.from(element.querySelectorAll<HTMLElement>(focusableSelectors));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab (backwards)
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
      // Tab (forwards)
      else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus first element when trap is activated
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return ref;
}
