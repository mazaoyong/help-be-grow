const cp = require('child_process');
const { resolvePosterEntry, resolveSkeletonEntry, getFilterPattern } = require('./utils');

let commands = ['koko dev'];

let filterPattern = getFilterPattern(process.argv);
if (filterPattern) {
  const skeletonEntry = resolveSkeletonEntry(filterPattern);
  if (Object.keys(skeletonEntry).length) {
    commands.unshift('yarn dev:skeleton');
  };

  const posterEntry = resolvePosterEntry(filterPattern);
  if (Object.keys(posterEntry).length) {
    commands.unshift('yarn dev:poster');
  }
}

commands = commands.map(cmd => `${cmd} -e '${filterPattern}'`);
const finalCommand = commands.join(' & ');
try {
  console.log(finalCommand);
  cp.execSync(finalCommand, { stdio: 'inherit' });
} catch (err) {
  console.error(err);
}
