import React, { FC } from 'react';
import { MoreVert } from '@material-ui/icons';
import { Button, Popover } from '@material-ui/core';
import { DevtoolPlacement } from '../types';
import { usePopover } from '../hooks';
import IconDockLeft from '../icons/dock-left';
import IconDockRight from '../icons/dock-right';
import IconDockTop from '../icons/dock-top';
import IconDockBottom from '../icons/dock-bottom';
import IconCopy from '../icons/copy';

interface DevtoolControlProps {
  placement: DevtoolPlacement;
  className?: string;
  onPlacementChange(placement: DevtoolPlacement): void;
}

const placementList: Array<{
  placement: DevtoolPlacement;
  Icon: FC;
}> = [
  {
    placement: DevtoolPlacement.top,
    Icon: IconDockTop,
  },
  {
    placement: DevtoolPlacement.bottom,
    Icon: IconDockBottom,
  },
  {
    placement: DevtoolPlacement.left,
    Icon: IconDockLeft,
  },
  {
    placement: DevtoolPlacement.right,
    Icon: IconDockRight,
  },
  {
    placement: DevtoolPlacement.external,
    Icon: IconCopy,
  },
];

function DevtoolControl({
  placement,
  className,
  onPlacementChange,
}: DevtoolControlProps) {
  const { anchorProps, popoverProps, close } = usePopover();

  const handleClick = (place: DevtoolPlacement) => {
    onPlacementChange(place);
    close();
  };

  return (
    <React.Fragment>
      <Button
        {...anchorProps}
        className={className}
      >
        <MoreVert />
      </Button>
      <Popover
        {...popoverProps}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div
          css={{
            padding: 8,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            css={{
              padding: '0 8px',
            }}
          >
            placement:
          </span>
          {
            placementList.map(({ placement: place, Icon }) => (
              <Button
                key={place}
                disabled={place === placement}
                onClick={() => handleClick(place)}
                css={{
                  color: '#666',

                  '&:disabled': {
                    color: '#0cf',
                  },
                }}
              >
                <Icon />
              </Button>
            ))
          }
        </div>
      </Popover>
    </React.Fragment>
  );
}

export default React.memo(DevtoolControl);
