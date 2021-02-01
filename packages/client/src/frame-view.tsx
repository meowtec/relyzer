import React, {
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  ObservedMeta,
  PlainCollectorFrame,
  utils,
} from '@relyzer/shared';
import parse, { isMarker, LeafToken, MarkerBlock } from './highlight';
import Marker from './code-marker';
import Tokens from './code-tokens';
import PropsView from './props-view';
import UpdateHistory from './history';
import { BridgeContext } from './context';
import { commonStyles } from './styles';

interface FrameViewProps {
  collectorId: number;
  code: string;
  observedList: ObservedMeta[];
  frames: Array<PlainCollectorFrame | null>;
  latestFrame: PlainCollectorFrame | null;
  updatedTimes: number;
}

function FrameView({
  collectorId,
  code,
  observedList,
  frames,
  latestFrame,
  updatedTimes,
}: FrameViewProps) {
  const bridge = useContext(BridgeContext);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleActiveIndexChange = useCallback((index: number) => {
    if (!frames[index] && index > -1) bridge?.send('REQUEST_FRAME', index);
    setActiveIndex(index);
  }, [bridge, frames]);

  const tokens = useMemo(
    () => parse(code, observedList.map((item) => utils.parseLoc(item.loc))),
    [code, observedList],
  );

  const locIndexMap = useMemo(
    () => new Map(observedList.map((item, index) => [item.loc, index])),
    [observedList],
  );

  const frame = activeIndex === -1 ? latestFrame : frames[activeIndex];

  return (
    <div
      css={{
        fontSize: 12,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h4
        css={{
          margin: 0,

          '& strong': {
            padding: 4,
          },
        }}
      >
        Component updated
        <strong>{updatedTimes}</strong>
        times
      </h4>
      <UpdateHistory
        activeIndex={activeIndex}
        totalTimes={updatedTimes}
        onActiveIndexChange={handleActiveIndexChange}
      />
      <div
        css={{
          display: 'flex',
          overflow: 'hidden',
          marginTop: 8,
        }}
      >
        <div
          css={[commonStyles.customNativeScroll, {
            lineHeight: 1.8,
            overflow: 'auto',
            flex: 1,
            flexGrow: 2,
          }]}
        >
          <code>
            <pre
              css={{
                margin: 0,
              }}
            >
              {tokens.map((token, index) => {
                let tk: LeafToken[];

                if (isMarker(token)) {
                  const locIndex = locIndexMap.get(token.loc)!;

                  if (frame) {
                    const record = frame.records[locIndex];

                    return (
                      <Marker
                        key={token.loc}
                        collectorId={collectorId}
                        frameId={frame.id}
                        locIndex={locIndex}
                        marker={token as MarkerBlock}
                        object={record}
                        updatedTimes={frame.updatedTimes[locIndex]}
                        updated={frame.updatedIds.includes(locIndex)}
                      />
                    );
                  }

                  tk = token.children;
                } else {
                  tk = token;
                }

                // eslint-disable-next-line react/no-array-index-key
                return <Tokens key={index} tokens={tk} />;
              })}
            </pre>
          </code>
        </div>
        {
          frame && (
            <div
              css={{
                overflow: 'auto',
                flex: 1,
                flexGrow: 1,
                padding: '0 12px',
              }}
            >
              <PropsView
                props={frame.props}
                updatedProps={frame.updatedProps}
                updatedTimes={frame.propsUpdatedTimes}
              />
            </div>
          )
        }
      </div>
    </div>
  );
}

export default React.memo(FrameView);
