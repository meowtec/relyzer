import React, {
  useCallback,
  useState,
} from 'react';
import useLatest from './use-lastest';

interface UseDragState {
  isDragging: boolean;
  initialScreenX: number;
  initialScreenY: number;
  screenX: number;
  screenY: number;
}
const initialDragState: UseDragState = {
  isDragging: false,
  initialScreenX: 0,
  initialScreenY: 0,
  screenX: 0,
  screenY: 0,
};

export default function useDrag({
  onComplete,
}: {
  onComplete?: (param: {
    dx: number;
    dy: number;
  }) => void;
}) {
  const [state, setState] = useState<UseDragState>(initialDragState);
  const pull = useLatest({
    state,
    onComplete,
  });

  const handleMouseDown = useCallback((ev: React.MouseEvent) => {
    if (ev.button !== 0) return;

    setState(() => ({
      isDragging: true,
      initialScreenX: ev.screenX,
      initialScreenY: ev.screenY,
      screenX: ev.screenX,
      screenY: ev.screenY,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const { screenX, screenY } = e;
      setState((oldState) => ({
        ...oldState,
        screenX,
        screenY,
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      const { state: st, onComplete: onComp } = pull();
      setState(initialDragState);
      onComp?.({
        dx: st.screenX - st.initialScreenX,
        dy: st.screenY - st.initialScreenY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [pull]);

  return {
    ...state,
    dx: state.screenX - state.initialScreenX,
    dy: state.screenY - state.initialScreenY,
    handleMouseDown,
  };
}
