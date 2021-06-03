const BaseService = require('../../../base/BaseService');

class RelatedOrderFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.RelatedOrderFacade';
  }

  /**
    *  根据条件搜索线索关联的订单
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/491498
    *
    *  @param {number} kdtId - 店铺id
    *  @param {Object} pageRequest -
    *  @param {number} pageRequest.pageNumber -
    *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
    *  @param {number} pageRequest.pageSize -
    *  @param {Object} pageRequest.sort -
    *  @param {Object} query - 搜索条件
    *  @param {string} query.orderNo - 订单号
    *  @param {string} query.studentName - 学员姓名
    *  @param {Object} query.bookTime - 下单时间范围
    *  @param {string} query.from - 请求来源
        pc：pc端
        wap： 移动端
    *  @param {number} query.targetKdtId - 连锁门店kdtId搜索
    *  @param {number} query.clueId - 线索id
    *  @param {string} query.buyerName - 客户姓名
    *  @param {Object} query.operator - 操作人
    *  @param {string} query.lessonName - 课程名称
    *  @return {Promise}
    */
  async query(kdtId, pageRequest, query) {
    return this.invoke('query', [kdtId, pageRequest, query]);
  }

  /**
   *  线索当前关联订单查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/660451
   *
   *  @param {number} kdtId - 当前店铺id
   *  @param {Object} query - 查询条件
   *  @param {string} query.orderNo - 订单号
   *  @param {number} query.clueId - 线索id
   *  @return {Promise}
   */
  async getRelatedOrderWithCheck(kdtId, query) {
    return this.invoke('getRelatedOrderWithCheck', [kdtId, query]);
  }
}

module.exports = RelatedOrderFacade;
