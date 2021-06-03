const BaseService = require('../../../base/BaseService');
/**
 */
class AdminService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.teacher.AdminFacade';
  }

  /**
   *  获取当前用户的信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/366038
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} staffId - staffId
   */
  async getById(kdtId, staffId) {
    return this.invoke('getById', [kdtId, staffId]);
  }

  /**
   *  更新头像，如果是教师则更新教师头像，否则更新 UIC 头像
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/673034
   *
   *  @param {number} kdtId -
   *  @param {Object} param -
   *  @param {string} param.avatar -
   *  @param {number} param.userId -
   *  @return {Promise}
   */
  async update(kdtId, param) {
    return this.invoke('update', [kdtId, param]);
  }
}

module.exports = AdminService;
