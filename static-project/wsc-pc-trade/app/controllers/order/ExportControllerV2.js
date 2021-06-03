const get = require('lodash/get');
const BaseController = require('./OrderBaseController');
const ConfigService = require('../../services/order-export/ConfigService');
const GeneralOrderExportService = require('../../services/order-export/GeneralOrderExportService');
const OrderExportService = require('../../services/order-export/OrderExportService');
const mapKeysToCamelCase = require('@youzan/utils/string/mapKeysToCamelCase').default;
const utilsShop = require('@youzan/utils-shop');
const { appName } = require('../../constants');

class ExportControllerV2 extends BaseController {
  get source() {
    const shopInfo = this.ctx.getState('shopInfo');
    return utilsShop.checkEduShop(shopInfo) ? 'edu' : 'wsc';
  }

  async export(ctx) {
    const { kdtId } = ctx;
    let { options = {} } = ctx.request.body;
    options = mapKeysToCamelCase(options) || {};
    const userInfo = ctx.getLocalSession('userInfo');
    const shopInfo = ctx.getState('shopInfo');
    let { keyword = {} } = options;

    keyword = {
      ...keyword,
      kdtId: +kdtId,
    };

    if (options.buyerId) {
      keyword.buyerId = options.buyerId;
    }

    options = {
      ...options,
      keyword,
      account: userInfo.account,
      nickName: this.operator.operatorName,
      source: appName,
    };

    // 连锁店铺传总店headKdtId
    if (utilsShop.checkWscChainStore(shopInfo)) {
      options.isHeadExport = false;
      options.keyword.headKdtId = get(shopInfo, 'rootKdtId');
      // 若是连锁总店，kdtId 改为 分店 kdtId
      if (utilsShop.checkWscHqStore(shopInfo)) {
        const { subShopKdtId } = options;
        options.isHeadExport = true;
        options.keyword.kdtId = subShopKdtId ? +subShopKdtId : 0;
      }
    }

    delete options.subShopKdtId;

    const result = await new OrderExportService(ctx).export(options);
    ctx.json(0, 'ok', result);
  }

  async getFields(ctx) {
    const { exportType, dimension } = ctx.query;
    const data = await new ConfigService(ctx).fetchReportFieldsV2({
      exportType,
      dimension,
      source: this.source,
    });
    ctx.json(0, 'ok', (data && data.reportFields) || []);
  }

  async getCustomizedFields(ctx) {
    const { kdtId } = ctx;
    const { dimension } = ctx.query;
    const fields = await new ConfigService(ctx).queryCustomizedConfig({
      kdtId,
      bizType: 'order',
      dimension,
    });
    ctx.json(0, 'ok', fields);
  }

  async saveCustomizedFields(ctx) {
    const { kdtId } = ctx;
    const { dimension, fields } = ctx.request.body;
    const saveResult = await new ConfigService(ctx).saveCustomizedConfig({
      kdtId,
      bizType: 'order',
      dimension,
      fields,
    });
    ctx.json(0, 'ok', saveResult);
  }

  async queryPrivateUrl(ctx) {
    const {
      kdtId,
      query: { exportId, category },
    } = ctx;
    const realUrl = await new GeneralOrderExportService(ctx).queryPrivateUrl({
      kdtId,
      exportId,
      category,
    });
    ctx.json(0, 'ok', realUrl);
  }
}

module.exports = ExportControllerV2;
