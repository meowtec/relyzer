import { ObjectSummary } from '@relyzer/shared';
import {
  useCallback, useContext, useRef, Fragment,
} from 'react';
import useMergedRef from '@react-hook/merged-ref';
import Tokens from '../code-tokens';
import { MarkerBlock } from '../../utils/highlight';
import { useHover, usePopper } from '../../hooks';
import CodeMarkerPopover from './popover';
import { BridgeContext } from '../../context';
import { atomColor } from '../../styles';

interface MarkerProps {
  collectorId: number;
  frameId: number;
  locIndex: number;
  marker: MarkerBlock;
  object: ObjectSummary;
  updatedTimes: number;
  updated: boolean;
}

export default function Marker({
  collectorId,
  frameId,
  locIndex,
  marker,
  object,
  updatedTimes,
  updated,
}: MarkerProps) {
  const bridge = useContext(BridgeContext);

  const {
    onMouseEnter,
    onMouseLeave,
    onKeyPress,
    hovered,
    id,
  } = useHover();

  const {
    styles, attributes, setReferenceElement, setPopperElement,
  } = usePopper({
    placement: 'right',
  });

  const ref = useRef<HTMLSpanElement>(null);
  const mergedRef = useMergedRef(ref, setReferenceElement);

  const handleDebug = useCallback((all: boolean) => {
    bridge?.send('LOG', {
      collectorId,
      frameId,
      loc: locIndex,
      all,
    });
  }, [bridge, frameId, locIndex, collectorId]);

  // exit via tab
  const handlePopoverExit = useCallback(() => {
    onMouseLeave();
    ref.current?.focus();
  }, [onMouseLeave]);

  const color = updated ? atomColor.danger : atomColor.success;

  return (
    <Fragment>
      <span
        css={{
          background: color(0.2),
          textDecorationColor: color(1),
          textDecorationLine: 'underline',
          textDecorationThickness: '3px',
          position: 'relative',
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          css={{
            position: 'absolute',
            background: '#333',
            color: '#fff',
            lineHeight: 1.5,
            padding: '0 4px',
            borderRadius: 4,
            transform: 'translate(100%, -100%) scale(0.8)',
            transformOrigin: '0 100%',
            top: 0,
            right: 0,
          }}
        >
          {updatedTimes}
        </div>
        <span
          tabIndex={0}
          role="button"
          aria-describedby={id}
          onKeyPress={onKeyPress}
          ref={mergedRef}
        >
          <Tokens tokens={marker.children} />
        </span>

        {hovered && (
          <CodeMarkerPopover
            ref={setPopperElement}
            id={id}
            object={object}
            updatedTimes={updatedTimes}
            attributes={attributes.popper}
            style={styles.popper}
            onDebug={handleDebug}
            onExit={handlePopoverExit}
          />
        )}
      </span>
    </Fragment>
  );
}
