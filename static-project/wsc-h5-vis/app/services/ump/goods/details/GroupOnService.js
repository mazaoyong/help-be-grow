const BaseService = require('../../../base/BaseService');

/* com.youzan.ump.goods.details.api.service.GroupOnService -  */
class GroupOnService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.goods.details.api.service.GroupOnService';
  }

  /**
   *  分页查询用户头像昵称
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/271610
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {number} groupId - 团Id
   *  @param {number} page - 页数
   *  @param {number} pageSize - 每页数量 1 <= pageSize <= 10 ,超过10会设置为10
   *  @return {Promise}
   */
  async getGroupOnJoinRecordByPage(kdtId, groupId, page, pageSize) {
    return this.owlInvoke('getGroupOnJoinRecordByPage', [
      kdtId,
      groupId,
      page,
      pageSize,
    ]);
  }
}

module.exports = GroupOnService;
