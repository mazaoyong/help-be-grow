const BaseService = require('./ShopBaseService');

/**
 * 店铺地址库管理(获取手机国家码)
 */
class ShopAddressService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shop.service.address.ShopAddressService';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/67804
   *
   *
   *  @return {object}
   */
  async getCountryCodeList() {
    return this.invoke('getCountryCodeList', [], {
      processCb: response => {
        const { baseResult = {}, countryCodeList = [] } = response;
        if (baseResult.isSuccess) {
          return {
            code: 200,
            data: countryCodeList,
          };
        } else {
          return response;
        }
      },
    });
  }
}

module.exports = ShopAddressService;
