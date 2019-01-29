import { Rule, SchematicContext, Tree, apply, url, template, branchAndMerge, mergeWith, move } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function login(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    const templateSource = apply(
      url('./files'),
      [
        template({
          ...strings,
          ..._options,
        }),
        move('./src/app')
      ]
    );

    return branchAndMerge(mergeWith(templateSource))(tree, _context);
  };
}
