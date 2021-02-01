/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import useSWR from 'swr';

function useTest() {
  const [state] = useState({});
  return state;
}

/**
 * @component
 */
export default React.memo((props) => {
  const { data } = useSWR('/');

  const obj = useTest();

  const { count, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
    >
      {count}
    </button>
  );
});
