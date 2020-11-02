import { parse } from 'espree';
import { Visitor } from 'esrecurse';
import SearchResults from '../analysis/search-results';
import * as nameOf from './name-of';

class Collector extends Visitor {
  constructor(file, policy) {
    super();
    this.file = file;
    this.results = new SearchResults(policy);
  }

  collect(node) {
    // Walk the tree.
    this.visit(node);
    // And we're done!
    return this.results.analyze();
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

export default function analyze(src, file, policy) {
  let collector = new Collector(file, policy);
  // TODO: determine whether it's a module or a script
  let tree = parse(src, parseOptions(false));
  return collector.collect(tree);
};
