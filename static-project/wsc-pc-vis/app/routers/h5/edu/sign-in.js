module.exports = [
  ['GET', '/v4/vis/h5/edu/sign-in', 'h5.signIn.IndexController', 'getIndexHtml'],
  ['GET', '/v4/vis/h5/edu/getStudentList.json', 'h5.signIn.IndexController', 'getStudentList'],
  ['GET', '/v4/vis/h5/edu/getActionResult.json', 'h5.signIn.IndexController', 'getActionResult'],
  ['POST', '/v4/vis/h5/edu/signIn.json', 'h5.signIn.IndexController', 'signIn'],
  ['POST', '/v4/vis/h5/edu/removeStudent.json', 'h5.signIn.IndexController', 'removeStudent'],
  ['POST', '/v4/vis/h5/edu/changeSignInState.json', 'h5.signIn.IndexController', 'changeSignInState'],
];
