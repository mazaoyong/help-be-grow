module.exports = [
  ['GET', '/v4/vis/edu/page/signin/list', 'ump.SignInController', 'redirectSigninList'],
  ['GET', '/v4/vis/edu/page/signin/edit', 'ump.SignInController', 'redirectSigninEdit'],
  ['GET', '/v4/vis/edu/page/signin', 'ump.SignInController', 'redirectSigninList'],
];
