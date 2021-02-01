import {
  KeyboardEventHandler,
  useCallback,
  useState,
} from 'react';
import { usePopper as usePopperRaw } from 'react-popper';

export function useHover() {
  const [hovered, setHovered] = useState(false);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const onKeyPress: KeyboardEventHandler = useCallback((ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      setHovered(!hovered);
    }
  }, [hovered]);

  return {
    onMouseEnter,
    onMouseLeave,
    onKeyPress,
    hovered,
  };
}

export function usePopper(options: Parameters<typeof usePopperRaw>[2]) {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const result = usePopperRaw(referenceElement, popperElement, options);

  return {
    ...result,
    setReferenceElement,
    setPopperElement,
  };
}
