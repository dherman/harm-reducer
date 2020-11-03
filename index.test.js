import * as path from 'path';
import { walk } from 'walk';
import Policy from './policy';
import analyze from '.';

const POLICY = new Policy(['humperdink', 'voldemort']);

test('test/fixtures', async () => {
  let report = await analyze(walk(path.join('test', 'fixtures')), POLICY);

  expect(report.langs.js.results.definitions.count('PrinceHumperdink')).toBe(1);
  expect(report.langs.js.results.definitions.count('humperdinkHumperdinkHumperdink')).toBe(1);
  expect(report.langs.js.results.references.count('humperdinkHumperdinkHumperdink')).toBe(1);

  expect(report.langs.java.results.definitions.count('PrinceHumperdink')).toBe(1);
  expect(report.langs.java.results.definitions.count('humperdinkHumperdinkHumperdink')).toBe(1);
  expect(report.langs.java.results.references.count('humperdinkHumperdinkHumperdink')).toBe(1);
  
  return true;
});
