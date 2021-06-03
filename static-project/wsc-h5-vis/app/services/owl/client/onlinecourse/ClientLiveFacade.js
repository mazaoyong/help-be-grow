const BaseService = require('../../../base/BaseService');
/* com.youzan.owl.api.LiveNewsService -  */
class LiveNewsService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.onlinecourse.ClientLiveFacade';
  }

  get UPLOAD_SERVICE_NAME() {
    return 'com.youzan.owl.api.common.UploadTokenFacade';
  }

  /**
   *  C端分页查询消息接口
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/475513
*
    *  @param {number} kdtId -
    *  @param {Object} liveNewsReqDTO -
    *  @param {number} liveNewsReqDTO.msgCat - '消息类别：1、提问 2、讨论 3、回复'
    *  @param {number} liveNewsReqDTO.qStatus - 问题状态：1、问题消息未回复 2、问题消息已回复
    *  @param {number} liveNewsReqDTO.modStatus - 修改后的状态
1、正常状态 2、撤回 3、删除
    *  @param {number} liveNewsReqDTO.msgId - 消息id
    *  @param {number} liveNewsReqDTO.pageSize -
    *  @param {number} liveNewsReqDTO.userType - 用户类型：1、讲师 2、听众
    *  @param {string} liveNewsReqDTO.wxUid - wxUid
    *  @param {number} liveNewsReqDTO.page -
    *  @param {number} liveNewsReqDTO.liveId - 直播id
    *  @param {number} liveNewsReqDTO.msgSite - 消息位置
<p>
1、讨论区 2, 主面板
    *  @param {number} liveNewsReqDTO.status - 消息状态：1、正常状态 2、撤回 3、删除
    *  @return {Promise}
    */
  async getLiveNewsByPage(kdtId, liveNewsReqDTO) {
    return this.owlInvoke('getLiveNewsByPage', [kdtId, liveNewsReqDTO]);
  }

  /**
   *  C端 修改enable
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/520839
   *
   *  @param {number} kdtId -
   *  @param {number} liveId -
   *  @param {string} wxUid -
   *  @param {string} reWxUid -
   *  @param {number} enable -
   *  @param {string} alias -
   *  @param {number} buyerId -
   *  @return {Promise}
   */
  async updateEnable(kdtId, liveId, wxUid, reWxUid, enable, alias, buyerId, operatorBuyerUid) {
    return this.invoke('updateEnable', [
      kdtId,
      liveId,
      wxUid,
      reWxUid,
      enable,
      alias,
      operatorBuyerUid,
      buyerId,
    ]);
  }

  /**
   *  C端获取讲师列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/475516
   *
   *  @param {number} kdtId -
   *  @param {Object} liveLectorUserDTO -
   *  @param {number} liveLectorUserDTO.fansId - fansId
   *  @param {string} liveLectorUserDTO.reUid - 被修改的uid
   *  @param {string} liveLectorUserDTO.userDesc - 身份描述
   *  @param {string} liveLectorUserDTO.avatar - 头像
   *  @param {number} liveLectorUserDTO.buyerId -
   *  @param {number} liveLectorUserDTO.liveId - 直播id
   *  @param {string} liveLectorUserDTO.uid - 三方用户账户 (用户open_id)
   *  @param {string} liveLectorUserDTO.nickname - 昵称
   *  @param {string} liveLectorUserDTO.alias - 直播别名
   *  @param {string} liveLectorUserDTO.from - 二维码
   *  @param {number} liveLectorUserDTO.userType - 用户类别
   *  @param {number} liveLectorUserDTO.lectorType - 讲师类别
   *  @param {string} liveLectorUserDTO.timestamp - 讲师邀请码生成时的时间戳
   *  @return {Promise}
   */
  async getLectorUser(kdtId, liveLectorUserDTO) {
    return this.invoke('getLectorUser', [kdtId, liveLectorUserDTO]);
  }

  /**
   *  C端根据wxUid获取讲师信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/888284
   *
   *  @param {number} kdtId -
   *  @param {Object} lectorUserQuery -
   *  @param {string} lectorUserQuery.buyerUid - 用户ID
   *  @param {string} lectorUserQuery.wxUid - 微信用户ID
   *  @param {number} lectorUserQuery.liveId - 直播间ID
   *  @return {Promise}
   */
  async getLectorUserByWxUidV2(kdtId, lectorUserQuery) {
    return this.invoke('getLectorUserByWxUidV2', [kdtId, lectorUserQuery]);
  }

  /**
   *  C端邀请讲师
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/475515
   *
   *  @param {number} kdtId -
   *  @param {Object} liveLectorUserDTO -
   *  @param {number} liveLectorUserDTO.fansId - fansId
   *  @param {string} liveLectorUserDTO.reUid - 被修改的uid
   *  @param {string} liveLectorUserDTO.userDesc - 身份描述
   *  @param {string} liveLectorUserDTO.avatar - 头像
   *  @param {number} liveLectorUserDTO.buyerId -
   *  @param {number} liveLectorUserDTO.liveId - 直播id
   *  @param {string} liveLectorUserDTO.uid - 三方用户账户 (用户open_id)
   *  @param {string} liveLectorUserDTO.nickname - 昵称
   *  @param {string} liveLectorUserDTO.alias - 直播别名
   *  @param {string} liveLectorUserDTO.from - 二维码
   *  @param {number} liveLectorUserDTO.userType - 用户类别
   *  @param {number} liveLectorUserDTO.lectorType - 讲师类别
   *  @param {string} liveLectorUserDTO.timestamp - 讲师邀请码生成时的时间戳
   *  @return {Promise}
   */
  async inviteLecturer(kdtId, liveLectorUserDTO) {
    return this.owlInvoke('inviteLecturer', [kdtId, liveLectorUserDTO]);
  }

  /**
   *  h5生成讲师邀请码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/472450
   *
   *  @param {Object} liveCreateQrDTO -
   *  @param {number} liveCreateQrDTO.kdtId - 店铺id
   *  @param {string} liveCreateQrDTO.alias - 直播别名
   *  @param {number} liveCreateQrDTO.type - 邀请码类型 1：管理员邀请码 2：讲师邀请码 3：推广码
   *  @param {number} liveCreateQrDTO.timestamp - 时间戳
   *  @return {Promise}
   */
  async getInviteLecturerQr(liveCreateQrDTO) {
    return this.invoke('getInviteLecturerQr', [liveCreateQrDTO]);
  }

  /**
   *  C端更新讲师信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/475519
   *
   *  @param {number} kdtId -
   *  @param {Object} liveLectorUserDTO -
   *  @param {number} liveLectorUserDTO.fansId - fansId
   *  @param {string} liveLectorUserDTO.reUid - 被修改的uid
   *  @param {string} liveLectorUserDTO.userDesc - 身份描述
   *  @param {string} liveLectorUserDTO.avatar - 头像
   *  @param {number} liveLectorUserDTO.buyerId -
   *  @param {number} liveLectorUserDTO.liveId - 直播id
   *  @param {string} liveLectorUserDTO.uid - 三方用户账户 (用户open_id)
   *  @param {string} liveLectorUserDTO.nickname - 昵称
   *  @param {string} liveLectorUserDTO.alias - 直播别名
   *  @param {string} liveLectorUserDTO.from - 二维码
   *  @param {number} liveLectorUserDTO.userType - 用户类别
   *  @param {number} liveLectorUserDTO.lectorType - 讲师类别
   *  @param {string} liveLectorUserDTO.timestamp - 讲师邀请码生成时的时间戳
   *  @return {Promise}
   */
  async updateUserInfo(kdtId, liveLectorUserDTO) {
    return this.invoke('updateUserInfo', [kdtId, liveLectorUserDTO]);
  }

  /**
   *  C端直播详情接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/472175
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.fansId - 粉丝id
   *  @param {string} query.sortType - 按排序获取下一篇知识
   *  @param {string} query.alias - 直播alias
   *  @param {number} query.buyerId - 购买人id
   *  @param {number} query.fansType - 粉丝类型
   *  @return {Promise}
   */
  async getLiveDetail(kdtId, query) {
    return this.invoke('getLiveDetail', [kdtId, query]);
  }

  /**
   *  C端 下载用户发送的语音或者图片
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/472195
   *
   *  @param {string} mediaId - 媒体id
   *  @param {number} kdtId - 店铺id
   *  @return {Promise}
   */
  async wxMediaDownLoadAsyn(mediaId, kdtId) {
    return this.owlInvoke('wxMediaDownLoadAsyn', [mediaId, kdtId]);
  }

  /**
   *  语音高保真获取语音下载URL
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/540344
   *
   *  @param {number} kdtId -
   *  @param {string} mediaId -
   *  @param {boolean} useHigh -
   *  @return {Promise}
   */
  async highWxMediaDownLoadAsyn(kdtId, mediaId, useHigh) {
    return this.invoke(this.UPLOAD_SERVICE_NAME, 'highWxMediaDownLoadAsyn', [kdtId, mediaId, useHigh]);
  }

  /**
   *  C端创建直播用户
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/472184
   *
   *  @param {Object} liveUserDTO -
   *  @param {number} liveUserDTO.fansId - fansId
   *  @param {number} liveUserDTO.gender - 性别
   *  @param {number} liveUserDTO.kdtId -
   *  @param {string} liveUserDTO.pass - 密码
   *  @param {string} liveUserDTO.mobile - mobile
   *  @param {number} liveUserDTO.source - 来源
   *  @param {string} liveUserDTO.avatar - 头像
   *  @param {number} liveUserDTO.buyerId - buyerId
   *  @param {number} liveUserDTO.liveId - 直播id
   *  @param {string} liveUserDTO.uid - 三方用户账户 (用户open_id)
   *  @param {number} liveUserDTO.adminId - buyerId
   *  @param {string} liveUserDTO.nickname - 昵称
   *  @param {string} liveUserDTO.appKey - 应用id，shard key
   *  @param {number} liveUserDTO.userType - 用户类型
   *  @param {number} liveUserDTO.lectorType - 讲师类型
   *  @param {string} liveUserDTO.liveAlias - 直播别名
   *  @param {string} liveUserDTO.desc - desc
   *  @param {number} liveUserDTO.fansType - fansType
   *  @return {Promise}
   */
  async createLiveUser(liveUserDTO) {
    return this.owlInvoke('createLiveUser', [liveUserDTO]);
  }

  /**
   *  C端直播列表搜索
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/472176
*
    *  @param {number} kdtId -
    *  @param {Object} query -
    *  @param {number} query.showInStore - 店铺中是否显示 1：是 0：否
    *  @param {number} query.sellStatus - 售卖状态 0: 全部 1：上架 2：下架
    *  @param {Array.<Array>} query.aliasList[] - 直播别名列表
    *  @param {number} query.kdtId - 店铺id
    *  @param {number} query.adminId - userId,卡门只能使用adminId,等待卡门优化
    *  @param {Array.<Array>} query.ids[] - 直播id列表
    *  @param {number} query.source - 获取方式0自动，1手动
    *  @param {number} query.sellerType - 售卖方式
null 全部
1    单独售卖
2    专栏售卖
3    可单独售卖也可以专栏售卖
    *  @param {string} query.title - 直播名称
    *  @param {number} query.buyerId - 购买人id 手机端微页面使用
    *  @param {number} query.liveStatus - 直播状态 0：删除  1:未开始 2：进行中 3：已结束
    *  @param {Object} request -
    *  @param {number} request.pageNumber -
    *  @param {boolean} request.countEnabled - 是否开启count，默认为开启
    *  @param {number} request.pageSize -
    *  @param {Object} request.sort -
    *  @return {Promise}
    */
  async findLivesByPage(kdtId, query, request) {
    return this.owlInvoke('findLivesByPage', [kdtId, query, request]);
  }

  /**
   *  C端微页面组件：分页查询直播列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/891239
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {Array.<Array>} query.ids[] - 微页面自定义专栏时要传入的id字符串，逗号相隔
   *  @param {number} query.source - 获取方式0自动，1手动
   *  @param {number} query.userId - 用户id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageForWym(kdtId, query, pageRequest) {
    return this.invoke('findPageForWym', [kdtId, query, pageRequest]);
  }
}

module.exports = LiveNewsService;
