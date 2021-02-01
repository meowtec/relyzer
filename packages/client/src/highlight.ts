import { Loc, utils } from '@relyzer/shared';
import Prism from './prismjs-lite';
import jsx from './prismjs-lite/jsx';

jsx(Prism);

export interface LeafToken {
  types: string[];
  content: string;
  length: number;
}

export interface MarkerBlock {
  type: '$marker';
  loc: string;
  range: [start: number, end: number];
  children: LeafToken[];
}

interface TextLine {
  offset: number;
  text: string;
}

export const isMarker = (marker: MarkerBlock | LeafToken[]): marker is MarkerBlock => (
  !Array.isArray(marker) && marker.type === '$marker'
);

const flattenPrismTokens = (tokens: Prism.TokenStream, types?: string[]): LeafToken[] => {
  if (Array.isArray(tokens)) {
    return tokens.flatMap((token) => flattenPrismTokens(token, types));
  }

  if (typeof tokens === 'string') {
    return [{
      types: types || [],
      content: tokens,
      length: tokens.length,
    }];
  }

  const typesJoin = types?.includes(tokens.type)
    ? types
    : [...(types || []), tokens.type];

  if (typeof tokens.content === 'string') {
    return [{
      types: typesJoin,
      content: tokens.content,
      length: tokens.length,
    }];
  }

  return flattenPrismTokens(tokens.content, typesJoin);
};

const sliceToken = (
  token: LeafToken,
  start: number,
  end?: number,
): LeafToken => {
  const text = token.content.slice(start, end);
  return {
    ...token,
    content: text,
    length: text.length,
  };
};

const splitLines = (code: string): TextLine[] => {
  const reg = /\n|\r\n|$/g;
  let offset = 0;
  let res: RegExpExecArray | null = null;

  const lines: TextLine[] = [];

  // eslint-disable-next-line no-cond-assign
  while (res = reg.exec(code)) {
    if (res) {
      const brlen = res[0].length;
      const text = code.slice(offset, res.index);
      lines.push({
        text,
        offset,
      });

      // EOF
      if (brlen === 0) break;
      offset = res.index + brlen;
    }
  }

  return lines;
};

const codeLocToCharRange = (
  lines: TextLine[],
  loc: Loc,
): [startCharIndex: number, endCharIndex: number] => [
  lines[loc[0]].offset + loc[1],
  lines[loc[2]].offset + loc[3],
];

export default function parse(
  code: string,
  markerLocs: Loc[],
) {
  const tokens = flattenPrismTokens(Prism.tokenize(code, Prism.languages.jsx));
  const lines = splitLines(code);
  const markerRanges = markerLocs.map((loc) => codeLocToCharRange(lines, loc)).sort((a, b) => a[0] - b[0]);

  const tokenSections: Array<LeafToken[] | MarkerBlock> = [[]];

  const pushToken = (token: LeafToken) => {
    const last = tokenSections[tokenSections.length - 1];
    if (Array.isArray(last)) {
      last.push(token);
    } else {
      tokenSections.push([token]);
    }
  };

  let tokenIndex = 0;
  let token: LeafToken = tokens[0];
  let currentMarker: null | MarkerBlock = null;
  let markerIndex = 0;
  let offset = 0;

  /* eslint-disable no-continue */
  while (token) {
    const { length } = token;
    const nextTokenOffset = offset + length;
    const markerRange = markerRanges[markerIndex];
    const markerLoc = markerLocs[markerIndex];

    if (currentMarker) {
      // in marker

      if (currentMarker.range[1] < nextTokenOffset) {
        // exit marker

        const tokenLen = currentMarker.range[1] - offset;
        currentMarker.children.push(sliceToken(token, 0, tokenLen));
        token = sliceToken(token, tokenLen);
        offset += tokenLen;

        tokenSections.push(currentMarker);
        currentMarker = null;
        markerIndex += 1;
        continue;
      }

      currentMarker.children.push(token);
    } else {
      // not in marker

      if (markerRange && markerRange[0] < offset + length) {
        // enter marker

        const marker: MarkerBlock = {
          type: '$marker',
          children: [],
          loc: utils.stringifyLoc(markerLoc),
          range: markerRange,
        };

        currentMarker = marker;

        if (markerRange[0] > offset) {
          const preLength = markerRange[0] - offset;
          pushToken(sliceToken(token, 0, preLength));
          token = sliceToken(token, preLength);
          offset += preLength;
        }

        continue;
      }

      pushToken(token);
    }

    tokenIndex += 1;
    token = tokens[tokenIndex];
    offset = nextTokenOffset;
  }
  /* eslint-enable no-continue */

  return tokenSections;
}
