const BaseService = require('../../base/BaseService');
/**
 */
class ShopSwitchService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shopfront.api.service.chain.ShopSwitchService';
  }

  /**
   *  搜索店铺用于切换
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421120
   *
   *  @param {Object} request - {@link ShopSwitchSearchRequest}
   *  @param {boolean} request.supportPartner - 是否支持合伙人
   *  @param {boolean} request.hasHq - 列表是否包含总部（pc true 移动端 false）
   *  @param {number} request.hqKdtId - 总部id
   *  @param {number} request.adminId - 店铺管理员id
   *  @param {string} request.shopName - 店铺名称
   *  @param {number} request.pageSize - 分页大小
   *  @param {Array.<Array>} request.shopRoleList[] - 店铺角色列表
   *  @param {number} request.pageNum - 页码
   *  @param {boolean} request.isOfflineOpen - 是否开启线下店，默认不过滤，PAD端要过滤的，传true
   *  @return {Promise}
   */
  async searchShopForSwitch(request) {
    return this.invoke('searchShopForSwitch', [request]);
    // return {
    //   data: [
    //     {
    //       hqKdtId: 54345432,
    //       joinType: 1,
    //       shopName: '测试校区11111',
    //       kdtId: 24,
    //     },
    //     {
    //       hqKdtId: 54345432,
    //       joinType: 2,
    //       shopName: '测试校区22222',
    //       kdtId: 25,
    //     },
    //     {
    //       hqKdtId: 54345432,
    //       joinType: 3,
    //       shopName: '测试校区33333',
    //       kdtId: 26,
    //     },
    //     {
    //       hqKdtId: 54345432,
    //       joinType: 1,
    //       shopName: '测试校区44444',
    //       kdtId: 27,
    //     },
    //     {
    //       hqKdtId: 54345432,
    //       joinType: 1,
    //       shopName: '测试校区55555',
    //       kdtId: 28,
    //       shopRole: 1,
    //     },
    //   ],
    //   total: 5,
    // };
  }
}

module.exports = ShopSwitchService;
