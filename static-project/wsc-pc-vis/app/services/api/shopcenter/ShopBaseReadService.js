const ShopBaseService = require('./ShopBaseService');

class ShopBaseReadService extends ShopBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shop.service.ShopBaseReadService';
  }
  get DOMAIN_NAME() {
    return 'WSC_URL';
  }

  async queryShopDisplayInfo(kdtId) {
    return this.invoke('queryShopDisplayInfo', [kdtId]);
  }

  async getTeamInfo(kdtId, isLock) {
    let teamInfo = await this.ajax({
      url: '/shop/getShopInfo',
      method: 'GET',
      data: {
        kdtId,
        isLock: isLock || 0,
      },
    });

    return teamInfo;
  }
}

module.exports = ShopBaseReadService;
