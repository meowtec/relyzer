import React, { Fragment, useContext, useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { BugReport } from '@material-ui/icons';
import { RenderRootContext } from './context';

export default function CodeTokenDebug({
  onDebug,
}: {
  onDebug(all: boolean): void;
}) {
  const { portalRoot } = useContext(RenderRootContext);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Button
        // color="default"
        size="small"
        aria-controls="relyzer-log-menu"
        aria-haspopup="true"
        style={{ marginLeft: 12 }}
        startIcon={<BugReport />}
        onClick={handleClick}
      >
        LOG
      </Button>
      <Menu
        id="relyzer-log-menu"
        container={portalRoot}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handlePopoverClose}
      >
        <MenuItem onClick={() => onDebug(false)}>打印出当前值</MenuItem>
        <MenuItem onClick={() => onDebug(true)}>打印出近 100 次值</MenuItem>
      </Menu>
    </Fragment>
  );
}
