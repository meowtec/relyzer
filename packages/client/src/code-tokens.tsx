import { LeafToken } from './highlight';

export default function Tokens({ tokens }: { tokens: LeafToken[] }) {
  return (
    <span>
      {
        tokens.map((token, index) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={token.types.map((t) => `relyzer-code-${t}`).join(' ')}
          >
            {token.content}
          </span>
        ))
      }
    </span>
  );
}
