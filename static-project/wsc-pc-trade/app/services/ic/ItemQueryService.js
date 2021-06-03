const IcBaseService = require('./IcBaseService');

/**
 * 商品搜索相关接口
 */
class ItemQueryService extends IcBaseService {
  /**
   * SERVICE_NAME
   */
  get SERVICE_NAME() {
    return 'com.youzan.ic.service.ItemQueryService';
  }
  /**
   * 根据口袋通id和运费模板id分页查询商品列表
   * api: http://zanapi.qima-inc.com/site/service/view/114877
   * @param {*} kdtId
   * @param {*} deliveryTemplateId 运费模板id
   * @param {*} page
   * @param {*} pageSize
   */
  async getGoodsByTeamlateId(kdtId, deliveryTemplateId, page = 1, pageSize = 5) {
    return this.invoke('listSimpleByDeliveryTemplate', [
      {
        kdtId,
        deliveryTemplateId,
        page,
        pageSize,
      },
    ]);
  }

  /**
   * 批量查询商品
   * zanAPI文档地址：http://zanapi.qima-inc.com/site/service/view/18801
   * @param {Object} queryParams
   * @return {Promise<{items, total}>}
   */
  async listItemsPaged(queryParams) {
    return this.invoke('listItemsPaged', [queryParams]);
  }

  /**
   *  批量查询某些税收编码类别下的商品数量
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/114888
   *
   *  @param {object} param
   *  @param {Array.<Array>} param.taxClassCodes[] - tax_class_codes 税收分类编码列表
   *  @param {number} param.kdtId - kdt id
   *  @param {string} param.fromApp - 请求来源
   *  @param {string} param.requestId - UUID
   *  @param {number} param.MAX_CODES_SIZE -
   *  @param {number} param.MAX_CODE_LENGTH -
   *  @param {number} param.canal - 商品渠道 门店/网店 不是必传字段
   *  @param {string} param.operator - 操作人信息, ['user_id' => $userId, 'nick_name' => $nickName, 'client_ip' => $clientIp]
   *  @return {Promise<any>}
   */
  async countByTaxClassCodes(param) {
    return this.invoke('countByTaxClassCodes', [param]);
  }

  /**
   *  只返回基础的商品信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/786444
   *
   *  @param {Object} param -
   *  @param {number} param.kdtId - 店铺kdtid
   *  @param {string} param.fromApp - 请求来源
   *  @param {string} param.requestId - UUID
   *  @param {Array.<Array>} param.itemIds[] - 包含的商品id 列表
   * 一次查询数量不得大于50
   *  @param {Array} param.itemIds[] -
   *  @param {boolean} param.isNeedSlaveCreatedNormalBack - 如果参数中包含自建商品，是否需要正常返回自建商品信息
   *  @param {string} param.operator - 操作人信息, json 格式 ['user_id' => $userId, 'nick_name' => $nickName, 'client_ip' => $clientIp]
   *  @return {Promise}
   */
  async listItemsWithIds(param) {
    const result = await this.invoke('listItemsWithIds', [param]);
    result.forEach(i => {
      i.itemId = i.id;
    });
    return result;
  }
}

module.exports = ItemQueryService;
