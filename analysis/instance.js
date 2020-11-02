export default class Instance /* <T> */ {
  constructor(word, violation) {
    this.word = word;           // Word<T>
    this.violation = violation; // string | null
  }
}
