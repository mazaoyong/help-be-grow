const controllerPath = 'common.SmsCaptchaController';

module.exports = [
  [
    'GET',
    '/wscvis/common/smscaptcha/sendSmsCaptcha.json',
    controllerPath,
    'sendSmsCaptcha',
  ],
  [
    'GET',
    '/wscvis/common/smscaptcha/verifySmsCaptcha.json',
    controllerPath,
    'verifySmsCaptcha',
  ],
];
