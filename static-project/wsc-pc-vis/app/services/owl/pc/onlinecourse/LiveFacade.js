const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.onlinecourse.LiveFacade -  */
class LiveFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.LiveFacade';
  }

  /**
             *  pc端分页查询直播列表
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471553
*
             *  @param {number} kdtId -
             *  @param {Object} query -
             *  @param {number} query.showInStore - 店铺中是否显示 1：是 0：否
             *  @param {number} query.sellStatus - 售卖状态 0: 全部 1：上架 2：下架
             *  @param {Array.<Array>} query.aliasList[] - 直播别名列表
             *  @param {Array.<Array>} query.ids[] - 直播id列表
             *  @param {number} query.sellerType - 售卖方式
   null 全部
   1    单独售卖
   2    专栏售卖
   3    可单独售卖也可以专栏售卖
             *  @param {string} query.title - 直播名称
             *  @param {number} query.liveStatus - 直播状态 0：删除  1:未开始 2：进行中 3：已结束
             *  @param {Object} pageRequest -
             *  @param {number} pageRequest.pageNumber -
             *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
             *  @param {number} pageRequest.pageSize -
             *  @param {Object} pageRequest.sort -
             *  @return {Promise}
             */
  async findPageByCondition(kdtId, query, pageRequest) {
    return this.invoke('findPageByCondition', [kdtId, query, pageRequest]);
  }

  /**
  *  创建直播商品
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471545
  *
  *  @param {number} kdtId -
  *  @param {Object} liveCommand -
  *  @param {number} liveCommand.openPureRtc - 是否开启无延迟  0 否  1是
  *  @param {Array.<Array>} liveCommand.benefitPkgIds[] - 选择的会员权益包列表
  *  @param {number} liveCommand.liveType - 直播形式 1:语音图文直播  2:PPT课件+语音图文直播  3:视频课件+语音图文直播 4:保利威直播 5: 有赞视频直播
  *  @param {string} liveCommand.origin - 划线价
  *  @param {string} liveCommand.courseCode - 课程编码
  *  @param {string} liveCommand.liveStartAt - 直播开始时间
  *  @param {string} liveCommand.title - 标题
  *  @param {string} liveCommand.columnAlias - 专栏别名
  *  @param {Object} liveCommand.operator - 操作人信息
 todo... 包含以下几个字段：
  Long userId;
  String mobile;
  String nickName;
  Long fansId;
  Long fansType;
  String source;
  *  @param {string} liveCommand.cover - 封面url
  *  @param {number} liveCommand.connectionNumber - 连线人数
  *  @param {number} liveCommand.price - 价格（分）
  *  @param {number} liveCommand.liveDuration - 直播时长
  *  @param {Array.<Array>} liveCommand.groupIds - 分组id列表
  *  @param {string} liveCommand.alias - 别名
  *  @param {number} liveCommand.joinLevelDiscount - 是否加入会员折扣
  *  @param {number} liveCommand.id - 自增ID（todo... 直播id之前是liveId，本次改造需要统一修改为id）
  *  @param {string} liveCommand.channelId - 保利威频道id
  *  @param {string} liveCommand.summary - 简介
  *  @param {Object} liveCommand.collectInfoSetting - 信息采集字段
  *  @param {number} liveCommand.openConnection - 开启课堂连线
  *  @param {string} liveCommand.publishAt - 上架时间（todo... 直播需要将现有的publishAtStr改为publishAt，为了统一）
  *  @param {string} liveCommand.lecturer - 讲师
  *  @param {number} liveCommand.autoOpenPlayback - 自动开启回放: 0 关闭 1开启
  *  @param {number} liveCommand.autoCloseLive - 自动关闭直播: 0 关闭 1开启
  *  @param {number} liveCommand.showInStore - 店铺内是否显示 1:是 0:否
  *  @param {number} liveCommand.sellTimeType - 开售时间类型 1：立即上架 2：定时上架 3：暂存
  *  @param {number} liveCommand.liveScene - 直播场景
  *  @param {Array.<Array>} liveCommand.distributorPics - 分销员海报（内容/专栏当前在用，直播没有使用）
  *  @param {Object} liveCommand.joinGroupSetting - 拉群信息（内容/专栏当前在用，直播没有使用）
  *  @param {string} liveCommand.detail - 直播详情
  *  @param {number} liveCommand.sellerType - 销售模式 1：单独售卖 2:专栏售卖
  *  @return {Promise}
  */
  async createLive(kdtId, liveCommand) {
    return this.invoke('createLive', [kdtId, liveCommand]);
  }

  /**
             *  更新直播商品
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471546
*
             *  @param {number} kdtId -
             *  @param {Object} liveCommand -
             *  @param {string} liveCommand.summary - 简介
             *  @param {Object} liveCommand.collectInfoSetting - 信息采集字段
             *  @param {Array.<Array>} liveCommand.benefitPkgIds[] - 选择的会员权益包列表（todo... 当前只有内容、专栏有）
             *  @param {string} liveCommand.author - 作者（todo... 直播用的字段名是lecturer，本次创建入参需要修正过来）
             *  @param {string} liveCommand.publishAt - 上架时间（todo... 直播需要将现有的publishAtStr改为publishAt，为了统一）
             *  @param {number} liveCommand.everyFriendContentCount - 分享给好友每位好友可领取内容数
             *  @param {number} liveCommand.everyContentFriendCount - 分享给好友单篇内容好友领取数
             *  @param {string} liveCommand.title - 标题
             *  @param {string} liveCommand.previewContent - 专栏详情
             *  @param {Object} liveCommand.operator - 操作人信息
 todo... 包含以下几个字段：
  Long userId;
  String mobile;
  String nickName;
  Long fansId;
  Long fansType;
  String source;
             *  @param {string} liveCommand.cover - 封面url
             *  @param {number} liveCommand.showInStore - 店铺内是否显示 1:是 0:否
             *  @param {Array.<Array>} liveCommand.distributorPics - 分销员海报（内容/专栏当前在用，直播没有使用）
             *  @param {number} liveCommand.price - 价格（分）
             *  @param {Object} liveCommand.pictureDTO - 图片
             *  @param {Object} liveCommand.joinGroupSetting - 拉群信息（内容/专栏当前在用，直播没有使用）
             *  @param {string} liveCommand.alias - 别名
             *  @param {number} liveCommand.joinLevelDiscount - 是否加入会员折扣（todo... 当前只有内容、专栏有）
             *  @param {number} liveCommand.id - 自增ID（todo... 直播id之前是liveId，本次改造需要统一修改为id）
             *  @param {number} liveCommand.isShared - 是否分享给好友 0 否 1 是
             *  @param {number} liveCommand.status - 开售设置 0:删除  1:上架   2:下架  3:暂存  4:定时上架
             *  @return {Promise}
             */
  async updateLive(kdtId, liveCommand) {
    return this.invoke('updateLive', [kdtId, liveCommand]);
  }

  /**
   *  删除直播商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471547
   *
   *  @param {number} kdtId -
   *  @param {Object} pcDeleteCommand -
   *  @param {string} pcDeleteCommand.alias - 商品别名
   *  @param {Object} pcDeleteCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async deleteLive(kdtId, pcDeleteCommand) {
    return this.invoke('deleteLive', [kdtId, pcDeleteCommand]);
  }

  /**
   *  更新直播排序值
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471548
   *
   *  @param {number} kdtId -
   *  @param {Object} pcSerialNoCommand -
   *  @param {string} pcSerialNoCommand.alias - 商品别名
   *  @param {Object} pcSerialNoCommand.operator - 操作人信息
   *  @param {number} pcSerialNoCommand.serialNo - 排序值
   *  @return {Promise}
   */
  async updateSerialNo(kdtId, pcSerialNoCommand) {
    return this.invoke('updateSerialNo', [kdtId, pcSerialNoCommand]);
  }

  /**
             *  更新显示/隐藏状态
 如果当前是显示状态，执行此接口，变更为隐藏，否则，变更为显示
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471549
*
             *  @param {number} kdtId -
             *  @param {Object} pcShowHideCommand -
             *  @param {string} pcShowHideCommand.alias - 商品别名
             *  @param {Object} pcShowHideCommand.operator - 操作人信息
             *  @return {Promise}
             */
  async updateShowOrHideStatus(kdtId, pcShowHideCommand) {
    return this.invoke('updateShowOrHideStatus', [kdtId, pcShowHideCommand]);
  }

  /**
   *  直播设置免费
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471551
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.alias - 商品别名
   *  @param {Object} command.operator - 操作人信息
   *  @return {Promise}
   */
  async updateFreeLive(kdtId, command) {
    return this.invoke('updateFreeLive', [kdtId, command]);
  }

  /**
   *  获取直播商详
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471552
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getByAlias(kdtId, alias) {
    return this.invoke('getByAlias', [kdtId, alias]);
  }

  /**
   *  结束直播
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471550
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.alias - 商品别名
   *  @param {Object} command.operator - 操作人信息
   *  @return {Promise}
   */
  async updateCloseLive(kdtId, command) {
    return this.invoke('updateCloseLive', [kdtId, command]);
  }

  /**
   *  获取直播管理员邀请码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/484772
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.alias - 商品别名
   *  @param {Object} command.operator - 操作人信息
   *  @return {Promise}
   */
  async getLiveInviteAdminCode(kdtId, command) {
    return this.invoke('getLiveInviteAdminCode', [kdtId, command]);
  }

  /**
   *  快捷修改直播商品规格相关信息 (标题和价格)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/493431
   *
   *  @param {number} kdtId -
   *  @param {Object} liveQuickUpdateCommand -
   *  @param {number} liveQuickUpdateCommand.price - 价格
   *  @param {string} liveQuickUpdateCommand.title - 标题
   *  @param {Object} liveQuickUpdateCommand.operator -
   *  @param {string} liveQuickUpdateCommand.productAlias - 商品alias
   *  @return {Promise}
   */
  async quickUpdateLiveByAlias(kdtId, liveQuickUpdateCommand) {
    return this.invoke('quickUpdateLiveByAlias', [
      kdtId,
      liveQuickUpdateCommand,
    ]);
  }

  /**
   *  获取直播订阅数
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getLiveSubscriptionCount(kdtId, alias) {
    return this.invoke('getLiveSubscriptionCount', [kdtId, alias]);
  }
}

module.exports = LiveFacade;
