module.exports = [
  ['GET', '/v4/vis/h5/edu/clue/transfer-clue', 'h5.transferClue.IndexController', 'getIndexHtml'],
  ['GET', '/v4/vis/h5/edu/clue/findStaffPage.json', 'h5.transferClue.IndexController', 'findStaffPage'],
  ['GET', '/v4/vis/h5/edu/clue/findTransferReasonPage.json', 'h5.transferClue.IndexController', 'findTransferReasonPage'],
  ['POST', '/v4/vis/h5/edu/clue/transferClues.json', 'h5.transferClue.IndexController', 'transferClues'],
];
