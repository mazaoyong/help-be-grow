const BaseService = require('../../../base/BaseService');
/** com.youzan.owl.ump.api.buygive.BuyGiveFacade */
class CollectZanFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.collectzan.CollectZanFacade';
  }

  /**
   * B端查询店铺下的集赞列表
   *
   * @see http://zanapi.qima-inc.com/site/service/view/278495
   * @param {number} kdtId - 店铺ID
   * @param {Object} pageRequest - 分页对象
   * @param {Object} zanQuery - 查询条件
   * @return {dobboRequest}
   * @memberof CollectZanFacade
   */
  async find(kdtId, pageRequest, zanQuery) {
    return this.invoke('find', [kdtId, pageRequest, zanQuery]);
  }

  /**
   * B端创建集赞活动
   *
   * @see http://zanapi.qima-inc.com/site/service/view/278490
   * @param {number} kdtId - 店铺ID
   * @param {Object} createCollectZanCommand - 新建活动数据
   * @return {dobboRequest}
   * @memberof CollectZanFacade
   */
  async create(kdtId, createCollectZanCommand) {
    return this.invoke('create', [kdtId, createCollectZanCommand]);
  }

  /**
   * B端更新集赞活动
   *
   * @see http://zanapi.qima-inc.com/site/service/view/278491
   * @param {number} kdtId - 店铺ID
   * @param {Object} updateCollectZanCommand - 更新活动数据
   * @return {dobboRequest}
   * @memberof CollectZanFacade
   */
  async update(kdtId, updateCollectZanCommand) {
    return this.invoke('update', [kdtId, updateCollectZanCommand]);
  }

  /**
   * B端根据id获取集赞详情
   *
   * @see http://zanapi.qima-inc.com/site/service/view/278494
   * @param {number} kdtId - 店铺ID
   * @param {number} id - 活动id
   * @return {dobboRequest}
   * @memberof CollectZanFacade
   */
  async getById(kdtId, id) {
    return this.invoke('getById', [kdtId, id]);
  }

  /**
   * B端根据id删除集赞活动
   *
   * @see http://zanapi.qima-inc.com/site/service/view/278494
   * @param {number} kdtId - 店铺ID
   * @param {number} id - 活动id
   * @return {dobboRequest}
   * @memberof CollectZanFacade
   */
  async delete(kdtId, id) {
    return this.invoke('deleteById', [kdtId, id]);
  }

  /**
   * B端根据id失效集赞活动
   *
   * @see http://zanapi.qima-inc.com/site/service/view/278494
   * @param {number} kdtId - 店铺ID
   * @param {number} id - 活动id
   * @return {dobboRequest}
   * @memberof CollectZanFacade
   */
  async invalid(kdtId, id) {
    return this.invoke('invalidById', [kdtId, id]);
  }

  /**
   *  B端创建集赞模板,支持课程商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/319709
   *
   *  @param {number} kdtId - 店铺Id
   *  @param {Object} collectZanTemplateCommand - 好友助力模板创建及编辑实体
   *  @param {number} collectZanTemplateCommand.prizeChannel - 奖励类型，0 免费领取 1 优惠券
   *  @param {number} collectZanTemplateCommand.collectNum - 需要的集赞个数
   *  @param {number} collectZanTemplateCommand.prizeNum - 奖励品数量
   *  @param {number} collectZanTemplateCommand.id - 活动模板id
   *  @param {string} collectZanTemplateCommand.title - 活动标题
   *  @param {string} collectZanTemplateCommand.endAt - 结束时间，yyyy-MM-dd HH:mm:ss
   *  @param {string} collectZanTemplateCommand.startAt - 开始时间，yyyy-MM-dd HH:mm:ss
   *  @param {Array.<Object>} collectZanTemplateCommand.productList[] - 参加活动的商品
   *  @param {number} collectZanTemplateCommand.prizeId - 奖励品id
   *  @return {Promise}
   */
  async createTemplate(kdtId, collectZanTemplateCommand) {
    return this.invoke('createTemplate', [kdtId, collectZanTemplateCommand]);
  }

  /**
   *  更新好友助力模板
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/319710
   *
   *  @param {number} kdtId - 店铺Id
   *  @param {Object} collectZanTemplateCommand - 好友助力模板创建及编辑实体
   *  @param {number} collectZanTemplateCommand.prizeChannel - 奖励类型，0 免费领取 1 优惠券
   *  @param {number} collectZanTemplateCommand.collectNum - 需要的集赞个数
   *  @param {number} collectZanTemplateCommand.prizeNum - 奖励品数量
   *  @param {number} collectZanTemplateCommand.id - 活动模板id
   *  @param {string} collectZanTemplateCommand.title - 活动标题
   *  @param {string} collectZanTemplateCommand.endAt - 结束时间，yyyy-MM-dd HH:mm:ss
   *  @param {string} collectZanTemplateCommand.startAt - 开始时间，yyyy-MM-dd HH:mm:ss
   *  @param {Array.<Object>} collectZanTemplateCommand.productList[] - 参加活动的商品
   *  @param {number} collectZanTemplateCommand.prizeId - 奖励品id
   *  @return {Promise}
   */
  async updateTemplate(kdtId, collectZanTemplateCommand) {
    return this.invoke('updateTemplate', [kdtId, collectZanTemplateCommand]);
  }
}

module.exports = CollectZanFacade;
