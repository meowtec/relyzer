/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
const path = require('path');
const shell = require('shelljs');

const [command, flag] = process.argv.slice(2);
const parallel = flag === '--parallel';

/**
 * learn does not work well with cycle dependencies.
 */
[
  'shared',
  'babel',
  'client',
  'runtime',
].forEach((subPkgName) => {
  shell.cd(path.join(__dirname, '../packages', subPkgName));
  const cmd = `npm run ${command}`;
  shell.exec(cmd, {
    async: parallel,
  });
});
