const SelfFetchBaseService = require('./SelfFetchBaseService');
/**
 * 自提点相关
 */
class SelfFetchPointService extends SelfFetchBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.multistore.center.api.serivce.store.SelfFetchPointService';
  }
  /**
   *  根据kdtId查询零售店铺是否有自提点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/102842
   *
   *  @param {number} kdtId - 口袋通id
   *  @return {Promise}
   */
  async hasSelfFetchPoints(kdtId) {
    return this.invoke('hasSelfFetchPoints', [kdtId]);
  }
  /**
   *  微商城后台自提点列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/331844
   *
   *  @param {Object} pagedQueryDTO -
   *  @param {number} pagedQueryDTO.kdtId -
   *  @param {number} pagedQueryDTO.pageSize - 页大小
   *  @param {number} pagedQueryDTO.page - 页码
   *  @return {Promise}
   */
  async listByPage(pagedQueryDTO) {
    return this.invoke('listByPage', [pagedQueryDTO]);
  }
  /**
   *  零售店铺后台自提点列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/331843
   *
   *  @param {Object} pagedQueryDTO -
   *  @param {number} pagedQueryDTO.kdtId -
   *  @param {number} pagedQueryDTO.pageSize - 页大小
   *  @param {number} pagedQueryDTO.page - 页码
   *  @return {Promise}
   */
  async listRetailSelfFetchPoints(pagedQueryDTO) {
    return this.invoke('listRetailSelfFetchPoints', [pagedQueryDTO]);
  }
  /**
   *  查询自提点的信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/102840
   *
   *  @param {Object} queryDTO -
   *  @param {Array.<Object>} queryDTO.orderItemDTOs[] -
   *  @param {integer} queryDTO.orderItemDTOs[].goodsId -
   *  @param {integer} queryDTO.orderItemDTOs[].num -
   *  @param {integer} queryDTO.orderItemDTOs[].skuId -
   *  @param {number} queryDTO.lng - 经度
   *  @param {number} queryDTO.kdtId - 口袋通id
   *  @param {number} queryDTO.storeId - 多网点id
   *  @param {number} queryDTO.lat - 纬度
   *  @return {Promise}
   */
  async getSelfFetchPoint(queryDTO) {
    return this.invoke('getSelfFetchPoint', [queryDTO]);
  }
  /**
   *  创建自提点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/400372
   *
   *  @param {Object} createSelfFetchDTO - {@link SelfFetchOperateDTO}
   *  @param {Array.<Array>} createSelfFetchDTO.images[] - 自提点照片
   *  @param {Object} createSelfFetchDTO.address - 自提点地理位置信息
   *  @param {boolean} createSelfFetchDTO.isStore - 是否作为门店使用
   *  @param {number} createSelfFetchDTO.kdtId - 店铺id
   *  @param {Object} createSelfFetchDTO.phone - 联系方式
   *  @param {string} createSelfFetchDTO.name - 自提点名称
   *  @param {boolean} createSelfFetchDTO.isSuperStore - 是否是零售连锁自提点
   *  @param {string} createSelfFetchDTO.description - 自提点描述
   *  @param {Array.<Object>} createSelfFetchDTO.selfFetchHours[] - 自提时间段设置
   *  @param {boolean} createSelfFetchDTO.selfFetchTimeRequired - 是否需要用户自行选择自提时间
   *  @param {Object} createSelfFetchDTO.onLineBusinessSetting - 线上营业时间设置
   *  @param {Object} createSelfFetchDTO.operator - 操作人信息
   *  @return {Promise}
   */
  async create(createSelfFetchDTO) {
    return this.invoke('create', [createSelfFetchDTO]);
  }
  /**
   *  编辑自提点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/400373
   *
   *  @param {Object} updateSelfFetchDTO - {@link SelfFetchOperateDTO}
   *  @param {Array.<Array>} updateSelfFetchDTO.images[] - 自提点照片
   *  @param {Object} updateSelfFetchDTO.address - 自提点地理位置信息
   *  @param {boolean} updateSelfFetchDTO.isStore - 是否作为门店使用
   *  @param {number} updateSelfFetchDTO.kdtId - 店铺id
   *  @param {boolean} updateSelfFetchDTO.isSuperStore - 是否是零售连锁自提点
   *  @param {string} updateSelfFetchDTO.description - 自提点描述
   *  @param {Array.<Object>} updateSelfFetchDTO.selfFetchHours[] - 自提时间段设置
   *  @param {Object} updateSelfFetchDTO.onLineBusinessSetting - 线上营业时间设置
   *  @param {Object} updateSelfFetchDTO.operator - 操作人信息
   *  @param {Object} updateSelfFetchDTO.phone - 联系方式
   *  @param {string} updateSelfFetchDTO.name - 自提点名称
   *  @param {number} updateSelfFetchDTO.id - 自提点id
   *  @param {boolean} updateSelfFetchDTO.selfFetchTimeRequired - 是否需要用户自行选择自提时间
   *  @return {Promise}
   */
  async update(updateSelfFetchDTO) {
    return this.invoke('update', [updateSelfFetchDTO]);
  }
  /**
   *  删除自提点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/331853
   *
   *  @param {Object} delDTO -
   *  @param {number} delDTO.kdtId - 店铺ID
   *  @param {number} delDTO.storeId - 自提点ID
   *  @param {number} delDTO.operatorId - 操作人ID
   *  @return {Promise}
   */
  async delete(delDTO) {
    return this.invoke('delete', [delDTO]);
  }
}

module.exports = SelfFetchPointService;
