import {
  useMemo,
  memo,
} from 'react';
import {
  ObservedMeta,
  PlainCollectorFrame,
  utils,
} from '@relyzer/shared';
import parse, { isMarker, LeafToken, MarkerBlock } from '../../utils/highlight';
import Marker from '../code-marker';
import Tokens from '../code-tokens';

interface CodeBlockProps {
  collectorId: number;
  code: string;
  observedList: ObservedMeta[];
  frame: PlainCollectorFrame | null;
}

function CodeBlock({
  collectorId,
  code,
  observedList,
  frame,
}: CodeBlockProps) {
  const tokens = useMemo(
    () => parse(code, observedList.map((item) => utils.parseLoc(item.loc))),
    [code, observedList],
  );

  const locIndexMap = useMemo(
    () => new Map(observedList.map((item, index) => [item.loc, index])),
    [observedList],
  );

  return (
    <code>
      <pre
        css={{
          margin: 0,
          lineHeight: 1.8,
        }}
      >
        {tokens.map((token, index) => {
          let tk: LeafToken[];

          if (isMarker(token)) {
            const locIndex = locIndexMap.get(token.loc)!;

            if (frame) {
              const record = frame.records[locIndex];

              return (
                <Marker
                  key={token.loc}
                  collectorId={collectorId}
                  frameId={frame.id}
                  locIndex={locIndex}
                  marker={token as MarkerBlock}
                  object={record}
                  updatedTimes={frame.updatedTimes[locIndex]}
                  updated={frame.updatedIds.includes(locIndex)}
                />
              );
            }

            tk = token.children;
          } else {
            tk = token;
          }

          // eslint-disable-next-line react/no-array-index-key
          return <Tokens key={index} tokens={tk} />;
        })}
      </pre>
    </code>
  );
}

export default memo(CodeBlock);
