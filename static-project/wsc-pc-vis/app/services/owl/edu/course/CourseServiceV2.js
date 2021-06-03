const BaseService = require('../../../base/BaseService');

// 这个 Service 除了 getCoursePCDetail 还有流量不能清 其他都需要清

/* com.youzan.owl.edu.api.course.CourseFacadeV2 -  */
class CourseFacadeV2 extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.course.CourseFacadeV2';
  }

  /**
   *  pc端编辑课程查询课程详情 TOCLEAR
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425099
   *
   *  @param {number} operatorKdtId -
   *  @param {Object} requestDTO -
   *  @param {number} requestDTO.kdtId - 店铺id
   *  @param {string} requestDTO.alias - 课程alias
   *  @param {number} requestDTO.userId - 用户id
   *  @return {Promise}
   */
  async getCoursePCDetail(operatorKdtId, requestDTO) {
    return this.invoke('getCoursePCDetail', [operatorKdtId, requestDTO]);
  }
}

module.exports = CourseFacadeV2;
