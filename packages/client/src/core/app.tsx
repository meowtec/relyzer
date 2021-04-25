import immer from 'immer';
import {
  useContext,
  useEffect,
  useState,
} from 'react';
import { Global } from '@emotion/react';
import {
  ClientBridge,
} from '@relyzer/shared';
import { FrameVisibleContext, BridgeContext, AppState } from '../context';
import FrameView from './frame-view/frame-view';
import Empty from './not-available';
import { globalCss, highlightCss } from '../styles';

export default function App({
  bridge,
}: {
  bridge: ClientBridge;
}) {
  const [state, setState] = useState<AppState>({
    instance: null,
    bridge,
  });

  const appVisible = useContext(FrameVisibleContext);

  const { instance } = state;

  useEffect(() => {
    bridge.send('INIT', null);

    const unsubscribes = [
      bridge.listen('UPDATE', (update) => {
        setState((s) => immer(s, (draft) => {
          const { instance: inst } = draft;
          if (!inst || update.id !== inst.collector.id) return;
          inst.collector.latestFrame = update.latestFrame;
          inst.collector.updatedTimes = update.updatedTimes;
        }));
      }),

      bridge.listen('COMPONENT', (collector) => {
        if (collector?.id != null) {
          bridge.send('COMPONENT_OK', collector.id);
        }

        setState((s) => immer(s, (draft) => {
          draft.instance = collector ? {
            collector,
            frames: [],
          } : null;
        }));
      }),

      bridge.listen('RESPONSE_FRAME', ({ index, frame }) => {
        setState((s) => immer(s, (draft) => {
          if (
            draft.instance
            && draft.instance.collector.id === frame.pid
          ) {
            draft.instance.frames[index] = frame;
          }
        }));
      }),
    ];

    return () => unsubscribes.forEach((off) => off());
  }, [bridge]);

  return appVisible ? (
    <BridgeContext.Provider
      value={bridge}
    >
      <Global styles={globalCss + highlightCss} />
      <div
        style={{
          height: '100%',
          padding: 12,
        }}
      >
        {instance?.collector.id != null ? (
          <FrameView
            key={instance.collector.id}
            collectorId={instance.collector.id}
            code={instance.collector.component.code}
            observedList={instance.collector.component.observedList}
            updatedTimes={instance.collector.updatedTimes}
            frames={instance.frames}
            latestFrame={instance.collector.latestFrame || null}
          />
        ) : (
          <Empty selectedComponentName={instance?.collector.component.name} />
        )}
      </div>
    </BridgeContext.Provider>
  ) : null;
}
