import { useState } from 'react';
import { Options } from '@popperjs/core';
import { usePopper as usePopperRaw } from 'react-popper';

export default function usePopper(options: Omit<Options, 'modifiers' | 'strategy'>) {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const result = usePopperRaw(referenceElement, popperElement, options);

  return {
    ...result,
    setReferenceElement,
    setPopperElement,
  };
}
