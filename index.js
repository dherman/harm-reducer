import * as path from 'path';
import Analysis from './analysis';

export default function analyze(codebase, policy) {
  let resolve, reject;

  // A promise of the analysis report.
  let result = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  let analysis = Analysis.basic(policy);

  // Run every file we find through the analysis.
  codebase.on("file", (root, fileStats, next) => {
    analysis
        .analyze(path.join(root, fileStats.name))
        .then(() => next());
  });

  // Report any I/O errors.
  codebase.on("errors", (root, nodeStatsArray, next) => {
    reject(nodeStatsArray);
  });

  // When we're done analyzing all files, produce the analysis report.
  codebase.on("end", () => {
    resolve(analysis.complete());
  });

  return result;
}
