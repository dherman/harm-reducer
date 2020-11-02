import WordMap from "./word-map";

export default class Analysis/* <T> */ {

  constructor(results) {
    this.results = results;
    // Include all harmful comments discovered in this codebase.
    this.comments = results.comments;
    // Include all harmful definitions discovered in this codebase.
    this.definitions = results.definitions;
    // Include ONLY the harmful references that appear to be defined somewhere in this codebase.
    this.references = results.references.filter(key => {
      return results.definitions.has(key);
    });
  }

  localHarmScore() {
    return this.comments.length
      + this.definitions.size()
      + this.references.size();
  }

  totalHarmScore() {
    return this.results.size();
  }

  // TODO: generate report

}
