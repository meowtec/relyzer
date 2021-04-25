import { useState } from 'react';
import { usePopper as usePopperRaw } from 'react-popper';

export default function usePopper(options: Parameters<typeof usePopperRaw>[2]) {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const result = usePopperRaw(referenceElement, popperElement, options);

  return {
    ...result,
    setReferenceElement,
    setPopperElement,
  };
}
