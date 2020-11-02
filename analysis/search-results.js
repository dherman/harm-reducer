import Analysis from "./";
import WordMap from "./word-map";

export default class SearchResults /* <T> */ {
  constructor(policy) {
    this.policy = policy;             // Policy
    this.comments = [];               // Instance<T>[]
    this.definitions = new WordMap(); // WordMap<T>
    this.references = new WordMap();  // WordMap<T>
  }

  analyze() {
    return new Analysis(this);
  }

  saveComment(comment) {
    this.comments.push(comment);
  }

  checkDefinition(word) {
    let instance = word.check(this.policy);
    if (instance) {
      this.definitions.add(instance.word.text, instance);
    }
  }

  checkReference(word) {
    let instance = word.check(this.policy);
    if (instance) {
      this.references.add(instance.word.text, instance);
    }
  }

}
