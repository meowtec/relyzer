/* eslint-disable no-param-reassign */
import { flatMap } from 'lodash';
import type * as babel from '@babel/core';
import jsx from '@babel/plugin-syntax-jsx';
import {
  ArrayPattern,
  ArrowFunctionExpression,
  BlockStatement,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  Node,
  ObjectPattern,
  SourceLocation,
} from '@babel/types';
import { addNamed } from '@babel/helper-module-imports';
import type { VisitNodeObject } from '@babel/traverse';
import {
  utils,
  ObservedMeta,
  Loc,
  ComponentMetaData,
  VIRTUAL_LOC,
} from '@relyzer/shared';
import { parse as parseComment } from 'comment-parser';
import { obj2ast } from './object-ast';

export interface RelyzerBabelPluginOptions {
  autoDetect?: boolean;
  include?: string[];
  exclude?: string[];
}

const runtimePackageName = '@relyzer/runtime';

const randomId = process.env.NODE_ENV === 'test'
  ? () => 'RANDOM'
  : utils.randomId;

function removeNull<T>(
  array: ReadonlyArray<T | null | undefined>,
) {
  return array.filter((x) => x != null) as T[];
}

type FunctionExpressionOrDeclaration =
  | FunctionExpression
  | FunctionDeclaration
  | ArrowFunctionExpression;

interface PerfScopeStack {
  code: string;
  nodePath: babel.NodePath<FunctionExpressionOrDeclaration>;
  blockPath: babel.NodePath<BlockStatement>;
  identifier: Identifier;
  return: PerfScopeStack | null;
  observedList: ObservedMeta[];
  isAutoDetected: boolean;
}

interface VisitorState extends babel.PluginPass {
  collectorScopeStack: PerfScopeStack | null;
}

const transformBabelLoc = (loc: SourceLocation): Loc => [
  loc.start.line,
  loc.start.column,
  loc.end.line,
  loc.end.column,
];

const getRelativeLoc = (offset: SourceLocation, child: SourceLocation): Loc => {
  const column = (position: SourceLocation['start']) => position.column - (position.line === offset.start.line ? offset.start.column : 0);

  return [
    child.start.line - offset.start.line,
    column(child.start),
    child.end.line - offset.start.line,
    column(child.end),
  ];
};

const buildLocStr = (loc: SourceLocation) => utils.stringifyLoc(transformBabelLoc(loc));

const isFirstCap = (str: string) => /^[A-Z]/.test(str);

const isFirstCapFunction = (
  nodePath: babel.NodePath<FunctionExpressionOrDeclaration>,
  b: typeof babel,
) => {
  /**
   * function Name() {}
   */
  if (
    nodePath.isFunctionDeclaration()
    && isFirstCap(nodePath.node.id?.name ?? '')
  ) return true;

  /**
   * const A = function() {}
   * const A = () => {}
   */
  if (
    (nodePath.isFunctionExpression() || nodePath.isArrowFunctionExpression())
    && nodePath.parentPath.isVariableDeclarator()
    && b.types.isIdentifier(nodePath.parentPath.node.id)
    && isFirstCap(nodePath.parentPath.node.id.name)
  ) return true;

  /**
   * const A = memo(() => {})
   * const A = memo(funct() => {})
   */
  if (
    (nodePath.isFunctionExpression() || nodePath.isArrowFunctionExpression())
    && nodePath.parentPath.isCallExpression()
    && nodePath.parentPath.parentPath.isVariableDeclarator()
    && b.types.isIdentifier(nodePath.parentPath.parentPath.node.id)
    && isFirstCap(nodePath.parentPath.parentPath.node.id.name)
  ) return true;

  return false;
};

const isComponentComments = (comments: readonly babel.types.Comment[] | null) => comments?.some((comment) => {
  const parsedComment = parseComment(`/*${comment.value}*/`);
  return parsedComment.some((c) => c.tags.some((tag) => tag.tag === 'component'));
});

const isDirectivedBlockment = (
  node: babel.types.BlockStatement,
) => node.directives.some(
  (directive) => directive.value.value === 'use relyzer',
);

const detectIsNodePathComponent = (
  nodePath: babel.NodePath<FunctionExpressionOrDeclaration>,
  b: typeof babel,
) => {
  let p: babel.NodePath<any> = nodePath;

  /**
   * detect for comment `@component`
   */
  while (p && p.type !== 'BlockStatement') {
    if (isComponentComments(p.node.leadingComments)) {
      return true;
    }

    p = p.parentPath;
  }

  /**
   * detect for 'use relyzer'
   */
  if (
    b.types.isBlockStatement(nodePath.node.body)
    && isDirectivedBlockment(nodePath.node.body)
  ) {
    return true;
  }

  return false;
};

const observeExpr = (
  {
    t,
    scope,
    expr,
    type,
    name,
    loc,
  }: {
    t: typeof babel.types,
    scope: PerfScopeStack,
    expr: Expression,
    type: ObservedMeta['type'],
    name: string,
    loc?: SourceLocation | null,
  },
) => {
  if (loc == null) return null;
  const { observedList, nodePath, identifier } = scope;

  const locStr = utils.stringifyLoc(getRelativeLoc(nodePath.node.loc!, loc));
  if (observedList.find((item) => item.loc === locStr)) return null;

  const count = observedList.push({
    type,
    loc: locStr,
    name,
  });

  return t.callExpression(
    t.identifier(identifier.name),
    [expr, t.numericLiteral(count - 1)],
  );
};

const shouldResolveFile = (filename: string, options: RelyzerBabelPluginOptions): boolean => {
  if (!filename) {
    return true;
  }

  if ((
    options.include && !options.include.some((item) => filename.includes(item))
  )) {
    return false;
  }

  const exclude = options.exclude ?? ['node_modules'];

  if (exclude.some((item) => filename.includes(item))) {
    return false;
  }

  return true;
};

export default function relyzerBabel(bb: typeof babel): babel.PluginObj<VisitorState> {
  const t = bb.types;
  // add `const collect = useRelyzer(code, loc)`
  const functionVisit: VisitNodeObject<VisitorState, any> = {
    enter(nodePath: babel.NodePath<FunctionExpressionOrDeclaration>, state) {
      const options = (state.opts as RelyzerBabelPluginOptions);
      if (!shouldResolveFile(state.filename, options)) {
        return;
      }
      const isAutoDetected = !!(options.autoDetect && isFirstCapFunction(nodePath, bb));

      if (
        (isAutoDetected || detectIsNodePathComponent(nodePath, bb))
        && nodePath.node.loc
      ) {
        const code = this.file.code.slice(nodePath.node.start!, nodePath.node.end!);

        const blockPath = nodePath.get('body');

        if (!blockPath.isBlockStatement()) return;

        const perfIdentifier = blockPath.scope.generateUidIdentifier('p');

        state.collectorScopeStack = {
          code,
          blockPath,
          nodePath,
          identifier: perfIdentifier,
          return: state.collectorScopeStack,
          observedList: [],
          isAutoDetected,
        };
      }
    },

    exit(nodePath: babel.NodePath<FunctionExpressionOrDeclaration>, state) {
      const { collectorScopeStack } = state;
      const { node } = nodePath;
      if (collectorScopeStack?.nodePath !== nodePath || !node.loc) {
        return;
      }

      const importName = addNamed(nodePath, 'useRelyzer', runtimePackageName);
      const {
        blockPath,
        code,
        identifier,
        observedList,
      } = collectorScopeStack;

      const param: ComponentMetaData = {
        id: randomId(),
        code,
        loc: buildLocStr(node.loc),
        observedList,
        shouldDetectCallStack: collectorScopeStack.isAutoDetected,
      };

      const useRelyzerDeclaration = t.variableDeclaration('const', [
        t.variableDeclarator(
          identifier,
          t.callExpression(
            t.identifier(importName.name),
            [obj2ast(param, bb)],
          ),
        ),
      ]);

      const beforeInsertedNodes: Node[] = [useRelyzerDeclaration];

      let [propsParam] = node.params;
      const originalPropsParam = propsParam;

      if (!propsParam || t.isObjectPattern(propsParam)) {
        propsParam = blockPath.scope.generateUidIdentifier('props');
        node.params[0] = propsParam;
      }

      if (t.isIdentifier(propsParam)) {
        const observePropsExpr = t.callExpression(
          t.identifier(identifier.name),
          [t.identifier(propsParam.name), t.numericLiteral(VIRTUAL_LOC.PROPS)],
        );

        beforeInsertedNodes.push(t.expressionStatement(observePropsExpr));

        if (t.isObjectPattern(originalPropsParam)) {
          const propsPatternDeclaration = t.variableDeclaration('let', [
            t.variableDeclarator(
              originalPropsParam,
              t.identifier(propsParam.name),
            ),
          ]);

          beforeInsertedNodes.push(propsPatternDeclaration);
        }
      }

      blockPath.unshiftContainer(
        'body',
        beforeInsertedNodes,
      );

      state.collectorScopeStack = collectorScopeStack.return;
    },
  };

  const visitor: babel.Visitor<VisitorState> = {
    FunctionDeclaration: functionVisit,
    FunctionExpression: functionVisit,
    ArrowFunctionExpression: functionVisit,

    /**
     * collect `const xxx =`
     */
    VariableDeclaration(nodePath, { collectorScopeStack }) {
      if (!collectorScopeStack || collectorScopeStack.nodePath !== nodePath.parentPath.parentPath) return;
      // if (nodePath.node.kind !== 'const') return;

      const identifiers = flatMap<babel.types.VariableDeclarator, Identifier>(nodePath.node.declarations, (declaration) => {
        const extractArrayPatternIdentifiers = (arrayPattern: ArrayPattern): Identifier[] => flatMap(arrayPattern.elements, (element) => {
          switch (element?.type) {
            case 'Identifier':
              return element;

            case 'ObjectPattern':
              // eslint-disable-next-line @typescript-eslint/no-use-before-define
              return extractObjectPatternIdentifiers(element);

            case 'ArrayPattern':
              return extractArrayPatternIdentifiers(element);

            case 'RestElement':
              if (element.argument.type === 'Identifier') {
                return [element.argument];
              }
              break;

            case 'AssignmentPattern':
              if (element.left.type === 'Identifier') {
                return [element.left];
              }
              break;
            default:
          }

          return [];
        });

        const extractObjectPatternIdentifiers = (objectPattern: ObjectPattern): Identifier[] => flatMap(objectPattern.properties, (property) => {
          switch (property.type) {
            case 'RestElement':
              if (property.argument.type === 'Identifier') {
                return [property.argument];
              }
              break;
            case 'ObjectProperty': {
              const { value } = property;

              switch (value.type) {
                case 'Identifier':
                  return [value];
                case 'ArrayPattern':
                  return extractArrayPatternIdentifiers(value);
                case 'AssignmentPattern':
                  if (value.left.type === 'Identifier') {
                    return [value.left];
                  }
                  break;
                default:
              }
              break;
            }
            default:
          }

          return [];
        });

        switch (declaration.id.type) {
          case 'ObjectPattern':
            return extractObjectPatternIdentifiers(declaration.id);
          case 'ArrayPattern':
            return extractArrayPatternIdentifiers(declaration.id);
          case 'Identifier':
            if (!t.isLiteral(declaration.init)) {
              return [declaration.id];
            }
            break;
          default:
        }

        return [];
      });

      // add `perf(name, loc)`
      const perfExps = removeNull(identifiers.map(
        (identifier) => {
          const expr = observeExpr({
            t,
            scope: collectorScopeStack,
            expr: t.identifier(identifier.name),
            loc: identifier.loc,
            type: 'var',
            name: identifier.name,
          });
          return expr ? t.expressionStatement(expr) : null;
        },
      ));

      if (perfExps.length) {
        nodePath.insertAfter(perfExps);
      }
    },

    /**
     * collect `useCallback / useMemo` dependencies
     */
    CallExpression(nodePath, { collectorScopeStack }) {
      const block = nodePath.find((path) => path.type === 'BlockStatement') as babel.NodePath<BlockStatement> | null;

      if (!collectorScopeStack || collectorScopeStack.nodePath !== block?.parentPath) return;
      const { node } = nodePath;
      const depsArg = node.arguments[1];

      if (
        t.isIdentifier(node.callee)
        && ['useCallback', 'useMemo'].includes(node.callee.name)
        && t.isArrayExpression(depsArg)
      ) {
        depsArg.elements = depsArg.elements.map((dep) => {
          const expr = t.isExpression(dep) && observeExpr({
            t,
            scope: collectorScopeStack,
            expr: dep,
            loc: dep.loc,
            type: 'dep',
            name: t.isIdentifier(dep) ? dep.name : dep.type,
          });

          return expr || dep;
        });
      }
    },

    /**
     * collect jsx attribute for non native element
     */
    JSXAttribute(nodePath, { collectorScopeStack }) {
      const funcPath = nodePath.find(
        (path) => (
          path.type === 'FunctionExpression'
          || path.type === 'FunctionDeclaration'
          || path.type === 'ArrowFunctionExpression'
        ),
      ) as babel.NodePath<FunctionExpressionOrDeclaration> | null;

      const { node, parentPath } = nodePath;

      const attrName = node.name;

      if (
        !collectorScopeStack
        || collectorScopeStack.nodePath !== funcPath
        || !parentPath.isJSXOpeningElement()
        || (t.isJSXIdentifier(parentPath.node.name) && /^[a-z]/.test(parentPath.node.name.name)) // exclude native element like div
        || !attrName.loc
        || t.isStringLiteral(node.value)
      ) return;

      const value = t.isJSXExpressionContainer(node.value)
        ? node.value.expression
        : node.value;

      if (!value || t.isLiteral(value) || t.isJSXEmptyExpression(value)) return;

      const expr = observeExpr({
        t,
        scope: collectorScopeStack,
        expr: value,
        loc: attrName.loc,
        type: 'attr',
        name: t.isJSXIdentifier(attrName)
          ? attrName.name
          : `${attrName.namespace.name}:${attrName.name.name}`,
      });

      if (expr) {
        node.value = t.jsxExpressionContainer(expr);
      }
    },
  };

  return {
    visitor,
    inherits: jsx,
  };
}
