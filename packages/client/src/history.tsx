import React, { useContext, useRef } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import { ArrowBack, ArrowForward, FiberSmartRecord } from '@material-ui/icons';
import range from 'lodash/range';
import { useMeasure } from 'react-use';
import useMergedRef from '@react-hook/merged-ref';
import { RenderRootContext } from './context';

interface UpdateHistoryProps {
  /**
   * current frame index, use -1 for live mode
   */
  activeIndex: number;
  /**
   * frames total count
   */
  totalTimes: number;

  onActiveIndexChange(index: number): void;
}

/**
 * TODO
 * 1. show **WHY** re-render (props changed or some other reason)
 * 2. when there is huge history stack we should use virtual list
 */
export default function UpdateHistory({ activeIndex, totalTimes, onActiveIndexChange }: UpdateHistoryProps) {
  const living = activeIndex === -1;
  const { portalRoot } = useContext(RenderRootContext);
  const [mRef, { width }] = useMeasure<HTMLDivElement>();
  const ref = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRef(mRef, ref);
  const itemWidth = width / totalTimes;

  /**
   * use keyboard ← → to quickly jump prev or next
   */
  const handleFramesKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowLeft':
        onActiveIndexChange(Math.max(activeIndex - 1, 0));
        ref.current?.focus();
        break;

      case 'ArrowRight':
        onActiveIndexChange(Math.min(activeIndex + 1, totalTimes - 1));
        ref.current?.focus();
        break;

      default:
    }
  };

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <code
        style={{
          display: 'inline-block',
          minWidth: 50,
        }}
      >
        {activeIndex === -1 ? '_' : (activeIndex + 1)}
        /
        {totalTimes}
      </code>
      <Button
        size="small"
        disabled={activeIndex < 1}
        onClick={() => onActiveIndexChange(activeIndex - 1)}
      >
        <ArrowBack />
      </Button>
      <div
        css={{
          height: 16,
          margin: '4px 0',
          flex: 1,
        }}
        role="button"
        tabIndex={0}
        ref={mergedRef}
        onKeyDown={handleFramesKeyDown}
      >
        <div
          css={{
            height: '100%',
            background: '#eee',
            position: 'relative',
          }}
        >
          {
            itemWidth > 2 ? (
              <div
                css={{
                  display: 'flex',
                  height: '100%',

                  '& div': {
                    height: '100%',
                    flex: 1,
                    cursor: 'pointer',
                    textIndent: -999,
                    overflow: 'hidden',

                    '&:nth-of-type(odd)': {
                      background: '#ddd',
                    },

                    '&:hover, &:focus-visible': {
                      background: '#cef',
                      outline: 0,
                    },
                  },
                }}
              >
                {range(0, totalTimes).map((i) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    onClick={() => onActiveIndexChange(i)}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            ) : null
          }
          {
            activeIndex > -1 ? (
              <div
                css={{
                  position: 'absolute',
                  top: '50%',
                  width: 6,
                  height: 6,
                  borderRadius: 6,
                  border: '1px solid #0c6',
                  margin: -3,
                  background: '#afc',
                  pointerEvents: 'none',
                }}
                style={{
                  left: (activeIndex + 0.5) * itemWidth,
                }}
              />
            ) : null
          }
        </div>
      </div>
      <Button
        size="small"
        disabled={activeIndex > totalTimes - 2}
        onClick={() => onActiveIndexChange(activeIndex + 1)}
      >
        <ArrowForward />
      </Button>
      <Tooltip
        title="real-time"
        PopperProps={{ container: portalRoot }}
      >
        <Button
          size="small"
          onClick={() => onActiveIndexChange(-1)}
        >
          <FiberSmartRecord
            css={{
              color: living ? '#6cf' : 'inherit',
            }}
          />
        </Button>
      </Tooltip>
    </div>
  );
}
