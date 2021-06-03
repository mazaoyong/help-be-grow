const BaseService = require('../../../base/BaseService');

class CourseFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.CourseFacade';
  }

  /**
   * @description 学习明细--课程维度
   * @link http://zanapi.qima-inc.com/site/service/view/923269
   */
  async findDetail(kdtId, pageRequest, query) {
    return this.invoke('findDetail', [kdtId, pageRequest, query]);
  }

  /**
   *  获取用户学习明细--课程+用户维度
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/925540
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {string} query.courseAlias - 课程或者专栏alias
   *  @param {number} query.courseId - 课程ID
   *  @param {number} query.userId - 用户ID
   *  @return {Promise}
   */

  /**
   *  获取用户学习概况--课程+用户维度（实际上可以从上个页面findDetail带过来）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/923272
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.courseAlias - 课程或者专栏alias
   *  @param {number} query.courseId - 课程ID
   *  @param {number} query.userId - 用户ID
   *  @return {Promise}
   */
  async getUserOverview(kdtId, query) {
    return this.invoke('getUserOverview', [kdtId, query]);
  }

  /**
               *
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/925197
  *
                *  @param {number} kdtId - 店铺id
                *  @param {number} courseType - @see com.youzan.owl.data.api.onlinecourse.enums.DataCourseTypeEnum   1：专栏 2：内容
                *  @param {number} courseId - 内容、专栏id
    学习概况--课程维度
                *  @return {Promise}
                */
  async getOverview(kdtId, courseType, courseId) {
    return this.invoke('getOverview', [kdtId, courseType, courseId]);
  }

  /**
               *  学习趋势--课程+日期维度
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/923268
  *
               *  @param {number} kdtId -
               *  @param {Object} query -
               *  @param {number} query.courseType - 课程类型
               *  @param {number} query.startDay - 开始时间，格式为yyyyMMdd，和endDay合用，闭区间
   如果是月的话，传当月第一天的日期
               *  @param {number} query.endDay - 结束时间，格式为yyyyMMdd，和startDay合用，闭区间
   ,如果表示某一天的话， 必须和startDay相等
               *  @param {number} query.courseId - 课程ID
               *  @return {Promise}
               */
  async getTrend(kdtId, query) {
    return this.invoke('getTrend', [kdtId, query]);
  }

  /**
   *  获取用户学习明细--课程+用户维度
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/925540
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {string} query.courseAlias - 课程或者专栏alias （由于底层数据无法确定 我这边暂时用courseId 来查询 后面数据有了可能使用courseAlias）
   *  @param {number} query.courseId - 课程ID
   *  @param {number} query.userId - 用户ID
   *  @return {Promise}
   */
  async findUserLearnDetail(kdtId, pageRequest, query) {
    return this.invoke('findUserLearnDetail', [kdtId, pageRequest, query]);
  }

  /**
               *  提交导出任务
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/926432
  *
               *  @param {number} kdtId -
               *  @param {Object} query -
               *  @param {Array.<Array>} query.contentAliasList[] - 课程Alias
               *  @param {Array} query.contentAliasList[] -
               *  @param {number} query.courseType - 课程类型   1 专栏 2 内容
               *  @param {string} query.operateMobile - 操作人手机号码（导出时用）
               *  @param {string} query.operateName - 操作人姓名(导出时用)
               *  @param {number} query.courseId - 课程ID(内容或者专栏ID)
   courseType = 1 专栏ID
   courseType = 2 内容ID
               *  @param {number} query.userId - 用户ID
               *  @return {Promise}
               */
  async exportTask(kdtId, query) {
    return this.invoke('exportTask', [kdtId, query]);
  }
}

module.exports = CourseFacade;
