import React from 'react';
import { parseComponentDisplayName } from './utils';

interface EmptyProps {
  selectedComponentName: string | null | undefined;
}

export default function Empty({ selectedComponentName }: EmptyProps) {
  const parsedNames = parseComponentDisplayName(selectedComponentName || '');

  return (
    <div
      css={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        padding: 20,
      }}
    >
      {
        typeof selectedComponentName === 'string'
          ? (
            <span>
              组件
              <code
                css={{
                  color: '#905',
                  padding: '0 8px',
                }}
              >
                &lt;
                {parsedNames[parsedNames.length - 1]}
                &gt;
              </code>
              无法被观测。可能是因为缺少
              <code
                css={{
                  padding: '0 8px',
                }}
              >
                @component
              </code>
              注释，或者 React Devtool 不是最新版本。
            </span>
          )
          : '请使用 React Devtool 选中需要观测的组件'
      }
    </div>
  );
}
