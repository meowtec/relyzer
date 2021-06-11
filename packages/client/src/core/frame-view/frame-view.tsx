import {
  useCallback,
  useContext,
  useState,
  memo,
} from 'react';
import {
  ObservedMeta,
  PlainCollectorFrame,
} from '@relyzer/shared';
import CodeBlock from '../code-block';
import PropsView from '../props-view';
import UpdateHistory from '../history/history';
import { BridgeContext } from '../../context';
import { commonStyles } from '../../styles';

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
          flex: 1,
        }}
      >
        <div
          css={[commonStyles.customNativeScroll, {
            overflow: 'auto',
            flex: 1,
            flexGrow: 2,
            padding: 8,
            background: '#f6f6f6',
          }]}
        >
          <CodeBlock
            collectorId={collectorId}
            code={code}
            observedList={observedList}
            frame={frame}
          />
        </div>
        {
          frame && (
            <div
              css={{
                overflow: 'auto',
                flex: 1,
                flexGrow: 1,
                marginLeft: 12,
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

export default memo(FrameView);
