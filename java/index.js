import { parse, BaseJavaCstVisitorWithDefaults } from 'java-parser';
import * as nameOf from './name-of';

class Collector extends BaseJavaCstVisitorWithDefaults {
  constructor(file, results) {
    super();

    this.file = file;       // path
    this.results = results; // SearchResults

    // Provided by `java-parser` to ensure the visitor is correctly set up.
    this.validateVisitor();
  }

  methodDeclaration(ctx) {
    this.results.checkDefinition(nameOf.methodDeclaration(this.file, ctx));
    // Continue walking the tree.
    super.methodDeclaration(ctx);
  }

  normalClassDeclaration(ctx) {
    this.results.checkDefinition(nameOf.normalClassDeclaration(this.file, ctx));
    // Continue walking the tree.
    super.normalClassDeclaration(ctx);
  }

  fqnOrRefTypePartCommon(ctx) {
    this.results.checkReference(nameOf.nodeWithIdentifier(this.file, ctx));
    // Continue walking the tree.
    super.fqnOrRefTypePartCommon(ctx);
  }

  primarySuffix(ctx) {
    if (ctx.Identifier) {
      this.results.checkReference(nameOf.nodeWithIdentifier(this.file, ctx));
    }
    // Continue walking the tree.
    super.primarySuffix(ctx);
  }

  // TODO: Keep implementing more visitor methods for anywhere that identifiers show up in the Java grammar...
  //       https://github.com/jhipster/prettier-java/blob/master/packages/java-parser/api.d.ts
}

export default function analyze(src, file, results) {
  let collector = new Collector(file, results);
  // Walk the tree, collecting violations.
  collector.visit(parse(src));
};
