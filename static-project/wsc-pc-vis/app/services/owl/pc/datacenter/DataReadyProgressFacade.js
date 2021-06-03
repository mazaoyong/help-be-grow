const BaseService = require('../../../base/BaseService');

/**
 * 检查数据准备状态
 */
class DataReadyProgressFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.datacenter.DataReadyProgressFacade';
  }

  /**
   *  查询数据准备状态，用来渲染小黄条
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/559545
   *
   *  @param {Object} query -
   *  @param {Object} query.dateParam -
   *  @param {number} query.dateParam.dateType - 日期类型
      REAL_TIME(0, "今日实时"),
      NATURAL_DAY(1, "自然天"),
      NATURAL_WEEK(2, "自然周"),
      NATURAL_MONTH(3, "自然月"),
      LAST_SEVEN_DAY(4, "最近7天"),
      LAST_THIRTY_DAY(5, "最近30天"),
      SELF_DEFINE(6, "自定义"),
      NATURAL_QUARTER(7, "自然季度"),
      YESTERDAY(8, "昨日"),
   *  @param {number} query.dateParam.startDay - 开始时间，格式为yyyyMMdd，和endDay合用，闭区间
      如果是月的话，传当月第一天的日期
   *  @param {number} query.dateParam.endDay - 结束时间，格式为yyyyMMdd，和startDay合用，闭区间
      ,如果表示某一天的话， 必须和startDay相等
   *  @param {string} query.dataModule - "CLUE"，线索分析页面
      "APPLY"，报名分析页面
   *  @return {Promise}
   */
  async getByDate(query) {
    return this.invoke('getByDate', [query]);
  }
}

module.exports = DataReadyProgressFacade;
