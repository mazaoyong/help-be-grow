const BaseService = require('../../base/BaseService');
/* com.youzan.owl.api.ColumnService -  */
class ColumnService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.ColumnService';
  }

  /**
   *  判断专栏是否被购买过，包含：1、已购买 2、会员权益 3、送礼(包含在已购买中) 4、0元专栏且已领取(领取后就进入订阅表了) 5、0元免领取
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/310418
   *
   *  @param {number} kdtId - 店铺Id
   *  @param {string} columnAlias - 专栏别名
   *  @param {number} userId - 用户Id
   *  @return {Promise}
   */
  async getIsPaid(kdtId, columnAlias, userId) {
    return this.owlInvoke('isPaid', [kdtId, columnAlias, userId]);
  }

  /**
   *  查询专栏下被设置为免费的内容或直播,支持排序
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/418566
   *
   *  @param {number} kdtId - 店铺Id
   *  @param {string} columnAlias - 专栏别名
   *  @param {string} sortType -
   *  @return {Promise}
   */
  async findFreeContentAndLiveV2(kdtId, columnAlias, sortType) {
    return this.owlInvoke('findFreeContentAndLiveV2', [
      kdtId,
      columnAlias,
      sortType,
    ]);
  }
}

module.exports = ColumnService;
