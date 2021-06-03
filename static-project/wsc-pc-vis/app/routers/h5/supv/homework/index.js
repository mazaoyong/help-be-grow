module.exports = [
  ...require('./homework'),
  ...require('./assignment'),
  ...require('./workbook'),
  ['GET', '/v4/vis/h5/supv/homework/*', 'h5.supv.homework.IndexController', 'renderHtml'],
];
