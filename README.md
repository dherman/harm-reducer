# harm-reducer

A proof-of-concept multi-language framework for classifying harmful language in source code, to assist programmers in developing a refactoring plan.

The problem statement:

> Given a **policy identifying harmful language** and a **codebase**, provide maintainers with a report of policy violations that can be changed _locally_, i.e., without first requiring changes to dependencies.

# Design notes

The design goals are:

- **Perfection isn't crucial.** The goal is to guide humans to plan and estimate work with more accuracy than grep. They'll ultimately have the last word, so some amount of inaccuracy is OK.
- **Robustness to language evolution:** As programming languages evolve, the visitors will need to be revised. Keeping the number of categories in the classification small makes it relatively inexpensive to onboard new syntactic constructs introduced in new versions of the programming languages in the analysis.

The tool uses a coarse-grained classification:

- **Comments:** Identify harmful language that occurs in natural language within code comments.
- **Definitions:** Identify harmful language appearing in program identifiers that are defining a construct (variable, parameter, class, interface, method, function, etc) locally within the codebase.
- **References:** Identify harmful language appearing in program identifiers that are referring to a construct defined somewhere else.

The analysis makes the following simplified assumption:

> A reference is local if and only if the same identifier occurs somewhere in the codebase as a definition.

This is an imprecise heuristic, but it should reduce the number of false positives that would appear in a simple grep. And it's simpler than attempting to accurate identify imports or analyze the dependency graph.

# Next Steps

This is a **proof-of-concept**. What would it take to flesh it out?

## Different implementation language?

I implemented this in JS because I can prototype quickly in it and it has some nice open source parsers for JS and Java. There's no need for it to be in JS; Python would be a fine implementation language as well.

Also, the situation for Python parsers in JS is not as good. There are a few in npm but they aren't super actively maintained, and few to none preserve comments in the parse tree.

Probably the best options to investigate for parsing additional languages would be:

- [ANTLR](https://www.antlr.org): ANTLR can generate parsers for many implementation languages, including JS and Python. It's mature and well-maintained, and [maintains grammars for most languages](https://github.com/antlr/grammars-v4). Standard language parsers may not preserve comments out of the box, so it may be necessary to fork them, which is a potential maintenance liability.
- [Tree-sitter](https://tree-sitter.github.io/tree-sitter/): Tree-sitter is newer than ANTLR but appears to be actively maintained. It can generate parser with bindings for multiple languages, and has parsers for most programming languages. It's designed for concrete parse trees, so it should preserve comments out of the box. The generated parsers are in C, which might make build and linking somewhat inconvenient.

## Complete tree-walking logic

I only implemented a few example visitor methods in `java/index.js` and `js/index.js` to illustrate the basic idea. Finishing this implementation would require looking through the full set of methods in each visitor API:

- [Java visitor API](https://github.com/jhipster/prettier-java/blob/master/packages/java-parser/api.d.ts)
- [JS visitor API](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/estree/index.d.ts)

and then ensuring that we had full coverage of methods that visit any definitions and references.

This process would be repeated for every language onboarded with the tool: write a custom visitor based on that language's grammar, and ensure the visitor catches every instance of a definition or reference to harmful identifiers.

## Codebase crawling

The tool's top-level logic should crawl a directory tree and find all relevant source files, and determine for each file what its language is in order to use the right parser.

## Report generation

The tool should generate reports in a format that can be easily reviewed by codebase owners.

## Determining exports

It would be helpful to highlight which definitions are exported publicly from a codebase, to help authors figure out which definitions need a deprecation plan to allow consumers to migrate.

This might be a little more involved than just finding definitions and references, because it requires figuring out relationships like _method name X is a public part of class type Y which is exported from module Z_. It also might require different techniques for inferring in different types of languages (e.g. statically vs. dynamically typed).

# Prototype notes

## Parsers

### JavaScript

For JavaScript, I used the [espree](https://www.npmjs.com/package/espree) package. This is a well-maintained JS parser, used by the mega-popular [ESLint](https://eslint.org) linter as its production parser. This gives it a strong guarantee of being well-maintained, and well-vetted for correctness and performance.

It's also well-tailored to this kind of project because it is designed to produce a high-fidelity, [concrete syntax tree](https://github.com/oilshell/oil/wiki/Lossless-Syntax-Tree-Pattern) (rather than a more streamlined abstract syntax tree), with information about even semantically unimportant constructs like comments and whitespace fully preserved--which we need for implementing natural language policies.

I made use of the [esrecurse](https://www.npmjs.com/package/esrecurse) package to get a base `Visitor` class, rather than implement one from scratch.

### Java

For Java, I used the [java-parser](https://www.npmjs.com/package/java-parser) package. This is the Java parser used by the Java plugin for the [Prettier](https://prettier.io) code formatter, which gives it at least a fighting chance of being actively maintained. That package helpfully comes with a base `Visitor` class.

## Native ES modules

Now that Node has landed native support for ECMAScript modules, I went ahead and started using it in this code.

### Caveat: Jest support for native ES modules

Jest's support for native ECMAScript modules is still experimental, and requires a few special incantations in `package.json` at the moment. See:

- https://stackoverflow.com/a/61653104
- https://github.com/facebook/jest/issues/9430
- https://jestjs.io/docs/en/ecmascript-modules

I expect this to get a bit smoother in the future but for the moment it means `package.json` is a little confusing.
