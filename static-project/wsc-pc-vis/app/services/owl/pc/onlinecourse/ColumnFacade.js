const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.onlinecourse.ColumnFacade -  */
class ColumnFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.ColumnFacade';
  }

  /**
   *  修改专栏更新状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467685
   *
   *  @param {number} kdtId -
   *  @param {Object} serializedCommand -
   *  @param {number} serializedCommand.fansId - 粉丝id
   *  @param {number} serializedCommand.isStop - 是否开启更新，1:停止更新，0:继续更新
   *  @param {string} serializedCommand.nickName - 用户名称
   *  @param {string} serializedCommand.mobile - 用户手机号
   *  @param {string} serializedCommand.alias - 专栏别名
   *  @param {string} serializedCommand.source - 操作来源
   *  @param {number} serializedCommand.userId - 用户id
   *  @param {number} serializedCommand.fansType - 粉丝type
   *  @return {Promise}
   */
  async updateSerializedStatus(kdtId, serializedCommand) {
    return this.invoke('updateSerializedStatus', [kdtId, serializedCommand]);
  }

  /**
   *  修改专栏是否上架状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467686
   *
   *  @param {number} kdtId -
   *  @param {Object} onSaleCommand -
   *  @param {number} onSaleCommand.fansId - 粉丝id
   *  @param {string} onSaleCommand.nickName - 用户名称
   *  @param {string} onSaleCommand.mobile - 用户手机号
   *  @param {string} onSaleCommand.alias - 专栏别名
   *  @param {string} onSaleCommand.source - 操作来源
   *  @param {number} onSaleCommand.isOnSale - 是否上架，2:下架，1:上架
   *  @param {number} onSaleCommand.userId - 用户id
   *  @param {number} onSaleCommand.fansType - 粉丝type
   *  @return {Promise}
   */
  async updateOnSaleStatus(kdtId, onSaleCommand) {
    return this.invoke('updateOnSaleStatus', [kdtId, onSaleCommand]);
  }

  /**
    *  创建专栏商品
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467529
    *
    *  @param {number} kdtId -
    *  @param {Object} columnCommand -
    *  @param {string} columnCommand.summary - 简介
    *  @param {string} columnCommand.collectInfoSetting - 信息采集字段
    *  @param {Array.<Array>} columnCommand.benefitPkgIds[] - 选择的会员权益包列表（todo... 当前只有内容、专栏有）
    *  @param {string} columnCommand.author - 作者（todo... 直播用的字段名是lecturer，本次创建入参需要修正过来）
    *  @param {string} columnCommand.publishAt - 上架时间（todo... 直播需要将现有的publishAtStr改为publishAt，为了统一）
    *  @param {number} columnCommand.everyFriendContentCount - 分享给好友每位好友可领取内容数
    *  @param {number} columnCommand.everyContentFriendCount - 分享给好友单篇内容好友领取数
    *  @param {string} columnCommand.title - 标题
    *  @param {string} columnCommand.previewContent - 专栏详情
    *  @param {Object} columnCommand.operator - 操作人信息
      todo... 包含以下几个字段：
        Long userId;
        String mobile;
        String nickName;
        Long fansId;
        Long fansType;
        String source;
    *  @param {string} columnCommand.cover - 封面url
    *  @param {number} columnCommand.showInStore - 店铺内是否显示 1:是 0:否
    *  @param {Array.<Array>} columnCommand.distributorPics - 分销员海报（内容/专栏当前在用，直播没有使用）
    *  @param {number} columnCommand.price - 价格（分）
    *  @param {string} columnCommand.pictureDTO - 图片
      todo... 前端需要改下字段名
      attachment_id -> picId
      height -> picHeight
      width -> picWidth
      attachment_full_url -> cover
    *  @param {string} columnCommand.joinGroupSetting - 拉群信息（内容/专栏当前在用，直播没有使用）
    *  @param {string} columnCommand.alias - 别名
    *  @param {number} columnCommand.joinLevelDiscount - 是否加入会员折扣（todo... 当前只有内容、专栏有）
    *  @param {number} columnCommand.id - 自增ID（todo... 直播id之前是liveId，本次改造需要统一修改为id）
    *  @param {number} columnCommand.isShared - 是否分享给好友 0 否 1 是
    *  @param {number} columnCommand.status - 开售设置 0:删除  1:上架   2:下架  3:暂存  4:定时上架
    *  @return {Promise}
    */
  async createColumn(kdtId, columnCommand) {
    return this.invoke('createColumn', [kdtId, columnCommand]);
  }

  /**
    *  更新专栏商品
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467530
    *
    *  @param {number} kdtId -
    *  @param {Object} columnCommand -
    *  @param {string} columnCommand.summary - 简介
    *  @param {string} columnCommand.collectInfoSetting - 信息采集字段
    *  @param {Array.<Array>} columnCommand.benefitPkgIds[] - 选择的会员权益包列表（todo... 当前只有内容、专栏有）
    *  @param {string} columnCommand.author - 作者（todo... 直播用的字段名是lecturer，本次创建入参需要修正过来）
    *  @param {string} columnCommand.publishAt - 上架时间（todo... 直播需要将现有的publishAtStr改为publishAt，为了统一）
    *  @param {number} columnCommand.everyFriendContentCount - 分享给好友每位好友可领取内容数
    *  @param {number} columnCommand.everyContentFriendCount - 分享给好友单篇内容好友领取数
    *  @param {string} columnCommand.title - 标题
    *  @param {string} columnCommand.previewContent - 专栏详情
    *  @param {Object} columnCommand.operator - 操作人信息
    todo... 包含以下几个字段：
      Long userId;
      String mobile;
      String nickName;
      Long fansId;
      Long fansType;
      String source;
    *  @param {string} columnCommand.cover - 封面url
    *  @param {number} columnCommand.showInStore - 店铺内是否显示 1:是 0:否
    *  @param {Array.<Array>} columnCommand.distributorPics - 分销员海报（内容/专栏当前在用，直播没有使用）
    *  @param {number} columnCommand.price - 价格（分）
    *  @param {string} columnCommand.pictureDTO - 图片
      todo... 前端需要改下字段名
      attachment_id -> picId
      height -> picHeight
      width -> picWidth
      attachment_full_url -> cover
    *  @param {string} columnCommand.joinGroupSetting - 拉群信息（内容/专栏当前在用，直播没有使用）
    *  @param {string} columnCommand.alias - 别名
    *  @param {number} columnCommand.joinLevelDiscount - 是否加入会员折扣（todo... 当前只有内容、专栏有）
    *  @param {number} columnCommand.id - 自增ID（todo... 直播id之前是liveId，本次改造需要统一修改为id）
    *  @param {number} columnCommand.isShared - 是否分享给好友 0 否 1 是
    *  @param {number} columnCommand.status - 开售设置 0:删除  1:上架   2:下架  3:暂存  4:定时上架
    *  @return {Promise}
  */
  async updateColumn(kdtId, columnCommand) {
    return this.invoke('updateColumn', [kdtId, columnCommand]);
  }

  /**
   *  按照条件查询相关的专栏商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467532
   *
   *  @param {number} kdtId -
   *  @param {Object} pcColumnSearchCommand -
   *  @param {number} pcColumnSearchCommand.columnType -
   *  @param {number} pcColumnSearchCommand.showInStore - 店铺内是否显示 1:是 0:否
   *  @param {string} pcColumnSearchCommand.title -
   *  @param {number} pcColumnSearchCommand.isUpdate -
   *  @param {number} pcColumnSearchCommand.status -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageByCondition(kdtId, pcColumnSearchCommand, pageRequest) {
    return this.invoke('findPageByCondition', [
      kdtId,
      pcColumnSearchCommand,
      pageRequest,
    ]);
  }

  /**
   *  删除专栏商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467531
   *
   *  @param {number} kdtId -
   *  @param {Object} pcDeleteCommand -
   *  @param {string} pcDeleteCommand.alias - 商品别名
   *  @param {Object} pcDeleteCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async deleteColumn(kdtId, pcDeleteCommand) {
    return this.invoke('deleteColumn', [kdtId, pcDeleteCommand]);
  }

  /**
   *  更新专栏排序值
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467534
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
   *  获取专栏详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467533
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getByAlias(kdtId, alias) {
    return this.invoke('getByAlias', [kdtId, alias]);
  }

  /**
  *  更新专栏显示/隐藏状态
    如果专栏当前是显示状态，执行此接口，变更为隐藏，否则，变更为显示
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467535
  *
  *  @param {number} kdtId -
  *  @param {Object} pcShowHideCommand -
  *  @param {number} pcShowHideCommand.fansId - 粉丝id
  *  @param {string} pcShowHideCommand.nickName - 用户名称
  *  @param {string} pcShowHideCommand.mobile - 用户手机号
  *  @param {string} pcShowHideCommand.alias - 商品别名
  *  @param {string} pcShowHideCommand.source - 操作来源
  *  @param {number} pcShowHideCommand.userId - 用户id
  *  @param {number} pcShowHideCommand.fansType - 粉丝type
  *  @return {Promise}
  */
  async updateShowOrHideStatus(kdtId, pcShowHideCommand) {
    return this.invoke('updateShowOrHideStatus', [kdtId, pcShowHideCommand]);
  }

  /**
   *  复制专栏
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467537
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async copy(kdtId, alias) {
    return this.invoke('copy', [kdtId, alias]);
  }

  /**
   *  更新专栏请好友看状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467536
   *
   *  @param {number} kdtId -
   *  @param {Object} shareCommand -
   *  @param {number} shareCommand.fansId - 粉丝id
   *  @param {string} shareCommand.nickName - 用户名称
   *  @param {string} shareCommand.mobile - 用户手机号
   *  @param {string} shareCommand.alias - 商品别名
   *  @param {number} shareCommand.everyFriendContentCount - 分享给好友每位好友可领取内容数
   *  @param {string} shareCommand.source - 操作来源
   *  @param {number} shareCommand.everyContentFriendCount - 分享给好友单篇内容好友领取数
   *  @param {number} shareCommand.userId - 用户id
   *  @param {number} shareCommand.isShared - 是否分享给好友 0 否 1 是
   *  @param {number} shareCommand.fansType - 粉丝type
   *  @return {Promise}
   */
  async updateShareStatus(kdtId, shareCommand) {
    return this.invoke('updateShareStatus', [kdtId, shareCommand]);
  }

  /**
   *  快捷修改专栏商品规格相关信息 (标题和价格)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/493419
   *
   *  @param {number} kdtId -
   *  @param {Object} columnQuickUpdateCommand -
   *  @param {number} columnQuickUpdateCommand.price - 价格
   *  @param {string} columnQuickUpdateCommand.title - 标题
   *  @param {Object} columnQuickUpdateCommand.operator -
   *  @param {string} columnQuickUpdateCommand.productAlias - 商品alias
   *  @return {Promise}
   */
  async quickUpdateColumnByAlias(kdtId, columnQuickUpdateCommand) {
    return this.invoke('quickUpdateColumnByAlias', [
      kdtId,
      columnQuickUpdateCommand,
    ]);
  }

  /**
   *  获取专栏订阅数
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/507119
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getColumnSubscriptionCount(kdtId, alias) {
    return this.invoke('getColumnSubscriptionCount', [kdtId, alias]);
  }

  /**
   *  课程提醒通知调用接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/592784
   *
   *  @param {number} kdtId -
   *  @param {Object} courseNoticeCommand - 是否需要通知请求
   *  @param {string} courseNoticeCommand.columnAlias - 专栏别名
   *  @param {boolean} courseNoticeCommand.needNotice - 是否需要通知
   *  @param {Array.<Object>} courseNoticeCommand.contentAliases[] - 内容别名列表
   *  @param {integer} courseNoticeCommand.contentAliases[].mediaType - 内容类型 1:图文  2:音频 3:视频 4:直播
   *  @param {string} courseNoticeCommand.contentAliases[].contentAlias - 内容别名
   *  @return {Promise}
   */
  async courseNotice(kdtId, courseNoticeCommand) {
    return this.invoke('courseNotice', [kdtId, courseNoticeCommand]);
  }

  /**
   *  B端专栏列表（分销专栏下的感叹号），忽略分销专栏的一个异常
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/786207
   *
   *  @param {number} kdtId -
   *  @param {Object} sellerColumnUpdateDTO - 是否需要通知请求
   *  @param {string} sellerColumnUpdateDTO.alias - 别名
   *  @param {boolean} sellerColumnUpdateDTO.overlookState - 是否需要忽略删除/下架异常
   *  @param {boolean} sellerColumnUpdateDTO.overlookPrice - 是否忽略价格异常
   *  @return {Promise}
   */
  async updateOverLookSingleColumn(kdtId, sellerColumnUpdateDTO) {
    return this.invoke('updateOverLookSingleColumn', [kdtId, sellerColumnUpdateDTO]);
  }

  /**
   *  知识付费->专栏列表->忽略该消息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/786208
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async updateOverLookAllColumns(kdtId) {
    return this.invoke('updateOverLookAllColumns', [kdtId]);
  }

  /**
   *  知识付费->统计有异常信息的专栏的数量
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/786209
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async getColumnWarningCount(kdtId) {
    return this.invoke('getColumnWarningCount', [kdtId]);
  }
}

module.exports = ColumnFacade;
