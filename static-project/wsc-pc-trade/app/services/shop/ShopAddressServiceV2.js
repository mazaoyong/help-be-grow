const BaseService = require('./ShopBaseService');

/**
 * 店铺地址库管理
 */
class ShopAddressServiceV2 extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shop.service.address.ShopAddressServiceV2';
  }
  /**
   * @description 查询地址列表
   * @param {Object} data
   * @param {number} data.kdtId
   * @param {number} data.addressType 地址类型 1：退货地址 2：发票地址 4：发货地址 null查询所有
   * @param {number} data.pageNum
   * @param {number} data.pageSize
   *
   * @return {Promise.<object>}
   */
  getShopAddressList(data) {
    return this.invoke('queryShopAddressList', [data], {
      processCb: response => {
        const { baseResult = {}, shopAddressList = [], total } = response;
        if (baseResult.isSuccess) {
          return {
            code: 200,
            data: {
              total,
              list: shopAddressList,
            },
          };
        } else {
          return response;
        }
      },
    });
  }
  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/67807
   *
   *  @param {number} kdtId - 店铺kdt_id
   *  @param {number} addressType - 地址类型，1:退货地址，2:发票地址，4:发货地址
   *  @return {Promise}
   */
  queryDefaultShopAddress(kdtId, addressType) {
    return this.invoke('queryDefaultShopAddress', [kdtId, addressType], {
      processCb: response => {
        const { baseResult = {}, shopAddress = {} } = response;
        if (baseResult.isSuccess) {
          return {
            code: 200,
            data: shopAddress,
          };
        } else {
          return response;
        }
      },
    });
  }
  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/67809
   *
   *  @param {Object} request -
   *  @param {string} request.address -
   *  @param {number} request.__isset_bitfield -
   *  @param {number} request.kdtId -
   *  @param {string} request.city -
   *  @param {string} request.contactName -
   *  @param {string} request.county -
   *  @param {number} request.countryIndex -
   *  @param {string} request.telephone -
   *  @param {Array.<Object>} request.addressTypes[] -
   *  @param {number} request.accountId -
   *  @param {string} request.areaCode -
   *  @param {string} request.mobilePhone -
   *  @param {string} request.province -
   *  @param {string} request.regionType -
   *  @param {string} request.extensionNumber -
   *  @param {string} request.countyId -
   *  @return {Promise}
   */
  async addShopAddress(request) {
    return this.invoke('addShopAddress', [request], {
      processCb: response => {
        if (response.isSuccess) {
          return {
            code: 200,
            data: response,
          };
        } else {
          return {
            code: response.errorCode,
            data: null,
            msg: response.errorDesc,
          };
        }
      },
    });
  }
}

module.exports = ShopAddressServiceV2;
