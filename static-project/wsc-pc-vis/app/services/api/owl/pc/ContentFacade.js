const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.onlinecourse.ContentFacade -  */
class ContentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.ContentFacade';
  }

  /**
   *  查询内容列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499543
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 查询条件
   *  @param {number} query.kdtId - 店铺Id
   *  @param {number} query.groupId - 课程分组id -1 代表查询全部
   *  @param {number} query.mediaType - 内容类型 0:全部 1:图文内容 2:音频内容 3:视频内容
   *  @param {string} query.title - 标题
   *  @param {number} query.sellerType - 售卖方式 0:全部 1:单独售卖 2:专栏售卖 3:可单独售卖也可以专栏售卖
   *  @param {number} query.contentStatus - 上下架状态 0: 全部 1:上架 对应 1 (1 上架)  2:下架 对应 2,3,4 (2 下架 3暂存 4定时上架)
   *  @param {Object} pageRequest - 分页请求
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
   *  商户端-获取内容详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499544
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {string} alias - 商品alias
   *  @return {Promise}
   */
  async getByAlias(kdtId, alias) {
    return this.invoke('getByAlias', [kdtId, alias]);
  }

  /**
   *  商户端-创建内容
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499545
   *
   *  @param {number} kdtId -
   *  @param {Object} createContentCommand -
   *  @param {Array.<Array>} createContentCommand.benefitPkgIds[] - 选择的会员权益包列表（todo... 当前只有内容、专栏有）
   *  @param {number} createContentCommand.columnSerialNo - 专栏下内容的序号
   *  @param {string} createContentCommand.title - 标题
   *  @param {string} createContentCommand.columnAlias - 专栏别名
   *  @param {Object} createContentCommand.operator - 操作人信息 todo... 包含以下几个字段： Long userId; String mobile; String nickName; Long fansId; Long fansType; String source;
   *  @param {string} createContentCommand.cover - 封面url
   *  @param {number} createContentCommand.assistTxtType - 辅助图文类型
   *  @param {number} createContentCommand.price - 价格（分）
   *  @param {Object} createContentCommand.audioContentDTO - 音频信息
   *  @param {Array.<Array>} createContentCommand.groupIds[] - 分组id列表
   *  @param {string} createContentCommand.alias - 别名
   *  @param {number} createContentCommand.joinLevelDiscount - 是否加入会员折扣（todo... 当前只有内容、专栏有）
   *  @param {number} createContentCommand.id - 自增ID（todo... 直播id之前是liveId，本次改造需要统一修改为id）
   *  @param {Object} createContentCommand.textContentDTO - 文本信息
   *  @param {Object} createContentCommand.videoContentDTO - 视频信息
   *  @param {string} createContentCommand.summary - 简介
   *  @param {Object} createContentCommand.collectInfoSetting - 信息采集字段
   *  @param {string} createContentCommand.author - 作者
   *  @param {string} createContentCommand.publishAt - 上架时间（todo... 直播需要将现有的publishAtStr改为publishAt，为了统一）
   *  @param {number} createContentCommand.mediaType - 内容类型 1:图文内容 2:音频内容 3:视频内容 4:直播内容
   *  @param {number} createContentCommand.serialNo - 序号
   *  @param {number} createContentCommand.showInStore - 店铺内是否显示 1:是 0:否
   *  @param {Array.<Array>} createContentCommand.distributorPics - 分销员海报（内容/专栏当前在用，直播没有使用）
   *  @param {Object} createContentCommand.pictureDTO - 图片
   *  @param {Object} createContentCommand.joinGroupSetting - 拉群信息（内容/专栏当前在用，直播没有使用）
   *  @param {number} createContentCommand.copyPicture - 是否允许复制图片 1：允许复制 0：不允许复制
   *  @param {number} createContentCommand.sellerType - 销售模式 1:单独售卖 2:专栏售卖 3:可单独售卖也可以专栏售卖
   *  @param {number} createContentCommand.status - 开售设置 0:删除  1:上架   2:下架  3:暂存  4:定时上架
   *  @return {Promise}
  */
  async createContent(kdtId, createContentCommand) {
    return this.invoke('createContent', [kdtId, createContentCommand]);
  }

  /**
   *  商户端-更新内容
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499546
   *
   *  @param {number} kdtId -
   *  @param {Object} createContentCommand -
   *  @param {Array.<Array>} createContentCommand.benefitPkgIds[] - 选择的会员权益包列表（todo... 当前只有内容、专栏有）
   *  @param {number} createContentCommand.columnSerialNo - 专栏下内容的序号
   *  @param {string} createContentCommand.title - 标题
   *  @param {string} createContentCommand.columnAlias - 专栏别名
   *  @param {Object} createContentCommand.operator - 操作人信息 todo... 包含以下几个字段：Long userId; String mobile; String nickName; Long fansId; Long fansType; String source;
   *  @param {string} createContentCommand.cover - 封面url
   *  @param {number} createContentCommand.assistTxtType - 辅助图文类型
   *  @param {number} createContentCommand.price - 价格（分）
   *  @param {Object} createContentCommand.audioContentDTO - 音频信息
   *  @param {Array.<Array>} createContentCommand.groupIds[] - 分组id列表
   *  @param {string} createContentCommand.alias - 别名
   *  @param {number} createContentCommand.joinLevelDiscount - 是否加入会员折扣（todo... 当前只有内容、专栏有）
   *  @param {number} createContentCommand.id - 自增ID（todo... 直播id之前是liveId，本次改造需要统一修改为id）
   *  @param {Object} createContentCommand.textContentDTO - 文本信息
   *  @param {Object} createContentCommand.videoContentDTO - 视频信息
   *  @param {string} createContentCommand.summary - 简介
   *  @param {Object} createContentCommand.collectInfoSetting - 信息采集字段
   *  @param {string} createContentCommand.author - 作者
   *  @param {string} createContentCommand.publishAt - 上架时间（todo... 直播需要将现有的publishAtStr改为publishAt，为了统一）
   *  @param {number} createContentCommand.mediaType - 内容类型 1:图文内容 2:音频内容 3:视频内容 4:直播内容
   *  @param {number} createContentCommand.serialNo - 序号
   *  @param {number} createContentCommand.showInStore - 店铺内是否显示 1:是 0:否
   *  @param {Array.<Array>} createContentCommand.distributorPics - 分销员海报（内容/专栏当前在用，直播没有使用）
   *  @param {Object} createContentCommand.pictureDTO - 图片
   *  @param {Object} createContentCommand.joinGroupSetting - 拉群信息（内容/专栏当前在用，直播没有使用）
   *  @param {number} createContentCommand.copyPicture - 是否允许复制图片 1：允许复制 0：不允许复制
   *  @param {number} createContentCommand.sellerType - 销售模式 1:单独售卖 2:专栏售卖 3:可单独售卖也可以专栏售卖
   *  @param {number} createContentCommand.status - 开售设置 0:删除  1:上架   2:下架  3:暂存  4:定时上架
   *  @return {Promise}
  */
  async updateContent(kdtId, createContentCommand) {
    return this.invoke('updateContent', [kdtId, createContentCommand]);
  }

  /**
   *  商户端-删除内容
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499547
   *
   *  @param {number} kdtId -
   *  @param {Object} pcDeleteCommand -
   *  @param {string} pcDeleteCommand.alias - 商品别名
   *  @param {Object} pcDeleteCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async deleteContent(kdtId, pcDeleteCommand) {
    return this.invoke('deleteContent', [kdtId, pcDeleteCommand]);
  }

  /**
   *  商户端-复制内容
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499775
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.alias - 商品别名
   *  @param {Object} command.operator - 操作人信息
   *  @return {Promise}
   */
  async copy(kdtId, command) {
    return this.invoke('copy', [kdtId, command]);
  }

  /**
   *  商户端-查询内容直播列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/511460
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.kdtId -
   *  @param {string} query.columnAlias - 专栏别名
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageContentWithLive(kdtId, query, pageRequest) {
    return this.invoke('findPageContentWithLive', [kdtId, query, pageRequest]);
  }

  /**
   *  更新内容上下架状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/498034
   *
   *  @param {number} kdtId -
   *  @param {Object} pcSellStatusUpdateCommand -
   *  @param {number} pcSellStatusUpdateCommand.sellStatus - 售卖状态，0:上架 1:下架
   *  @param {string} pcSellStatusUpdateCommand.alias - 内容别名
   *  @param {Object} pcSellStatusUpdateCommand.operator -
   *  @return {Promise}
   */
  async updateSellStatus(kdtId, pcSellStatusUpdateCommand) {
    return this.invoke('updateSellStatus', [kdtId, pcSellStatusUpdateCommand]);
  }

  /**
   *  更新内容免费试读状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/498035
   *
   *  @param {number} kdtId -
   *  @param {Object} pcFreeStatusUpdateCommand -
   *  @param {number} pcFreeStatusUpdateCommand.freeStatus - 是否免费试读，0:不免费 1:免费
   *  @param {string} pcFreeStatusUpdateCommand.alias -
   *  @param {Object} pcFreeStatusUpdateCommand.operator -
   *  @return {Promise}
   */
  async updateFreeStatus(kdtId, pcFreeStatusUpdateCommand) {
    return this.invoke('updateFreeStatus', [kdtId, pcFreeStatusUpdateCommand]);
  }

  /**
   *  修改线上课排序值
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/511064
   *
   *  @param {number} kdtId -
   *  @param {Object} serialNoCommand -
   *  @param {string} serialNoCommand.alias - 商品别名
   *  @param {Object} serialNoCommand.operator - 操作人信息
   *  @param {number} serialNoCommand.serialNo - 排序值
   *  @return {Promise}
   */
  async updateSerialNo(kdtId, serialNoCommand) {
    return this.invoke('updateSerialNo', [kdtId, serialNoCommand]);
  }
}

module.exports = ContentFacade;
