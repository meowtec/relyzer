declare module '@babel/helper-module-imports' {
  import { Identifier } from '@babel/types';
  import { NodePath } from '@babel/traverse';

  export function addNamed(
    path: NodePath<any>,
    name: string,
    source: string,
    options?: {
      nameHint?: string;
    },
  ): Identifier;
}
