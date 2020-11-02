// A dictionary class that maps words to arrays of instances.
export default class WordMap /* <T> */ {
  constructor() {
    this.map = Object.create(null);   // { [string]: T[], ... }
    this.sizes = Object.create(null); // { [string]: int, ... }
    this.size = 0;                    // int
  }

  // () -> int
  size() {
    return this.size;
  }

  // (string, T) -> void
  add(key, value) {
    let a = this.map[key] || (this.sizes[key] = 0, this.map[key] = []);
    a.push(value);
    this.sizes[key]++;
    this.size++;
  }

  // (string) -> T[] | null
  get(key) {
    return this.map[key] || null;
  }

  // (string) -> boolean
  has(key) {
    return !!this.get(key);
  }

  // (string) -> int
  count(key) {
    return this.sizes[key] || 0;
  }

  // ((string) -> boolean) -> WordMap<T>
  filter(callback) {
    let result = new WordMap();
    for (let key of Object.getOwnPropertyNames(this.map)) {
      if (callback(key)) {
        result.add(key, this.map[key]);
      }
    }
    return result;
  }
}
