import {
  KeyboardEventHandler,
  useCallback,

  useState,
} from 'react';
import useRefId from './use-ref-id';

export default function useHover() {
  const [hovered, setHovered] = useState(false);
  const id = useRefId();

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
    id,
  };
}
