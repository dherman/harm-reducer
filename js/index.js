import { parse } from 'espree';
import { Visitor } from 'esrecurse';
import * as nameOf from './name-of';

class Collector extends Visitor {
  constructor(file, results) {
    super();
    this.file = file;       // path
    this.results = results; // SearchResults
  }

  MethodDefinition(node) {
    this.results.checkDefinition(nameOf.methodDefinition(this.file, node));
    // Continue walking the tree.
    this.visitChildren(node);
  }

  ClassDeclaration(node) {
    this.results.checkDefinition(nameOf.classDeclaration(this.file, node));
    // Continue walking the tree.
    this.visitChildren(node);
  }

  MemberExpression(node) {
    if (node.property.type === 'Identifier') {
      this.results.checkReference(nameOf.identifier(this.file, node.property));
    }
    // Continue walking the tree.
    this.visitChildren(node);
  }

  // TODO: Keep implementing more visitor methods for anywhere that identifiers show up in the JS grammar...
  //       https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/estree/index.d.ts
}

function parseOptions(isModule) {
  return {
    range: true,
    loc: true,
    comment: true,
    tokens: false,
    ecmaVersion: 2021,
    sourceType: isModule ? 'module' : 'script',
    ecmaFeatures: {
      jsx: false,
      globalReturn: !isModule,
      impliedStrict: isModule
    }
  };
}

export default function analyze(src, file, results) {
  let collector = new Collector(file, results);
  // TODO: determine whether it's a module or a script
  let tree = parse(src, parseOptions(false));
  // Walk the tree, collecting violations.
  collector.visit(tree);
};
