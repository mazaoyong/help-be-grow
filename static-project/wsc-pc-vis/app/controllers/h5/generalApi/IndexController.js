/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const ShopQueryService = require('../../../services/owl/pc/shop/ShopQueryService');

class IndexController extends BaseController {
  async findListAllCampus(ctx) { // 获取校区列表
    const { kdtId } = ctx;
    const res = await new ShopQueryService(ctx).findListAllCampus(kdtId);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
