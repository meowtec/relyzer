import * as path from 'path';
import pluginTester from 'babel-plugin-tester';
import reactHooksPerfPlugin from '../src';

describe('tests', () => {
  it('test fixtures', () => {
    pluginTester({
      plugin: reactHooksPerfPlugin,
      fixtures: path.join(__dirname, 'fixtures'),
      snapshot: true,
    });
  });
});
