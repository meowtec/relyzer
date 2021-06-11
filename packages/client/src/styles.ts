import { css } from '@emotion/react';

const createAlphaColor = (rgb: [number, number, number]) => (alpha?: number) => `rgba(${[...rgb, alpha ?? 1].join(', ')})`;

export const atomColor = {
  success: createAlphaColor([0, 204, 153]),
  danger: createAlphaColor([255, 48, 0]),
  warn: createAlphaColor([252, 109, 38]),
};

export const commonStyles = {
  plainButton: css({
    background: 'none',
    border: 0,
    padding: 0,
    fontSize: 'inherit',
  }),

  flexCenter: css({
    display: 'flex',
    alignItems: 'center',
  }),

  customNativeScroll: css({
    scrollbarWidth: 'thin',

    '&::-webkit-scrollbar': {
      appearance: 'none',

      '&:vertical': {
        width: 6,
      },

      '&:horizontal': {
        height: 6,
      },
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, .2)',

      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, .3)',
      },
    },
  }),
};

export const globalCss = /* css */ `
  :host, body {
    all: initial;
    cursor: inherit;
    font-size: 12px;
  }

  *:focus-visible {
    outline: 1px solid #99ccff;
  }

  *:focus:not(:focus-visible) {
    outline: 0;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  code, pre {
    font-family: "SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;
  }

  div .MuiPopover-root {
    z-index: 9999!important;
  }

  div .MuiMenuItem-root {
    font-size: 12px;
    min-height: 15px;
  }

  div .MuiSvgIcon-root {
    font-size: 14px;
  }

  div .MuiButton-root {
    min-width: 0;
  }
`;

export const highlightCss = /* css */ `
  /**
   * prism.js default theme for JavaScript, CSS and HTML
   * Based on dabblet (http://dabblet.com)
   * @author Lea Verou
   */
  .relyzer-code-comment,
  .relyzer-code-prolog,
  .relyzer-code-doctype,
  .relyzer-code-cdata {
    color: slategray;
  }

  .relyzer-code-punctuation {
    color: #999;
  }

  .relyzer-code-namespace {
    opacity: .7;
  }

  .relyzer-code-property,
  .relyzer-code-tag,
  .relyzer-code-boolean,
  .relyzer-code-number,
  .relyzer-code-constant,
  .relyzer-code-symbol,
  .relyzer-code-deleted {
    color: #905;
  }

  .relyzer-code-selector,
  .relyzer-code-attr-name,
  .relyzer-code-string,
  .relyzer-code-char,
  .relyzer-code-builtin,
  .relyzer-code-inserted {
    color: #690;
  }

  .relyzer-code-operator,
  .relyzer-code-entity,
  .relyzer-code-url,

  .relyzer-code-atrule,
  .relyzer-code-attr-value,
  .relyzer-code-keyword {
    color: #07a;
  }

  .relyzer-code-function,
  .relyzer-code-class-name {
    color: #DD4A68;
  }

  .relyzer-code-regex,
  .relyzer-code-important,
  .relyzer-code-variable {
    color: #e90;
  }

  .relyzer-code-important,
  .relyzer-code-bold {
    font-weight: bold;
  }
  .relyzer-code-italic {
    font-style: italic;
  }

  .relyzer-code-entity {
    cursor: help;
  }
`;
