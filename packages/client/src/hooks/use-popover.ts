import React, {
  useCallback,
  useContext,
  useState,
} from 'react';
import { RenderRootContext } from '../context';
import useRefId from './use-ref-id';

export default function usePopover() {
  const id = useRefId();
  const [anchorEl, setAnchorEl] = useState(null);
  const { portalRoot } = useContext(RenderRootContext);

  const handleTrigger: React.EventHandler<any> = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    anchorProps: {
      'aria-describedby': id,
      onClick: handleTrigger,
    },
    popoverProps: {
      id,
      open: Boolean(anchorEl),
      anchorEl,
      onClose: handleClose,
      container: portalRoot,
    },
    close: handleClose,
  };
}
