import {
  Fragment,
  PropsWithChildren,
  Reducer,
  useCallback,
  useContext,
} from 'react';
import { useWindowSize } from 'react-use';
import { TrackChanges } from '@material-ui/icons';
import { Paper, Button, Tooltip } from '@material-ui/core';
import clamp from 'lodash/clamp';
import { css } from '@emotion/react';
import { FrameVisibleContext, RenderRootContext } from '../context';
import DevtoolControl from './control';
import { DevtoolPlacement } from '../types';
import { useDrag, useLocalStorageReducer } from '../hooks';
import GlobalCss from '../components/global-css';

interface InspectFrameUserConfig {
  fold: boolean;
  height: number;
  width: number;
  placement: DevtoolPlacement;
}

const defaultUserConfig: InspectFrameUserConfig = {
  fold: false,
  height: 300,
  width: 300,
  placement: DevtoolPlacement.bottom,
};

const BUTTON_WIDTH = 48;
const BUTTON_HEIGHT = 36;
const MOUSE_PADDING = 3;

const isPlacementVertial = (placement: DevtoolPlacement) => placement % 2 === 1;

const computeSize = (
  origialWidth: number,
  origialHeight: number,
  winWidth: number,
  winHeight: number,
  dx: number,
  dy: number,
  placement: DevtoolPlacement,
) => (isPlacementVertial(placement) ? {
  width: clamp(
    origialWidth + (placement === DevtoolPlacement.left ? dx : -dx),
    100,
    winWidth,
  ),
} : {
  height: clamp(
    origialHeight + (placement === DevtoolPlacement.top ? dy : -dy),
    100,
    winHeight,
  ),
});

const configReducer: Reducer<InspectFrameUserConfig, Partial<InspectFrameUserConfig>> = (state, partial) => ({
  ...state,
  ...partial,
});

const hiddenCss = css({
  display: 'none',
});

const dragHighlightCss = css({
  background: '#ffee00',
});

export default function InspectFrame({
  children,
  onPopout,
}: PropsWithChildren<{
  onPopout(): void;
}>) {
  const { width: winWidth, height: winHeight } = useWindowSize();
  const { portalRoot } = useContext(RenderRootContext);

  const [config, setConfig] = useLocalStorageReducer('__RELYZER_DEVTOOL_CONFIG__', configReducer, defaultUserConfig);

  const {
    fold,
    width,
    height,
    placement = DevtoolPlacement.bottom,
  } = config;

  const handlePlacementChange = useCallback((newPlacement: DevtoolPlacement) => {
    if (newPlacement === DevtoolPlacement.external) {
      onPopout();
      return;
    }
    setConfig({
      placement: newPlacement,
    });
  }, [onPopout, setConfig]);

  const isVertical = isPlacementVertial(placement);

  const autoSideProperty = {
    [DevtoolPlacement.bottom]: 'top',
    [DevtoolPlacement.top]: 'bottom',
    [DevtoolPlacement.left]: 'right',
    [DevtoolPlacement.right]: 'left',
    [DevtoolPlacement.external]: '',
  }[placement];

  const handleDragComplete = useCallback(
    ({ dx: lastDx, dy: lastDy }: { dx: number; dy: number }) => {
      setConfig(computeSize(
        width,
        height,
        winWidth,
        winHeight,
        lastDx,
        lastDy,
        placement,
      ));
    },
    [placement, setConfig, height, width, winHeight, winWidth],
  );

  const {
    dx,
    dy,
    isDragging,
    handleMouseDown,
  } = useDrag({
    onComplete: handleDragComplete,
  });

  const foldHiddenCss = fold ? hiddenCss : null;

  const handleCursor = isVertical ? 'ew-resize' : 'ns-resize';

  return (
    <Fragment>
      <GlobalCss
        styles={isDragging ? {
          html: {
            cursor: handleCursor,
            pointerEvents: 'none',
          },
        } : null}
      />
      <div
        css={{
          position: 'fixed',
          zIndex: 1000,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: isDragging ? 'none' : 'auto',
        }}
        style={{
          [autoSideProperty]: 'auto',
          ...computeSize(
            width,
            height,
            winWidth,
            winHeight,
            dx,
            dy,
            placement,
          ),
          ...fold ? {
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
          } : null,
        }}
      >
        <Paper
          elevation={3}
          css={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            css={{
              borderBottom: fold ? 0 : '1px solid #eee',
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Tooltip
              title={fold ? '展开调试器' : '收起'}
              PopperProps={{ container: portalRoot }}
            >
              <Button
                onClick={() => setConfig({ fold: !fold })}
                css={{
                  background: '#fff',
                  width: BUTTON_WIDTH,
                  height: BUTTON_HEIGHT,
                  fontSize: 14,
                }}
              >
                <TrackChanges
                  css={{
                    color: fold ? '#0cf' : '#ccc',
                  }}
                />
              </Button>
            </Tooltip>
            <DevtoolControl
              placement={placement}
              onPlacementChange={handlePlacementChange}
              css={foldHiddenCss}
            />
          </div>
          <div
            css={[
              {
                flex: 1,
                overflow: 'hidden',
              },
              foldHiddenCss,
            ]}
          >
            <FrameVisibleContext.Provider value={!fold}>
              {children}
            </FrameVisibleContext.Provider>
          </div>
        </Paper>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          onMouseDown={handleMouseDown}
          css={[
            {
              position: 'absolute',
              '&::after': {
                content: '""',
                position: 'absolute',
                ...isVertical ? {
                  width: MOUSE_PADDING * 2 + 1,
                  left: -MOUSE_PADDING,
                  top: 0,
                  bottom: 0,
                } : {
                  height: MOUSE_PADDING * 2 + 1,
                  top: -MOUSE_PADDING,
                  left: 0,
                  right: 0,
                },
              },
              '&:hover': dragHighlightCss,
              ...isVertical ? {
                cursor: 'ew-resize',
                top: 0,
                bottom: 0,
                width: 1,
              } : {
                cursor: 'ns-resize',
                left: 0,
                right: 0,
                height: 1,
              },
              [autoSideProperty]: 0,
            },
            foldHiddenCss,
            isDragging ? dragHighlightCss : null,
          ]}
        />
      </div>
    </Fragment>
  );
}
