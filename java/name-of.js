// Utility functions for extracting identifier names from Java parse trees.

import Word from '../analysis/word';

export function methodDeclaration(file, tree) {
  let id = tree.methodHeader[0].children.methodDeclarator[0].children.Identifier[0];
  return new Word(id.image, file, id);
}

export function normalClassDeclaration(file, tree) {
  let id = tree.typeIdentifier[0].children.Identifier[0];
  return new Word(id.image, file, id);
}

export function nodeWithIdentifier(file, tree) {
  let id = tree.Identifier[0];
  return new Word(id.image, file, id);
}
