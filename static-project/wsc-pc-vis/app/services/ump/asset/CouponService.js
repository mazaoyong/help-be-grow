const BaseService = require('../../base/BaseService');

/* com.youzan.ump.asset.facade.CouponGroupFacadeService -  */
class CouponService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.asset.facade.CouponGroupFacadeService';
  }

  /**
  *  优惠凭证 组件列表（用于前端组件）
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/371287
  *
  *  @param {number} param.kdtId - 店铺ID
  *  @param {number} param.pageNo - 起始页码：1
  *  @param {number} param.pageSize - 每页数量: 最大值：200
  *  @param {string} param.type - 查询类型: all表示全部，card表示优惠券，code表示优惠码
  *  @param {string} param.keyword - 搜索的关键词
  *  @return {Promise}
  */
  async searchList4CouponComponent(param) {
    return this.invoke('searchList4CouponComponent', [param]);
  }
}

module.exports = CouponService;
