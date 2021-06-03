const BaseService = require('../../../base/BaseService');

class GrouponService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.groupon.GrouponFacade';
  }

  /**
   *  获取用户拼团实例详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/282387
   *
   *  @param {number} kdtId -
   *  @param {Object} grouponQueryDTO -
   *  @param {number} grouponQueryDTO.orderNo -
   *  @param {number} grouponQueryDTO.fansId -
   *  @param {number} grouponQueryDTO.adminId -
   *  @param {number} grouponQueryDTO.yzFansId -
   *  @param {number} grouponQueryDTO.fansType -
   *  @return {Promise}
   */
  async get(kdtId, grouponQueryDTO) {
    const result = await this.owlInvoke('get', [kdtId, grouponQueryDTO]);
    return result;
  }
}

module.exports = GrouponService;
