const BaseService = require('../base/BaseService');

/**
 * TemplateService
 */
class TemplateService extends BaseService {
  /**
   * @return {string}
   */
  get SERVICE_NAME() {
    return 'com.youzan.ic.delivery.service.TemplateService';
  }

  /**
   *  获取单个模板信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/166785
   *
   *  @param {Object} param - 运费模板kdtId 和id
   *  @param {number} param.kdtId - 店铺id
   *  @param {string} param.fromApp - 请求来源app
   *  @param {string} param.requestId - UUID
   *  @param {number} param.templateId - 模板id
   *  @return {Promise}
   */
  async getTemplateDetail(param) {
    return this.invoke('getTemplateDetail', [param]);
  }

  /**
   * 批量获取模版
   * @param {Object} params
   * @param {number} params.kdtId 店铺id
   * @param {number} params.page 第几页
   * @param {number} params.pageSize 每页条数
   */
  async listTemplates(params) {
    return this.invoke('listTemplates', [params]);
  }

  /**
   * 复制模板
   * @param {Object} params
   * @param {number} params.kdtId 店铺ID
   * @param {number} params.templateId 模版id
   */
  async replicate(params) {
    return this.invoke('replicate', [params]);
  }

  /**
   * 创建模版
   * @param {Object} params
   * @param {string} params.name 模版名称
   * @param {number} params.kdtId 店铺id
   * @param {number} params.payType 付费类型
   * @param {number} params.valuationType 计费类型
   * @param {Object[]} params.valuationRules 配送区域
   */
  async create(params) {
    return this.invoke('create', [params]);
  }

  /**
   * 更新模板(计费类型不提供更改)
   * @param {Object} param - 模版信息
   * @param {number} param.kdtId - 店铺id
   * @param {string} param.fromApp - 请求来源app
   * @param {string} param.requestId - UUID
   * @param {string} param.name - 运费模板名称
   * @param {Array.<Object>} param.valuationRules[] - 运费规则
   * @param {number} param.templateId - 模板id
   * @return {Promise}
   */
  async update(param) {
    return this.invoke('update', [param]);
  }

  /**
   * 删除模板
   * @param {object} params
   * @param {number} params.kdtId 店铺ID
   * @param {number} params.templateId 模版id
   */
  async deleteTemp(params) {
    return this.invoke('delete', [params]);
  }
}

module.exports = TemplateService;
