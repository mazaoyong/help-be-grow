const ChainProductRelationFacadeService = require('../../services/owl/client/chain/chainproduct/ChainProductRelationFacade');
const EduBaseController = require('./EduBaseController');

class ChainController extends EduBaseController {
  async getCampusProductByCampusJson(ctx) {
    const {
      sourceProductAlias,
      sourceKdtId,
      targetKdtId,
    } = ctx.query;
    console.log('----------', sourceProductAlias, sourceKdtId, targetKdtId);
    const res = await new ChainProductRelationFacadeService(ctx).getCampusProductByCampus({
      sourceProductAlias,
      sourceKdtId,
      targetKdtId,
    });
    console.log('----------', res);
    ctx.json(0, 'ok', res);
  }
}

module.exports = ChainController;
