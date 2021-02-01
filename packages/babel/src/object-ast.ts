import type * as babel from '@babel/core';

export function obj2ast(object: any, b: typeof babel):
| babel.types.Identifier
| babel.types.Literal
| babel.types.ArrayExpression
| babel.types.ObjectExpression {
  const t = b.types;

  switch (typeof object) {
    case 'number':
      return t.numericLiteral(object);
    case 'string':
      return t.stringLiteral(object);
    case 'undefined':
      return t.identifier('undefined');
    case 'object':
      if (object === null) {
        return t.nullLiteral();
      }

      if (Array.isArray(object)) {
        return t.arrayExpression(object.map((item) => obj2ast(item, b)));
      }

      return t.objectExpression(
        Object.keys(object).map(
          (key) => t.objectProperty(t.stringLiteral(key), obj2ast(object[key], b)),
        ),
      );
    default:
      throw new Error('unsupport type');
  }
}
