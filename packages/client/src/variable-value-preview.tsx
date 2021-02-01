import React from 'react';
import { ObjectSummary } from '@relyzer/shared';
import { commonStyles } from './styles';

function VariablePreview({ value: [type, val], onClick }: {
  value: ObjectSummary,
  onClick: () => void,
}) {
  let text: string;

  switch (type) {
    case 'string':
      text = `'${val}'`;
      break;
    case 'array':
      text = `[x${val}]`;
      break;
    case 'object':
      text = '{...}';
      break;
    case 'function':
      text = 'ƒ()';
      break;
    default:
      text = String(val);
  }

  return (
    <button
      type="button"
      css={[commonStyles.plainButton, {
        background: '#f5f5f5',
        padding: '2px 4px',
        borderRadius: 4,
        cursor: 'pointer',
        color: ({
          string: '#a31515',
          number: '#098658',
        } as Record<string, string>)[type] || '#0000ff',
        '&:hover': {
          background: '#eeeeff',
        },
        '&:active': {
          background: '#ccc',
        },
      }]}
      onClick={onClick}
    >
      <code>
        {text}
      </code>
    </button>
  );
}

export default React.memo(VariablePreview);
