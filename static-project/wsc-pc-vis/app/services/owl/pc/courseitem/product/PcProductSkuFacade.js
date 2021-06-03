const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.pc.api.courseitem.product.PcProductSkuFacade -  */
class PcProductSkuFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.courseitem.product.PcProductSkuFacade';
  }

  /**
   *  查询商品规格名列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532028
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async findSkuPropNames(kdtId) {
    return this.invoke('findSkuPropNames', [kdtId]);
  }

  /**
   *  获取商品规格值列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532029
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async findSkuPropValues(kdtId, pcSkuListQueryDTO) {
    return this.invoke('findSkuPropValues', [kdtId, pcSkuListQueryDTO]);
  }

  /**
   *  添加商品规格值value
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532030
   *
   *  @param {number} kdtId -
   *  @param {Object} pcSkuCreateCommand -
   *  @param {number} pcSkuCreateCommand.dictId - 商品规格key字典 创建规格名时该字段为空，创建规格值时该字段为所属规格名的id
   *  @param {string} pcSkuCreateCommand.text - 文本信息
   *  @return {Promise}
   */
  async createSkuPropVal(kdtId, pcSkuCreateCommand) {
    return this.invoke('createSkuPropVal', [kdtId, pcSkuCreateCommand]);
  }

  /**
   *  新增店铺商品规格key
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532031
   *
   *  @param {number} kdtId -
   *  @param {Object} pcSkuCreateCommand -
   *  @param {number} pcSkuCreateCommand.dictId - 商品规格key字典 创建规格名时该字段为空，创建规格值时该字段为所属规格名的id
   *  @param {string} pcSkuCreateCommand.text - 文本信息
   *  @return {Promise}
   */
  async createSkuPropName(kdtId, pcSkuCreateCommand) {
    return this.invoke('createSkuPropName', [kdtId, pcSkuCreateCommand]);
  }
}

module.exports = PcProductSkuFacade;
