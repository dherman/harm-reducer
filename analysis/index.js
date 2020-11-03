import * as fs from 'fs/promises';
import SearchResults from './search-results';
import analyzeJava from '../java';
import analyzeJS from '../js';
import Report from './report';

export default class Analysis {

  // type Lang = {
  //   match: (path) -> boolean,
  //   lang: string,
  //   analyze: (string, path, SearchResults) -> void
  // }

  constructor(policy) {
    this.policy = policy;               // Policy
    this.langs = [];                    // Lang[]
    this.results = Object.create(null); // { [string]: SearchResults, ... }
  }

  // Install support for a file type / programming language.
  on(match, lang, analyze) {
    this.langs.push({ match, lang, analyze });
    this.results[lang] = new SearchResults(this.policy);
    return this;
  }

  // (path) -> Promise<void>
  analyze(filePath) {
    let lang = this.langs.find(lang => lang.match(filePath) && lang);
    return !lang
      ? Promise.resolve()
      : fs.readFile(filePath, 'utf-8')
          .then(src => {
            lang.analyze(src, filePath, this.results[lang.lang]);
          });
  }

  complete() {
    return new Report(this.results);
  }

  // A basic analysis with support for Java and JS source files.
  static basic(policy) {
    return (new Analysis(policy))
      .on(path => path.endsWith('.java'), 'java', analyzeJava)
      .on(path => path.endsWith('.js'),   'js',   analyzeJS);
  }

}
