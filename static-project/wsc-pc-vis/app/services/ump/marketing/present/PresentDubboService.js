const BaseService = require('../../../base/BaseService');
/* com.youzan.ump.marketing.present.service.PresentDubboService -  */
class PresentDubboService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.marketing.present.service.PresentDubboService';
  }

  /**
   *  分页查询赠品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/257698
   *
   *  @param {Object} param -
   *  @param {number} param.kdtId - 店铺id
   *  @param {boolean} param.withStatistics - 是否返回统计数据（发放数、领取数）
   *  @param {number} param.pageNo - 页码
   *  @param {boolean} param.withGoodsInfo - 是否返回商品信息
   *  @param {number} param.channel - 渠道类型 0网店 1门店
   *  @param {number} param.pageSize - 每页条数
   *  @param {string} param.keyword - 关键字
   *  @return {Promise}
   */
  async findPage(param) {
    return this.invoke('findPage', [param]);
  }
}

module.exports = PresentDubboService;
