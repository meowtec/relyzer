import { PropsWithChildren, useContext } from 'react';
import { useLocalStorage } from 'react-use';
import { TrackChanges } from '@material-ui/icons';
import { Paper, Button, Tooltip } from '@material-ui/core';
import { FrameVisibleContext, RenderRootContext } from '../context';

interface InspectFrameUserConfig {
  fold: boolean;
  height: number;
}

const defaultUserConfig: InspectFrameUserConfig = {
  fold: false,
  height: 300,
};

const buttonWidth = 48;

export default function InspectFrame({ children }: PropsWithChildren<{}>) {
  const { portalRoot } = useContext(RenderRootContext);
  const [
    config = defaultUserConfig,
    setConfig,
  ] = useLocalStorage('__REACT_HOOK_DEBUGGER_FOLD__', defaultUserConfig);

  return (
    <div
      css={{
        position: 'fixed',
        zIndex: 1000,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Paper
        elevation={3}
        css={{
          width: config.fold ? buttonWidth : 'auto',
        }}
      >
        <div
          css={{
            borderBottom: config.fold ? 0 : '1px solid #eee',
          }}
        >
          <Tooltip
            title={config.fold ? '展开调试器' : '收起'}
            PopperProps={{ container: portalRoot }}
          >
            <Button
              onClick={() => setConfig({ ...config, fold: !config.fold })}
              css={{
                background: '#fff',
                width: buttonWidth,
                fontSize: 14,
              }}
            >
              <TrackChanges
                css={{
                  color: config.fold ? '#0cf' : '#ccc',
                }}
              />
            </Button>
          </Tooltip>
        </div>
        <div
          css={{
            display: config.fold ? 'none' : 'block',
          }}
          style={{ height: config.height }}
        >
          <FrameVisibleContext.Provider value={!config.fold}>
            {children}
          </FrameVisibleContext.Provider>
        </div>
      </Paper>
    </div>
  );
}
