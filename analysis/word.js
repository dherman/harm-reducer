import Instance from "./instance";

export default class Word /* <T> */ {
  constructor(text, file, tree) {
    this.text = text; // string
    this.file = file; // path
    this.tree = tree; // T
  }

  check(policy) {
    let violation = policy.check(this.text);
    return violation ? new Instance(this, violation) : null;
  }
}
