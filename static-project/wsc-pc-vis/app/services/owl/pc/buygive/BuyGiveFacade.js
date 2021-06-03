const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.buygive.BuyGiveFacade -  */
class BuyGiveFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.buygive.BuyGiveFacade';
  }

  /**
   *  根据ID获取买赠的活动信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509446
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async getDetailById(kdtId, id) {
    return this.invoke('getDetailById', [kdtId, id]);
  }

  /**
   *  新增买赠活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509443
   *
   *  @param {number} kdtId -
   *  @param {Object} saveCommand -
   *  @param {Array.<Object>} saveCommand.preferentialDataList[] - 优惠请求信息
   *  @param {number} saveCommand.applicableCampusType - 是否选中所有店铺适用，枚举值: (0,部分校区适用)，(1,全部校区) {@link //com.youzan.owl.ump.enums.ApplicableCampusTypeEnum}
   *  @param {string} saveCommand.rangeType - 参与活动商品范围（all全部商品，part部分商品）
   *  @param {string} saveCommand.name - 活动名称
   *  @param {string} saveCommand.startTime - 活动开始时间 yyyy-MM-dd HH:mm:ss
   *  @param {Object} saveCommand.configInfo - 买赠配置信息
   *  @param {number} saveCommand.id - 活动id
   *  @param {string} saveCommand.endTime - 活动结束时间 yyyy-MM-dd HH:mm:ss
   *  @param {Array.<Object>} saveCommand.goodsItemList[] - 参与活动的商品信息
   *  @param {Array.<Array>} saveCommand.applicableCampusKdtIds[] - 选中的校区集合
   *  @return {Promise}
   */
  async create(kdtId, saveCommand) {
    return this.invoke('create', [kdtId, saveCommand]);
  }

  /**
   *  编辑买赠活动
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509444
   *
   *  @param {number} kdtId -
   *  @param {Object} editCommand -
   *  @param {Array.<Object>} editCommand.preferentialDataList[] - 优惠请求信息
   *  @param {number} editCommand.applicableCampusType - 是否选中所有店铺适用，枚举值: (0,部分校区适用)，(1,全部校区) {@link //com.youzan.owl.ump.enums.ApplicableCampusTypeEnum}
   *  @param {string} editCommand.rangeType - 参与活动商品范围（all全部商品，part部分商品）
   *  @param {string} editCommand.name - 活动名称
   *  @param {string} editCommand.startTime - 活动开始时间 yyyy-MM-dd HH:mm:ss
   *  @param {Object} editCommand.configInfo - 买赠配置信息
   *  @param {number} editCommand.id - 活动id
   *  @param {string} editCommand.endTime - 活动结束时间 yyyy-MM-dd HH:mm:ss
   *  @param {Array.<Object>} editCommand.goodsItemList[] - 参与活动的商品信息
   *  @param {Array.<Array>} editCommand.applicableCampusKdtIds[] - 选中的校区集合
   *  @return {Promise}
   */
  async update(kdtId, editCommand) {
    return this.invoke('update', [kdtId, editCommand]);
  }

  /**
   *  根据ID使活动失效
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/523506
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @param {number} userId -
   *  @return {Promise}
   */
  async invalid(kdtId, id, userId) {
    return this.invoke('invalid', [kdtId, id, userId]);
  }
}

module.exports = BuyGiveFacade;
