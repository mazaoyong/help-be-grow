module.exports = [
  ['POST', '/v4/vis/h5/edu/loginByPassword.json', 'h5.login.IndexController', 'loginByPassword'],
  ['POST', '/v4/vis/h5/edu/loginBySmsCaptcha.json', 'h5.login.IndexController', 'loginBySmsCaptcha'],
  ['POST', '/v4/vis/h5/edu/logout.json', 'h5.login.IndexController', 'logout'],
  ['POST', '/v4/vis/h5/edu/sendSmsCaptchaForLogin.json', 'h5.login.IndexController', 'sendSmsCaptchaForLogin'],
];
