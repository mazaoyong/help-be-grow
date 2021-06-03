const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.client.edu.course.CourseFacade -  */
class CourseFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.course.CourseFacade';
  }

  /**
   *  C端领取体验课页面，查询店铺设置的预设上课地点和上课时间（如果有）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/481498
   *
   *  @param {number} kdtId -
   *  @param {Object} courseTimeAddrQuery -
   *  @param {Object} courseTimeAddrQuery.userWrapDTO - 用户信息
   *  @param {string} courseTimeAddrQuery.channel - 活动渠道
   *  @param {number} courseTimeAddrQuery.bizId - 业务id
   *  @return {Promise}
   */
  async getCourseTimeAddr(kdtId, courseTimeAddrQuery) {
    return this.invoke('getCourseTimeAddr', [kdtId, courseTimeAddrQuery]);
  }

  /**
   *  C端领取体验课页面，查询店铺设置的预设上课地点和上课时间（如果有）
   *  通过alias获取——用于入学奖励页面
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/486505
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {string} alias - 课程alias
   *  @return {Promise}
   */
  async getCourseTimeAddrByAlias(kdtId, alias) {
    return this.invoke('getCourseTimeAddrByAlias', [kdtId, alias]);
  }
}

module.exports = CourseFacade;
