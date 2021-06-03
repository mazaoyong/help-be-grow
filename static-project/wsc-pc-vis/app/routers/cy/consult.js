module.exports = [
  ['POST', '/v4/vis/cy/consult.json', 'cy.ConsultController', 'postConsultJson'],
  ['GET', '/v4/vis/cy/consult', 'cy.ConsultController', 'getIndexHtml'],
  [
    // 行为组件接入
    'GET',
    '/v4/vis/cy/consult/sendBehaviorCaptchaJson.json',
    'cy.ConsultController',
    'sendBehaviorCaptchaJson',
  ],
];
