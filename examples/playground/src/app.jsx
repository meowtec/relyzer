/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import Foo from './foo';
import './app.css';

/**
 * @component
 */
export default function TestApp() {
  const [count, setCount] = useState(0);

  const b = 4;

  const c = {};

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <Foo
      count={count}
      onClick={handleClick}
      staticProp={3}
    />
  );
}
