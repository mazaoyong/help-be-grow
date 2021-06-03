const BaseService = require('../../../../base/BaseService');
/* com.youzan.owl.api.client.edu.family.FamilyAccountFacade -  */
class FamilyAccountFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.family.FamilyAccountFacade';
  }

  /**
   *  确认邀请
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/704727
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 入参
   *  @param {integer} command.invitedUserId - 被邀请人的userId
   *  @param {string} command.inviteCode - 邀请码
   *  @param {integer} command.userId - 操作人的userId
   *  @return {Promise}
   */
  async confirm(kdtId, command) {
    return this.owlInvoke('confirm', [
      kdtId,
      command,
    ]);
  }

  /**
   * 邀请成为家庭用户
   * zanAPI文档地址： http://zanapi.qima-inc.com/site/service/view/704726
   *
   * @param {integer} kdtId - 店铺id
   * @param {Object} command - 入参
   * @param {Object} command.invitedMember - 邀请成员信息
   * @param {string} command.invitedMember.avatar - 头像
   * @param {string} command.invitedMember.name - 姓名
   * @param {integer} command.role - 角色类型
   * @param {integer} command.userId - 邀请者的userId
   * @return {Promise}
   */
  async invite(kdtId, command) {
    return this.owlInvoke('invite', [
      kdtId,
      command,
    ]);
  }

  /**
   * 获取邀请信息
   * zanAPI文档地址： http://zanapi.qima-inc.com/site/service/view/704731
   *
   * @param {integer} kdtId - 店铺id
   * @param {Object} query - 入参
   * @param {string} query.inviteCode - 邀请码
   * @param {integer} query.studentSize - 查出来的学员的数量
   * @param {integer} query.userId - 当前用户的id
   * @return {Promise}
   */
  async getInvitationInfo(kdtId, query) {
    return this.owlInvoke('getInvitationInfo', [
      kdtId,
      query,
    ]);
  }

  /**
   * 获取公众号信息
   * zanAPI文档地址： http://zanapi.qima-inc.com/site/service/view/704732
   *
   * @param {integer} kdtId - 店铺id
   * @param {Object} query - 入参
   * @param {string} query.inviteCode - 邀请码
   * @param {integer} query.userId - 当前用户的id
   * @return {Promise}
   */
  async getMpAccount(kdtId, query) {
    return this.owlInvoke('getMpAccount', [
      kdtId,
      query,
    ]);
  }

  /**
   * 获取邀请链接倒计时
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/705524
   *
   * @param {integer} kdtId - 店铺id
   * @param {string} code - 邀请码
   * @return {Promise}
   */
  async getInvitationByCode(kdtId, code) {
    return this.owlInvoke('getInvitationByCode', [
      kdtId,
      code,
    ]);
  }

  /**
   * 查询当前用户的家庭账号信息
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/704730
   *
   * @param {integer} kdtId - 店铺id
   * @param {object} query - 入参
   * @param {integer} query.userId  - 当前客户的userId
   * @return {Promise}
   */
  async getAccount(kdtId, query) {
    return this.owlInvoke('getAccount', [
      kdtId,
      query,
    ]);
  }

  /**
   *  取消邀请
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/704728
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.inviteCode - 邀请码
   *  @param {number} command.userId - 操作人的userId
   *  @return {Promise}
   */
  async cancel(kdtId, command) {
    return this.invoke('cancel', [kdtId, command]);
  }

  /**
   *  移除家庭中的某个成员
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/704729
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.userId - 操作人的userId
   *  @param {number} command.removeUserId - 待移除的成员userId
   *  @return {Promise}
   */
  async remove(kdtId, command) {
    return this.invoke('remove', [kdtId, command]);
  }
  /**
   *  获取邀请状态信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/728967
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} userId - 客户id
   *  @param {string} inviteCode - 邀请码
   *  @return {Promise}
   */
  async getInviteState(kdtId, userId, inviteCode) {
    return this.invoke('getInviteState', [kdtId, userId, inviteCode]);
  }
}

module.exports = FamilyAccountFacade;
