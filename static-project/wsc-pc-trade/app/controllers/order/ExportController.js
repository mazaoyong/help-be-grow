const OrderBaseController = require('./OrderBaseController');
const SelfOrderExportRuleService = require('../../services/order/SelfOrderExportRuleService');
const OrderExportService = require('../../services/order-export/OrderExportService');
const mapKeysToCamelCase = require('@youzan/utils/string/mapKeysToCamelCase').default;
const lodash = require('lodash');
const { appName } = require('../../constants');

class ExportController extends OrderBaseController {
  /**
   * 查询是否存在订单报表导出配置
   * @param {*} ctx
   */
  async getDefinedExportRule(ctx) {
    const { kdtId } = ctx;
    const result = await new SelfOrderExportRuleService(ctx).definedExportRule(+kdtId);
    ctx.json(0, 'ok', result);
  }

  /**
   * 查询所有可自定义字段及已自定义字段
   * @param {*} ctx
   */
  async queryReportFields(ctx) {
    const { kdtId } = ctx;
    const result = await new SelfOrderExportRuleService(ctx).queryReportFields(+kdtId);
    ctx.json(0, 'ok', result);
  }

  /**
   *  http://zanapi.qima-inc.com/site/service/view/104088
   *  新增/修改 导出自定义字段
   */
  async saveReportFields(ctx) {
    const { kdtId } = ctx;
    const { fields, dimension } = ctx.request.body;
    const result = await new SelfOrderExportRuleService(ctx).saveReportFields({
      bizType: 'order',
      kdtId: +kdtId,
      fields,
      dimension,
    });
    ctx.json(0, 'ok', result);
  }

  async export(ctx) {
    const { kdtId } = ctx;
    let options = mapKeysToCamelCase(ctx.request.body.options) || {};
    if (options.exportType === 'customized') {
      options.templateId = 18;
    }
    if (!lodash.isPlainObject(options.keyword)) {
      options.keyword = {
        kdtId: +kdtId,
      };
    } else {
      options.keyword.kdtId = +kdtId;
    }
    options = {
      ...options,
      source: appName,
    };
    const result = await new OrderExportService(ctx).export(options);
    ctx.json(0, 'ok', result);
  }
}

module.exports = ExportController;
