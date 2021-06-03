const BaseService = require('../../../../base/BaseService');

class EduIntroductionFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.ump.introduction.EduIntroductionFacade';
  }

  /**
   * 查找店铺中最新正在进行中的活动
   * zanAPI地址： http://zanapi.qima-inc.com/site/service/view/883346
   *
   * @param {integer} kdtId - 店铺id
   * @param {integer} query -
   * @param {integer} query.alias - 活动alias
   * @param {integer} query.userId - userId
   * @return {Promise}
   */
  async getIntroductionActivity(kdtId, query) {
    return this.invoke('getIntroductionActivity', [kdtId, query]);
  }

  /**
   * 被介绍人（新学员）的活动页面信息
   * zanAPI地址：http://zanapi.qima-inc.com/site/service/view/883348
   *
   * @param {integer} kdtId - 店铺id
   * @param {Object} query - 入参
   * @param {string} query.alias - 活动alias
   * @param {integer} query.introducerUserId - 介绍人id
   * @param {integer} query.userId - 当前用户id
   * @return {Promise}
   */
  async getRefereeActivityDetail(kdtId, query) {
    return this.invoke('getRefereeActivityDetail', [kdtId, query]);
  }

  /**
   * 参加活动的鉴权-只有老学员才能参加
   * zanAPI地址：http://zanapi.qima-inc.com/site/service/view/836253
   *
   * @param {integer} kdtId - 店铺id
   * @param {Object} authActivityCommand - 入参
   * @param {string} authActivityCommand.alias - 活动别名
   * @param {integer} authActivityCommand.userId - 介绍人的用户id
   * @return {Promise}
   */
  async checkActivityThreshold(kdtId, authActivityCommand) {
    return this.invoke('checkActivityThreshold', [kdtId, authActivityCommand]);
  }

  /**
   * 分页查询邀请记录,目前查询的是店铺中所有邀请的记录，没有根据活动区分
   * 默认排序：邀请时间倒序
   * zanAPI地址：http://zanapi.qima-inc.com/site/service/view/836254
   *
   * @param {integer} kdtId - 店铺id
   * @param {Object} pageRequest - 入参
   * @param {boolean} pageRequest.countEnabled
   * @param {integer} pageRequest.pageNumber
   * @param {integer} pageRequest.pageSize
   * @param {Object} pageRequest.sort
   * @param {Array} pageRequest.sort.orders
   * @param {Object} introduceRecordQuery - 入参
   * @param {string} introduceRecordQuery.alias - 活动别名（非必传）
   * @param {integer} introduceRecordQuery.userId - 介绍人id
   * @return {Promise}
   */
  async findIntroduceRecord(kdtId, pageRequest, introduceRecordQuery) {
    return this.invoke('findIntroduceRecord', [kdtId, pageRequest, introduceRecordQuery]);
  }

  /**
   * 审核图片是否涉黄或涉及政治
   * zanAPI地址：http://zanapi.qima-inc.com/site/service/view/868878
   *
   * @param {string} url - 图片地址
   * @return {Promise}
   */
  async imageAppraise(url) {
    return this.invoke('imageAppraise', [url]);
  }

  /**
   *  助力，点击送能量
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836355
   *
   *  @param {number} kdtId -
   *  @param {Object} collectZanCommand -
   *  @param {string} collectZanCommand.alias - 活动别名
   *  @param {number} collectZanCommand.refereeUserId - 发起点赞活动人的用户id，即被介绍人的用户id
   *  @param {number} collectZanCommand.userId - 点赞人的用户id
   *  @return {Promise}
   */
  async collectZan(kdtId, collectZanCommand) {
    return this.invoke('collectZan', [kdtId, collectZanCommand]);
  }

  /**
   *  被介绍人分享活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836258
   *
   *  @param {number} kdtId -
   *  @param {Object} shareActivityCommand -
   *  @param {string} shareActivityCommand.alias - 活动alias
   *  @param {number} shareActivityCommand.userId - 被介绍人用户id
   *  @return {Promise}
   */
  async refereeShareActivity(kdtId, shareActivityCommand) {
    return this.invoke('refereeShareActivity', [kdtId, shareActivityCommand]);
  }

  /**
   *  被介绍人奖励领取
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/875002
   *
   *  @param {number} kdtId -
   *  @param {Object} receiveAwardCommand -
   *  @param {string} receiveAwardCommand.alias - 活动alias
   *  @param {number} receiveAwardCommand.userId - 被介绍人的用户id
   *  @return {Promise}
   */
  async receiveAward(kdtId, receiveAwardCommand) {
    return this.invoke('receiveAward', [kdtId, receiveAwardCommand]);
  }

  /**
   *  提交活动的资料项
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836257
   *
   *  @param {number} kdtId -
   *  @param {Object} introductionAttributeCommand - 资料项，资料项有attibuteKey,attibuteKey也需要传过来
   *  @param {string} introductionAttributeCommand.verifyCode - 验证码
   *  @param {Array.<Object>} introductionAttributeCommand.attributeItems[] - 填写的资料项值
   *  @param {string} introductionAttributeCommand.alias - 活动别名
   *  @param {number} introductionAttributeCommand.userId - 被介绍人的用户id
   *  @return {Promise}
   */
  async confirmIntroductionAttributeItem(kdtId, introductionAttributeCommand) {
    return this.invoke('confirmIntroductionAttributeItem', [kdtId, introductionAttributeCommand]);
  }

  /**
   *  发送验证码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836256
   *
   *  @param {number} kdtId -
   *  @param {Object} sendVerifyCodeCommand -
   *  @param {string} sendVerifyCodeCommand.mobile - 手机号
   *  @param {string} sendVerifyCodeCommand.alias - 活动alias
   *  @param {number} sendVerifyCodeCommand.userId - 用户id， 被介绍人的用户id
   *  @return {Promise}
   */
  async sendVerifyCode(kdtId, sendVerifyCodeCommand) {
    return this.invoke('sendVerifyCode', [kdtId, sendVerifyCodeCommand]);
  }

  /**
   *  查询活动需要的资料项信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/836351
   *
   *  @param {number} kdtId -
   *  @param {string} alias - 活动别名
   *  @return {Promise}
   */
  async getIntroductionAttribute(kdtId, alias) {
    return this.invoke('getIntroductionAttribute', [kdtId, alias]);
  }

  /*
   * 获取已参加活动的人数
   * zanAPI地址： http://zanapi.qima-inc.com/site/service/view/883347
   *
   * @param {integer} kdtId - 店铺id
   * @param {string} query -
   * @param {string} query.alias - 别名
   * @param {integer} query.bizScene - 业务场景，区分是老学员活动页面，还是新学员活动场景
   * @return {Promise}
   */
  async getActivityParticipatePeople(kdtId, query) {
    return this.invoke('getActivityParticipatePeople', [kdtId, query]);
  }

  /*
   * 活动老学员实例维度统计
   * zanAPI地址：http://zanapi.qima-inc.com/site/service/view/1040871
   *
   * @param {integer} kdtId - 店铺id
   * @param {object} query -
   * @param {integer} query.id - 活动id
   * @param {integer} query.userId - 当前用户id
   * @return {Promise}
   */
  async getOldStudentSummary(kdtId, query) {
    return this.invoke('getOldStudentSummary', [kdtId, query]);
  }

  /**
   * 查询用户的活动参与状态
   * zanApi http://zanapi.qima-inc.com/site/service/view/1040872
   *
   * @param {integer} kdtId - 店铺id
   * @param {object} query -
   * @param {integer} query.alias - 活动alias
   * @param {integer} query.userId - 当前用户id
   * @return {Promise}
   *
   */
  async getUserParticipateInfo(kdtId, query) {
    return this.invoke('getUserParticipateInfo', [kdtId, query]);
  }

  /**
   * 助力，用户点赞情况
   * zanApi http://zanapi.qima-inc.com/site/service/view/1050453
   *
   * @param {integer} kdtId - 店铺id
   * @param {object} query -
   * @param {integer} query.alias - 活动alias
   * @param {integer} query.fromUserId - 助力人
   * @param {integer} query.toUserId - 被助力人
   * @return {Promise}
   *
   */
  async getCollectZanUserStatus(kdtId, query) {
    return this.invoke('getCollectZanUserStatus', [kdtId, query]);
  }

  async refererShareActivity(kdtId, query) {
    return this.invoke('refererShareActivity', [kdtId, query]);
  }

  async getHelperList(kdtId, query) {
    return this.invoke('getHelperList', [kdtId, query]);
  }
}

module.exports = EduIntroductionFacade;
