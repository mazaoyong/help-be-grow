const BaseController = require('../base/BaseNewController');
const ClientCourseCommonFacade = require('../../services/owl/client/onlinecourse/ClientCourseCommonFacade');
const ClientContentProductFacade = require('../../services/owl/client/product/ClientContentProductFacade');

class ProductCommonController extends BaseController {
  // 根据商品id或者别名查询商品的基本信息
  async findSimpleCourseListJson(ctx) {
    const kdtId = ctx.kdtId;
    let aliases = [];
    let goodsIds = [];
    ctx.query.aliases && (aliases = ctx.query.aliases.split(','));
    ctx.query.goodsIds && (goodsIds = ctx.query.goodsIds.split(','));
    if (goodsIds.length > 0) {
      goodsIds = goodsIds.map(id => {
        return +id;
      });
    }

    const basicQueryCommand = {};
    aliases && (basicQueryCommand.aliases = aliases);
    goodsIds && (basicQueryCommand.goodsIds = goodsIds);
    const result = await new ClientCourseCommonFacade(ctx).findSimpleCourseList(kdtId, basicQueryCommand);
    ctx.json(0, 'ok', result);
  }

  // 根据商品alias查询goodsid
  async getByAlias(ctx) {
    const kdtId = ctx.kdtId;
    const alias = ctx.query.alias;
    const result = await new ClientContentProductFacade(ctx).getByAlias(kdtId, alias);
    ctx.json(0, 'ok', result);
  }
}

module.exports = ProductCommonController;
