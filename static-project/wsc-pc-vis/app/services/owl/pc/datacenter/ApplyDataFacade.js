const BaseService = require('../../../base/BaseService');

/**
 * 线索数据
 */
class ClueDataFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.datacenter.ApplyDataFacade';
  }

  /**
   *  线索概况
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/542564
   *
   *  @param {number} kdtId -
   *  @param {Object} applyDataOverviewQuery -
   *  @param {Object} applyDataOverviewQuery.dateParam - 时间参数
   *  @param {number} applyDataOverviewQuery.dateParam.dateType - 日期类型
      REAL_TIME(0, "今日实时"),
      NATURAL_DAY(1, "自然天"),
      NATURAL_WEEK(2, "自然周"),
      NATURAL_MONTH(3, "自然月"),
      LAST_SEVEN_DAY(4, "最近7天"),
      LAST_THIRTY_DAY(5, "最近30天"),
      SELF_DEFINE(6, "自定义"),
      NATURAL_QUARTER(7, "自然季度"),
      YESTERDAY(8, "昨日"),
   *  @param {number} applyDataOverviewQuery.dateParam.startDay - 开始时间，格式为yyyyMMdd，和endDay合用，闭区间
 如果是月的话，传当月第一天的日期
   *  @param {number} applyDataOverviewQuery.dateParam.endDay - 结束时间，格式为yyyyMMdd，和startDay合用，闭区间
 ,如果表示某一天的话， 必须和startDay相等
   *  @param {Object} applyDataOverviewQuery.kdtParam - 店铺参数
   *  @param {number} applyDataOverviewQuery.kdtParam.kdtId - kdtId
   *  @param {number} applyDataOverviewQuery.kdtParam.hqKdtId - 总店Id
   *  @param {number} applyDataOverviewQuery.kdtParam.queryType - 查询类型
      0，查普通店铺（非连锁单店）
      1，查连锁总店（单独查总店这一个店铺）
      2，查连锁校区（单独查校区）
      3，查所有店铺的加总
   *  @return {Promise}
   */
  async getOverview(kdtId, applyDataOverviewQuery) {
    return this.invoke('getOverview', [kdtId, applyDataOverviewQuery]);
  }

  /**
   *  课程收款分布
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/542565
   *
   *  @param {number} kdtId -
   *  @param {Object} applyDataCoursePaidQuery -
   *  @param {Object} applyDataCoursePaidQuery.dateParam - 时间参数
   *  @param {Array.<Array>} applyDataCoursePaidQuery.courseIds[] - 自选课程列表
   *  @param {Object} applyDataCoursePaidQuery.kdtParam - 店铺参数
   *  @return {Promise}
   */
  async getCoursePaidAmount(kdtId, applyDataCoursePaidQuery) {
    return this.invoke('getCoursePaidAmount', [kdtId, applyDataCoursePaidQuery]);
  }

  /**
   *  报名学员构成
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/542566
   *
   *  @param {number} kdtId -
   *  @param {Object} applyDataStudentQuery -
   *  @param {Object} applyDataStudentQuery.dateParam - 时间参数
   *  @param {number} applyDataStudentQuery.dateParam.dateType - 日期类型
   *  @param {number} applyDataStudentQuery.dateParam.startDay - 开始时间
   *  @param {number} applyDataStudentQuery.dateParam.endDay - 结束时间
   *  @param {Object} applyDataStudentQuery.kdtParam - 店铺参数
   *  @param {number} applyDataStudentQuery.kdtParam.kdtId - BU kdtId列表
   *  @param {number} applyDataStudentQuery.kdtParam.hqKdtId - 总店Id
   *  @param {number} applyDataStudentQuery.kdtParam.queryType - 查询类型
   *  @return {Promise}
   */
  async getStudentPaidAmount(kdtId, applyDataStudentQuery) {
    return this.invoke('getStudentPaidAmount', [kdtId, applyDataStudentQuery]);
  }

  /**
   *  课时销售表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/542567
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber - 分页页数
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize - 分页大小
   *  @param {Object} pageRequest.sort - 分页排序
   *  @param {Object} applyDataCourseAssetQuery - [order]
      direction: DESC(降序)
                  ASC(升序)

      property: ASSET_NUM(销售课时数)
                PAID_AMOUNT(收款金额)
                ASSET_PRICE_AVG(平均课时价格)
                ASSET_GIVEN_NUM(赠送课时数)
                ASSET_UNUSED_NUM(待消耗课时数)
   *  @param {Object} applyDataCourseAssetQuery.dateParam - 时间参数
   *  @param {Object} applyDataCourseAssetQuery.kdtParam - 店铺参数
   *  @param {string} applyDataCourseAssetQuery.name - 课程名称
   *  @return {Promise}
   */
  async findCourseAssetPaidByPage(kdtId, pageRequest, applyDataCourseAssetQuery) {
    return this.invoke('findCourseAssetPaidByPage', [
      kdtId,
      pageRequest,
      applyDataCourseAssetQuery,
    ]);
  }

  /**
   *  课时销售表-总计
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/563298
   *
   *  @param {number} kdtId -
   *  @param {Object} applyDataCourseAssetQuery -
   *  @param {Object} applyDataCourseAssetQuery.dateParam - 时间参数
   *  @param {Object} applyDataCourseAssetQuery.kdtParam - 店铺参数
   *  @param {string} applyDataCourseAssetQuery.name - 课程名称
   *  @return {Promise}
   */
  async findCourseAssetPaidTotal(kdtId, applyDataCourseAssetQuery) {
    return this.invoke('findCourseAssetPaidTotal', [kdtId, applyDataCourseAssetQuery]);
  }
}

module.exports = ClueDataFacade;
