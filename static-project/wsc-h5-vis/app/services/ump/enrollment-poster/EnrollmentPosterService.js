const BaseService = require('../../base/BaseService');

/* com.youzan.owl.api.enrollmentposter.EnrollmentPosterFacade -  */
class EnrollmentPosterFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.enrollmentposter.EnrollmentPosterFacade';
  }

  /**
   *  根据海报id获取海报详情（C端）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/711821
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} id - 海报活动ID
   *  @return {Promise}
   */
  async getById(kdtId, id) {
    return this.invoke('getById', [kdtId, id]);
  }
}

module.exports = EnrollmentPosterFacade;
