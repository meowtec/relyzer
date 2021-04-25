import ReactDOM from 'react-dom';
import {
  PropsWithChildren, useContext, useEffect, useMemo,
} from 'react';
import { RenderRootContext } from '../../context';

export default function ToBody({ children }: PropsWithChildren<{}>) {
  const container = useContext(RenderRootContext).portalRoot || document.body;
  const root = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    container.appendChild(root);
    return () => {
      container.removeChild(root);
    };
  }, [container, root]);

  return ReactDOM.createPortal(
    children,
    root,
  );
}
