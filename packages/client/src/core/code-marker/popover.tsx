import React, { useCallback, useRef, useLayoutEffect } from 'react';
import { ObjectSummary } from '@relyzer/shared';
import useMergedRef from '@react-hook/merged-ref';
import ToBody from '../../components/to-body';
import VariablePreview from '../variable-value-preview';
import CodeTokenDebug from '../code-token-debug';
import { commonStyles } from '../../styles';

interface MarkerPopoverProps {
  id: string;
  object: ObjectSummary;
  updatedTimes: number;
  attributes: Record<string, any> | undefined;
  style: React.CSSProperties;
  onDebug(all: boolean): void;
  onExit(): void;
}

function CodeMarkerPopover(
  {
    id,
    style,
    object,
    attributes,
    updatedTimes,
    onDebug,
    onExit,
  }: MarkerPopoverProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const mRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRef(mRef, ref);

  const handleDebugCurrent = useCallback(() => {
    onDebug(false);
  }, [onDebug]);

  useLayoutEffect(() => {
    // focus to the first button element
    mRef.current?.querySelector('button')?.focus();
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onExit();
  };

  return (
    <ToBody>
      <div
        css={{
          fontSize: 12,
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          padding: 8,
          lineHeight: 1.8,
          zIndex: 9999,
        }}
        ref={mergedRef}
        style={style}
        {...attributes}
        role="presentation"
        id={id}
        onKeyDown={handleKeyDown}
      >
        <div
          css={commonStyles.flexCenter}
        >
          <VariablePreview
            value={object}
            onClick={handleDebugCurrent}
          />
          <CodeTokenDebug onDebug={onDebug} />
        </div>
        <div>
          Updated
          <strong style={{ fontSize: 14, margin: '0 2px' }}>{updatedTimes}</strong>
          {updatedTimes > 1 ? 'times' : 'time'}
        </div>
      </div>
      <div
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        aria-hidden="true"
        onFocus={onExit}
      />
    </ToBody>
  );
}

export default React.memo(React.forwardRef(CodeMarkerPopover));
