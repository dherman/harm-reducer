export default class Report {

  // ({ [string]: SearchResults, ... }) -> Report
  constructor(langs) {
    this.langs = Object.create(null);

    this.localHarmScore = 0;
    this.totalHarmScore = 0;

    for (let lang of Object.getOwnPropertyNames(langs)) {
      let results = langs[lang];
      let comments = results.comments;
      let definitions = results.definitions;
      let references = results.references.filter(key => definitions.has(key));
      let localHarmScore = comments.length
        + definitions.size()
        + references.size();
      let totalHarmScore = results.comments.length
        + results.definitions.size()
        + results.references.size();

      this.localHarmScore += localHarmScore;
      this.totalHarmScore += totalHarmScore;
      this.langs[lang] = {
        results,
        comments,
        definitions,
        references,
        localHarmScore,
        totalHarmScore
      };
    }
  }

  // TODO: methods to print out report, generate JSON, etc

}
