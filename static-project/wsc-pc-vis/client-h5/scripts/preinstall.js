/**
 * Do NOT allow using `yarn` as package manager.
 */
if (process.env.npm_execpath.indexOf('yarn') === -1) {
  console.error('\u001b[31mYou must use yarn to install dependencies\u001b[0m');
  console.error('王晨大哥提醒您，规范千万条，lockfile第一条，包管理器使用不规范，同事两行泪');
  process.exit(1);
}
