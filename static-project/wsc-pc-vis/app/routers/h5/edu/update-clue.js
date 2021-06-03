module.exports = [
  ['GET', '/v4/vis/h5/edu/clue/update-clue', 'h5.updateClue.IndexController', 'getIndexHtml'],
  ['GET', '/v4/vis/h5/edu/clue/findAttributeItemsByKdtId.json', 'h5.updateClue.IndexController', 'findAttributeItemsByKdtId'],
  ['GET', '/v4/vis/h5/edu/clue/findSourceGroupPage.json', 'h5.updateClue.IndexController', 'findSourceGroupPage'],
  ['GET', '/v4/vis/h5/edu/clue/getAttributesById.json', 'h5.updateClue.IndexController', 'getAttributesById'],
  ['POST', '/v4/vis/h5/edu/clue/create.json', 'h5.updateClue.IndexController', 'create'],
  ['POST', '/v4/vis/h5/edu/clue/update.json', 'h5.updateClue.IndexController', 'update'],
];
