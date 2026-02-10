import { useEffect, useRef } from 'react';

/**
 * useClickOutside - Detects clicks outside of a referenced element
 * 
 * Useful for closing dropdowns, modals, and other overlay components
 * when the user clicks outside of them.
 * 
 * @param callback - Function to call when click outside is detected
 * @returns ref - Attach this ref to the container element
 * 
 * @example
 * ```tsx
 * const Dropdown = ({ onClose }) => {
 *   const dropdownRef = useClickOutside<HTMLDivElement>(onClose);
 *   
 *   return (
 *     <div ref={dropdownRef}>
 *       <button>Option 1</button>
 *       <button>Option 2</button>
 *     </div>
 *   );
 * };
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLDivElement>(
  callback: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      // Check if click is outside the referenced element
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      // Clean up event listeners
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [callback]);

  return ref;
}
