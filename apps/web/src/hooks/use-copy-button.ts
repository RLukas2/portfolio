import { type MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';

/**
 * A hook to manage the state of a copy button with automatic reset.
 * Provides visual feedback for copy actions with a 1.5 second timeout.
 *
 * @param onCopy - The callback function to execute on copy action
 * @returns A tuple containing the checked state and the onClick handler
 *
 * @example
 * ```tsx
 * const [copied, handleCopy] = useCopyButton(() => {
 *   navigator.clipboard.writeText(code);
 * });
 *
 * return (
 *   <button onClick={handleCopy}>
 *     {copied ? 'Copied!' : 'Copy'}
 *   </button>
 * );
 * ```
 */
export const useCopyButton = (onCopy: () => void): [checked: boolean, onClick: MouseEventHandler] => {
  const [checked, setChecked] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef(onCopy);

  // Move ref assignment to effect
  useEffect(() => {
    callbackRef.current = onCopy;
  }, [onCopy]);

  const onClick: MouseEventHandler = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setChecked(false);
    }, 1500);
    callbackRef.current();
    setChecked(true);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [checked, onClick];
};
