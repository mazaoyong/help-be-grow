const BaseService = require('../base/BaseService');

/**
 * com.youzan.scrm.api.card.template.service.CardTemplateQueryService
 */
class CardTemplateQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.card.template.service.CardTemplateQueryService';
  }

  /**
   *  获取卡模板概要信息列表
   注意:该接口不过滤付费卡、返回卡模板概要信息，若想获取到完整信息
   可通过调用批量接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/340072
   *
   *  @param {Object} cardTemplateSummaryListQueryDTO - 参数
   *  @param {string} cardTemplateSummaryListQueryDTO.traceId -
   *  @param {number} cardTemplateSummaryListQueryDTO.kdtId - 店铺id
   *  @param {string} cardTemplateSummaryListQueryDTO.requestId -
   *  @param {string} cardTemplateSummaryListQueryDTO.appName -
   *  @param {string} cardTemplateSummaryListQueryDTO.name - 卡名称
   *  @param {number} cardTemplateSummaryListQueryDTO.pageSize - 分页大小
   *  @param {Object} cardTemplateSummaryListQueryDTO.orders - 排序条件，格式：<"create_at", "desc">，目前只支持created_at,card_id
   *  @param {number} cardTemplateSummaryListQueryDTO.page - 页码
   *  @param {number} cardTemplateSummaryListQueryDTO.cardAcquireSetting - 领卡设置
   *  @return {Promise}
   */
  async getSummaryList(cardTemplateSummaryListQueryDTO) {
    return this.invoke('getSummaryList', [cardTemplateSummaryListQueryDTO]);
  }
}

module.exports = CardTemplateQueryService;
