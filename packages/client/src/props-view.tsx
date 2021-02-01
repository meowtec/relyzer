import React from 'react';
import { ObjectSummary } from '@relyzer/shared';
import { atomColor } from './styles';

interface PropsViewProps {
  props: Record<number, ObjectSummary>;
  updatedProps: string[];
  updatedTimes: Record<string, number>;
}

function PropsView({
  props,
  updatedProps,
  updatedTimes,
}: PropsViewProps) {
  const removedProps = updatedProps.filter((prop) => !Reflect.has(props, prop));
  const existedProps = Object.keys(props);
  const allProps = [...removedProps, ...existedProps];
  const updatedPropsLength = updatedProps.length;

  return (
    <div>
      <h3
        css={{
          margin: '8px 0',
          fontWeight: 'normal',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>props</span>
        <span
          css={{
            color: updatedPropsLength
              ? atomColor.danger()
              : atomColor.success(),
          }}
        >
          { updatedPropsLength ? `${updatedPropsLength} prop${updatedPropsLength > 1 ? 's' : ''} changed` : 'unchanged' }
        </span>
      </h3>
      <ul
        css={{
          listStyle: 'none',
          margin: 0,
          padding: '0 12px',

          '& li': {
            display: 'flex',
            justifyContent: 'space-between',
          },
        }}
      >
        {allProps.map((prop, index) => (
          <li
            css={
            index < removedProps.length
              ? {
                color: atomColor.warn(),
                textDecorationColor: atomColor.danger(),
                textDecorationThickness: 2,
                textDecorationLine: 'line-through',
              }
              : updatedProps.includes(prop)
                ? {
                  color: atomColor.warn(),
                }
                : {}
          }
            key={prop}
          >
            <code>{prop}</code>
            <span>
              x
              <code>{updatedTimes[prop]}</code>
            </span>
          </li>
        ))}
      </ul>
      {
        allProps.length === 0 ? (
          <div
            css={{
              color: '#aaa',
              textAlign: 'center',
            }}
          >
            no props
          </div>
        ) : null
      }
    </div>
  );
}

export default React.memo(PropsView);
