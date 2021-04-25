import { nanoid } from 'nanoid';
import { useRef } from 'react';

export default function useRefId() {
  return useRef(nanoid()).current;
}
