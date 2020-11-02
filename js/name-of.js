// Utility functions for extracting identifier names from JS parse trees.

import Word from '../analysis/word';

export function methodDefinition(file, tree) {
  let key = tree.key;
  let name = (key.type === 'Identifier')
    ? key.name
    : null; // TODO: handle other key types like string literals
  return new Word(name, file, key);
}

export function classDeclaration(file, tree) {
  return identifier(file, tree.id);
}

export function identifier(file, tree) {
  return new Word(tree.name, file, tree);
}
