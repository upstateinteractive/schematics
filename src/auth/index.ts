import { Rule, SchematicContext, Tree, apply, url, template, branchAndMerge, mergeWith, move, chain } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { lazyLoadRoute } from './lazy-load';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function auth(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {

    // NOTE: 'name' is required, 
    _options.name = _options.name ? _options.name : 'x'; 
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

    return branchAndMerge(chain([
      mergeWith(templateSource),
      lazyLoadRoute(_options)
    ])
    )(tree, _context);
  };
}
