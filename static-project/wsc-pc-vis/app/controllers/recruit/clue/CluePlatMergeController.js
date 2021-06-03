const ClueBaseController = require('./ClueBaseController');
const CluePlatMergeFacade = require('../../../services/owl/pc/clue/CluePlatMergeFacade');

class CluePlatMergeController extends ClueBaseController {
  // 查看线索是否可以转化为学员
  async checkClueMerge(ctx) {
    const { kdtId } = ctx;
    const { clueId = 0, identityNo = '' } = ctx.getQueryParse();
    const data = await new CluePlatMergeFacade(ctx).checkClueMerge(kdtId, {
      clueId: +clueId,
      identityNo,
    });
    return ctx.json(0, 'ok', data);
  }

  // 转化确认接口
  async confirmClueMerge(ctx) {
    const { kdtId } = ctx;
    const { identityNo = '', ownerUserId = 0, targetIdentityNo = '' } = ctx.request.body || {};
    const operator = this.formatOperator;
    const data = await new CluePlatMergeFacade(ctx).confirmClueMerge(kdtId, {
      identityNo,
      ownerUserId: +ownerUserId,
      targetIdentityNo,
      operator,
    });
    return ctx.json(0, 'ok', data);
  }
};

module.exports = CluePlatMergeController;
