import Policy from './policy';
import analyzeJS from './js';
import analyzeJava from './java';

const SIMPLE_JS_TEST = `
  class PrinceHumperdink extends Villain {

    humperdinkHumperdinkHumperdink() {
      this.humperdinkHumperdinkHumperdink();
      return 0;
    }

  }
`;

const SIMPLE_JAVA_TEST = `
  public class PrinceHumperdink extends Villain {
    public static void main(String args[]) {
      System.out.println("hello world");
    }

    // https://tenor.com/view/princessbride-humperdinck-witch-gif-5225670
    public int humperdinkHumperdinkHumperdink() {
      this.humperdinkHumperdinkHumperdink();
      return 0;
    }
  }
`;

const POLICY = new Policy(['humperdink', 'voldemort']);

test('Simple JS test', () => {
  let analysis = analyzeJS(SIMPLE_JS_TEST, 'prince-humperdink.js', POLICY);
  expect(analysis.results.definitions.count('PrinceHumperdink')).toBe(1);
  expect(analysis.results.definitions.count('humperdinkHumperdinkHumperdink')).toBe(1);
  expect(analysis.results.references.count('humperdinkHumperdinkHumperdink')).toBe(1);
});

test('Simple Java test', () => {
  let analysis = analyzeJava(SIMPLE_JAVA_TEST, 'PrinceHumperdink.java', POLICY);
  expect(analysis.results.definitions.count('PrinceHumperdink')).toBe(1);
  expect(analysis.results.definitions.count('humperdinkHumperdinkHumperdink')).toBe(1);
  expect(analysis.results.references.count('humperdinkHumperdinkHumperdink')).toBe(1);
});
