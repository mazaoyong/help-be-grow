const BaseController = require('../../base/BaseController');
const StoreService = require('../../../services/owl/edu/course/StoreService');
const PcStoreFacade = require('../../../services/owl/pc/store/PcStoreFacade');

class StoreController extends BaseController {
  // 获取上课地点列表 TOMODIFY 这个流量还很大，考虑迁移到新接口
  async getStoreListJson(ctx) {
    const params = {
      kdtId: ctx.kdtId,
      keyword: ctx.request.query.keyword,
    };
    const result = await new StoreService(ctx).getStoreList(params);
    return ctx.json(0, 'ok', result);
  }

  // B端查询上课地点 新接口
  async findStore(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();

    const result = await new PcStoreFacade(ctx).findStore(kdtId, query);
    return ctx.success(result);
  }
}

module.exports = StoreController;
