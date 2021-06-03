const BaseService = require('../base/BaseService');

class OwlGoodsService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.OwlGoodsService';
  }

  // 批量获取知识付费商品类型
  async getOwlTypeByItemIds(req) {
    let resupt = await this.invoke('getOwlTypeByItemIds', [req]);
    return resupt;
  }
}

module.exports = OwlGoodsService;
