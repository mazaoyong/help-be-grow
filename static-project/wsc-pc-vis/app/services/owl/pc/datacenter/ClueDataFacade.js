const BaseService = require('../../../base/BaseService');

/**
 * 线索数据
 */
class ClueDataFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.datacenter.ClueDataFacade';
  }

  /**
   *  线索概况
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/569370
   *
   *  @param {number} kdtId -
   *  @param {Object} clueDataOverviewQuery -
   *  @param {Object} clueDataOverviewQuery.dateParam - 时间参数
   *  @param {number} clueDataOverviewQuery.dateParam.dateType - 日期类型
      REAL_TIME(0, "今日实时"),
      NATURAL_DAY(1, "自然天"),
      NATURAL_WEEK(2, "自然周"),
      NATURAL_MONTH(3, "自然月"),
      LAST_SEVEN_DAY(4, "最近7天"),
      LAST_THIRTY_DAY(5, "最近30天"),
      SELF_DEFINE(6, "自定义"),
      NATURAL_QUARTER(7, "自然季度"),
      YESTERDAY(8, "昨日"),
   *  @param {number} clueDataOverviewQuery.dateParam.startDay - 开始时间，格式为yyyyMMdd，和endDay合用，闭区间
 如果是月的话，传当月第一天的日期
   *  @param {number} clueDataOverviewQuery.dateParam.endDay - 结束时间，格式为yyyyMMdd，和startDay合用，闭区间
 ,如果表示某一天的话， 必须和startDay相等
   *  @param {Object} clueDataOverviewQuery.kdtParam - 店铺参数
   *  @param {number} clueDataOverviewQuery.kdtParam.kdtId - kdtId
   *  @param {number} clueDataOverviewQuery.kdtParam.hqKdtId - 总店Id
   *  @param {number} clueDataOverviewQuery.kdtParam.queryType - 查询类型
      0，查普通店铺（非连锁单店）
      1，查连锁总店（单独查总店这一个店铺）
      2，查连锁校区（单独查校区）
      3，查所有店铺的加总
   *  @return {Promise}
   */
  async getOverview(kdtId, clueDataOverviewQuery) {
    return this.invoke('getOverview', [kdtId, clueDataOverviewQuery]);
  }

  /**
   *  来源分析
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/569371
   *
   *  @param {number} kdtId -
   *  @param {Object} clueDataSourceQuery - clueDataSourceQuery
   *  @param {Object} clueDataSourceQuery.dateParam - 时间参数
   *  @param {string} clueDataSourceQuery.statType - 统计类型
      CLUE_NEW("clue_new","新增线索"),
      CLUE_DEAL("clue_deal","成交线索"),
      CLUE_DEAL_AMOUNT("clue_deal_amount","线索成交金额");
   *  @param {string} clueDataSourceQuery.operateMobile - 操作人手机号码（导出时用）
   *  @param {Array.<Array>} clueDataSourceQuery.sourceIdList[] - 来源id/来源分组Id列表
   *  @param {Object} clueDataSourceQuery.kdtParam - 店铺参数
   *  @param {number} clueDataSourceQuery.dataType - 查询类型，1：来源，2：来源分组
   *  @param {string} clueDataSourceQuery.operateName - 操作人姓名(导出时用)
   *  @return {Promise}
   */
  async getSourceAnalyse(kdtId, clueDataSourceQuery) {
    return this.invoke('getSourceAnalyse', [kdtId, clueDataSourceQuery]);
  }

  /**
   *  转化分析
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/569372
   *
   *  @param {number} kdtId -
   *  @param {Object} clueDataCVRQuery -
   *  @param {Object} clueDataCVRQuery.dateParam - 时间参数
   *  @param {Object} clueDataCVRQuery.kdtParam - 店铺参数
   *  @param {number} clueDataCVRQuery.srcId - 来源id
   *  @param {number} clueDataCVRQuery.srcGroupId - 来源分组id
   *  @return {Promise}
   */
  async getCVRAnalyse(kdtId, clueDataCVRQuery) {
    return this.invoke('getCVRAnalyse', [kdtId, clueDataCVRQuery]);
  }
}

module.exports = ClueDataFacade;
