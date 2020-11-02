export default class Policy {
  constructor(terms) {
    this.dictionary = terms.map(s => s.toLowerCase());
  }

  // string -> string | null
  // Returns the illegal text found in the given text string, or null if no violation was found.
  check(text) {
    text = text.toLowerCase();
    return this.dictionary.some(illegal => (text.includes(illegal) && illegal));
  }

}
