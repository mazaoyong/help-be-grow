const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.onlinecourse.EduLiveVideoFacade -  */
class EduLiveVideoFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.EduLiveVideoFacade';
  }

  /**
   *  直播剩余的能力。时间，金额等...
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/744561
   *
   *  @param {number} kdtId -
   *  @param {Object} liveVideoSurplusQuery -
   *  @param {number} liveVideoSurplusQuery.liveType - 4: 保利威直播；5: 教育-保利威视频直播
   *  @return {Promise}
   */
  async liveVideoSurplus(kdtId, liveVideoSurplusQuery) {
    return this.invoke('liveVideoSurplus', [kdtId, liveVideoSurplusQuery]);
  }

  /**
   *  开启/关闭 回放
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/744477
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async playbackOpen(kdtId, alias) {
    return this.invoke('playbackOpen', [kdtId, alias]);
  }

  /**
   *  异步创建直播
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/757150
   *
   *  @param {number} kdtId -
   *  @param {Object} liveVideoCommand -
   *  @param {number} liveVideoCommand.connectionNumber - 连线人数
   *  @param {number} liveVideoCommand.openPureRtc - 是否开启无延迟  0 否  1是
   *  @param {number} liveVideoCommand.liveType - 4: 保利威直播；5: 教育-保利威视频直播
   *  @param {number} liveVideoCommand.openConnection - 开启课堂连线
   *  @param {string} liveVideoCommand.name - name
   *  @param {string} liveVideoCommand.lecturer - 讲师
   *  @param {string} liveVideoCommand.liveStartAt - 直播开始时间
   *  @param {number} liveVideoCommand.scene - 1. 三分屏场景  2. 普通场景
   *  @param {string} liveVideoCommand.desc - 直播简介
   *  @return {Promise}
   */
  async asyncCreateLive(kdtId, liveVideoCommand) {
    return this.invoke('asyncCreateLive', [kdtId, liveVideoCommand]);
  }

  /**
   *  返回当前直播频道的创建状态 0: 创建中 1: 已创建 2.创建失败
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/744508
   *
   *  @param {number} kdtId -
   *  @param {string} createId -
   *  @return {Promise}
   */
  async getAsyncCreateStatus(kdtId, createId) {
    return this.invoke('getAsyncCreateStatus', [kdtId, createId]);
  }

  /**
   *  视频直播创建的check
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/744558
   *
   *  @param {number} kdtId -
   *  @param {Object} liveVideoCreateCheckCommand -
   *  @param {number} liveVideoCreateCheckCommand.liveType - 4: 保利威直播；5: 教育-保利威视频直播
   *  @return {Promise}
   */
  async liveVideoCreateCheck(kdtId, liveVideoCreateCheckCommand) {
    return this.invoke('liveVideoCreateCheck', [kdtId, liveVideoCreateCheckCommand]);
  }

  /**
   *  教师端获取进入直播的信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/755932
   *
   *  @param {number} kdtId -
   *  @param {Object} liveEntryQuery -
   *  @param {string} liveEntryQuery.alias -
   *  @return {Promise}
   */
  async getLiveEnterInfo(kdtId, liveEntryQuery) {
    return this.invoke('getLiveEnterInfo', [kdtId, liveEntryQuery]);
  }

  /**
   *  新增助教，嘉宾
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/744563
   *
   *  @param {number} kdtId -
   *  @param {Object} assistantCommand -
   *  @param {string} assistantCommand.name - 名称
   *  @param {string} assistantCommand.alias - 直播alias
   *  @param {string} assistantCommand.visitCode - 邀请码
   *  @param {string} assistantCommand.channelId - 频道号
   *  @param {string} assistantCommand.account - 角色id
   *  @param {number} assistantCommand.actorType - 角色类型，1 助教 2嘉宾
   *  @return {Promise}
   */
  async addRole(kdtId, assistantCommand) {
    return this.invoke('addAssistant', [kdtId, assistantCommand]);
  }

  /**
   *  删除助教，嘉宾 (alias, account)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/744564
   *
   *  @param {number} kdtId -
   *  @param {Object} assistantCommand -
   *  @param {string} assistantCommand.name - 名称
   *  @param {string} assistantCommand.alias - 直播alias
   *  @param {string} assistantCommand.visitCode - 邀请码
   *  @param {string} assistantCommand.channelId - 频道号
   *  @param {string} assistantCommand.account - 助教id
   *  @return {Promise}
   */
  async deleteRole(kdtId, assistantCommand) {
    return this.invoke('deleteAssistant', [kdtId, assistantCommand]);
  }

  /**
   *  更新助教，嘉宾信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/765410
   *
   *  @param {number} kdtId -
   *  @param {Object} assistantUpdateCommand -
   *  @param {string} assistantUpdateCommand.name - 助教名称
   *  @param {string} assistantUpdateCommand.alias - 直播alias
   *  @param {string} assistantUpdateCommand.account - 子频道ID（助教账户）
   *  @return {Promise}
   */
  async updateRole(kdtId, assistantUpdateCommand) {
    return this.invoke('updateAssistant', [kdtId, assistantUpdateCommand]);
  }

  /**
   *  概况
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/888873
   *
   *  @param {number} kdtId -
   *  @param {Object} liveVideoSurveyQuery -
   *  @param {number} liveVideoSurveyQuery.targetKdtId - 总部下目标校区的kdtId
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @return {Promise}
   */
  async liveVideoSurveyV2(kdtId, liveVideoSurveyQuery, pageRequest) {
    return this.invoke('liveVideoSurveyV2', [
      kdtId,
      liveVideoSurveyQuery,
      pageRequest
    ]);
  }

  /**
   *  刷新概况
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/888874
   *
   *  @param {number} kdtId -
   *  @param {Object} liveVideoSurveyQuery -
   *  @param {number} liveVideoSurveyQuery.targetKdtId - 总部下目标校区的kdtId
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @return {Promise}
   */
  async refreshSurveyV2(kdtId, liveVideoSurveyQuery, pageRequest) {
    return this.invoke('refreshSurveyV2', [
      kdtId,
      liveVideoSurveyQuery,
      pageRequest
    ]);
  }

  /**
   *  充值
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/757161
   *
   *  @param {number} kdtId -
   *  @param {number} value -
   *  @return {Promise}
   */
  async confirmRecharge(kdtId, value) {
    return this.invoke('confirmRecharge', [kdtId, value]);
  }

  /**
   *  回放管理-视频列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/887998
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async livePlayBackList(kdtId, alias) {
    return this.invoke('livePlayBackList', [kdtId, alias]);
  }

  /**
   *  设置回放顺序
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/888648
   *
   *  @param {number} kdtId -
   *  @param {Object} orderPlayBackCommand -
   *  @param {Array} orderPlayBackCommand.vids[] - 从先到后排序的排序列表
   *  @param {string} orderPlayBackCommand.alias - 商品alias
   *  @return {Promise}
   */
  async playBackOrder(kdtId, orderPlayBackCommand) {
    return this.invoke('playBackOrder', [kdtId, orderPlayBackCommand]);
  }

  /**
   *  删除回放视频
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/888647
   *
   *  @param {number} kdtId -
   *  @param {Object} deletePlayBackCommand -
   *  @param {string} deletePlayBackCommand.vid - 系统视频ID
   *  @param {string} deletePlayBackCommand.alias - 商品alias
   *  @param {string} deletePlayBackCommand.fileId - 文件id
   *  @return {Promise}
   */
  async deletePlayBackLive(kdtId, deletePlayBackCommand) {
    return this.invoke('deletePlayBackLive', [kdtId, deletePlayBackCommand]);
  }

  /**
   *  查询直播间设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/888649
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getLiveSetting(kdtId, alias) {
    return this.invoke('getLiveSetting', [kdtId, alias]);
  }

  /**
   *  设置直播间
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/888650
   *
   *  @param {number} kdtId -
   *  @param {Object} liveSettingCommand -
   *  @param {number} liveSettingCommand.marqueeType - 跑马灯类型 1：固定文字；2：客户名称
   *  @param {string} liveSettingCommand.marqueeFontColor - 跑马灯字体颜色，例如 #ffffff
   *  @param {number} liveSettingCommand.showOnlineNumber - 在线人数 0：隐藏；1：显示
   *  @param {string} liveSettingCommand.marqueeContent - 跑马灯内容
   *  @param {number} liveSettingCommand.marqueeFontSize - 跑马灯字体大小
   *  @param {number} liveSettingCommand.marqueeOpacity - 跑马灯不透明度，范围是 0 ~ 100
   *  @param {number} liveSettingCommand.chatImage - 图片聊天 0：关闭；1：开启
   *  @param {number} liveSettingCommand.openMarquee - 跑马灯 0：关闭；1：开启
   *  @param {number} liveSettingCommand.sendFlowers - 送花 0：关闭；1：开启
   *  @param {number} liveSettingCommand.showOnlineList - 在线列表 0：隐藏；1：显示
   *  @param {string} liveSettingCommand.alias -
   *  @param {number} liveSettingCommand.openWelcome - 欢迎语 0：关闭；1：开启
   *  @param {number} liveSettingCommand.openBarrage - 打开弹幕 0：关闭；1：打开
   *  @return {Promise}
   */
  async liveSetting(kdtId, liveSettingCommand) {
    return this.invoke('liveSetting', [kdtId, liveSettingCommand]);
  }

  /**
   *  查询直播间信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/888670
   *
   *  @param {number} kdtId -
   *  @param {Object} liveFlowQuery -
   *  @param {string} liveFlowQuery.alias -
   *  @return {Promise}
   */
  async getLiveFlowDetail(kdtId, liveFlowQuery) {
    return this.invoke('getLiveFlowDetail', [kdtId, liveFlowQuery]);
  }

  /**
   *  更新讲师
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/889067
   *
   *  @param {number} kdtId -
   *  @param {string} teacherUpdateCommand -
   *  @return {Promise}
   */
  async updateTeacher(kdtId, teacherUpdateCommand) {
    return this.invoke('updateTeacher', [kdtId, teacherUpdateCommand]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/889363
   *
   *  @param {number} kdtId -
   *  @param {Object} operatorPlayBackCommand -
   *  @param {number} operatorPlayBackCommand.openBack - 开启回放 0: 否；1: 开
   *  @param {string} operatorPlayBackCommand.alias -
   *  @return {Promise}
   */
  async operatorPlaybackWithStatus(kdtId, operatorPlayBackCommand) {
    return this.invoke('operatorPlaybackWithStatus', [kdtId, operatorPlayBackCommand]);
  }

  /**
   *  查询直播概况
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/899416
   *
   *  @param {number} kdtId -
   *  @param {Object} eduLiveSurveyQuery -
   *  @param {string} eduLiveSurveyQuery.alias - 商品别名
   *  @return {Promise}
   */
  async getLiveSurvey(kdtId, eduLiveSurveyQuery) {
    return this.invoke('getLiveSurvey', [kdtId, eduLiveSurveyQuery]);
  }

  /**
   *  查询数据趋势
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/899417
   *
   *  @param {number} kdtId -
   *  @param {Object} eduLiveDateTrendQuery -
   *  @param {string} eduLiveDateTrendQuery.endDate - 结束时间
   *  @param {string} eduLiveDateTrendQuery.alias - 商品别名
   *  @param {string} eduLiveDateTrendQuery.startDate - 开始时间
   *  @return {Promise}
   */
  async listDateTrend(kdtId, eduLiveDateTrendQuery) {
    return this.invoke('listDateTrend', [kdtId, eduLiveDateTrendQuery]);
  }

  /**
   *  查询学习明细
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/899418
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} eduLiveDetailQuery -
   *  @param {string} eduLiveDetailQuery.alias - 商品别名
   *  @param {string} eduLiveDetailQuery.keyword - 手机号或客户名称
   *  @return {Promise}
   */
  async listWatchDetail(kdtId, pageRequest, eduLiveDetailQuery) {
    return this.invoke('listWatchDetail', [
      kdtId,
      pageRequest,
      eduLiveDetailQuery
    ]);
  }

  /**
   *  导出直播详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/906189
   *
   *  @param {number} kdtId -
   *  @param {Object} liveDetailCommand -
   *  @param {number} liveDetailCommand.fansId - 粉丝id
   *  @param {string} liveDetailCommand.nickName - 用户名称
   *  @param {string} liveDetailCommand.clientIp - 客户端ip
   *  @param {string} liveDetailCommand.mobile - 用户手机号
   *  @param {string} liveDetailCommand.alias - 商品别名
   *  @param {string} liveDetailCommand.source - 操作来源
   *  @param {string} liveDetailCommand.keyword - 手机号或客户名
   *  @param {number} liveDetailCommand.userId - 用户id
   *  @param {number} liveDetailCommand.fansType - 粉丝type
   *  @return {Promise}
   */
  async exportLiveDetail(kdtId, liveDetailCommand) {
    return this.invoke('exportLiveDetail', [kdtId, liveDetailCommand]);
  }

  /**
   *  直播间打赏查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/903081
   *
   *  @param {number} kdtId -
   *  @param {Object} commonCommand -
   *  @param {string} commonCommand.tag - 直播来源
   *  @return {Promise}
   */
  async getLiveRewardSetting(kdtId, commonCommand) {
    return this.invoke('getLiveRewardSetting', [kdtId, commonCommand]);
  }

  /**
   *  直播间打赏配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/903082
   *
   *  @param {number} kdtId -
   *  @param {Object} rewardCommand -
   *  @param {number} rewardCommand.openReward - 打赏 0：关闭；1：开启
   *  @param {string} rewardCommand.tag - 直播来源
   *  @return {Promise}
   */
  async liveRewardSetting(kdtId, rewardCommand) {
    return this.invoke('liveRewardSetting', [kdtId, rewardCommand]);
  }
}

module.exports = EduLiveVideoFacade;
