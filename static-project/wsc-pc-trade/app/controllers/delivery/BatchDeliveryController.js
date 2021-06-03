const DeliveryBaseController = require('./DeliveryBaseController');
const BatchDeliveryService = require('../../services/delivery/BatchDeliveryService');
const _ = require('lodash');
const utilsShop = require('@youzan/utils-shop');

class BatchDeliveryController extends DeliveryBaseController {
  get isRetailChainStore() {
    const { shopType, shopRole } = this.ctx.getState('shopInfo');
    return shopType === 7 && shopRole !== 0;
  }

  getBatchResource(isSplit = false) {
    const { isSuperStore } = this.ctx;
    const shopInfo = this.ctx.getState('shopInfo');
    if (utilsShop.checkRetailMinimalistBranchStore(shopInfo)) {
      return 'WSC';
    }
    if (this.isRetailChainStore) {
      return isSplit ? 'RETAIL_CHAIN_SPLIT' : 'RETAIL_CHAIN';
    }
    if (isSuperStore) {
      return isSplit ? 'RETAIL_SPLIT' : 'RETAIL';
    }
    return 'WSC';
  }

  async getIndexHtml(ctx) {
    ctx.setGlobal('operator', this.operator.operatorName);
    await this.getRetailShopRoles(ctx);
    await ctx.render('delivery/batch.html', {
      isSuperStore: ctx.isSuperStore,
    });
  }

  async getList(ctx) {
    const kdtId = +ctx.kdtId;
    const { batchStatus, operator, startDate, endDate, page, pageSize } = ctx.query;
    let postData = {
      kdtId,
      batchStatus: +batchStatus,
      operator,
      startDate: +startDate,
      endDate: +endDate,
      page: +page,
      pageSize: +pageSize,
    };
    // 过滤掉空值
    postData = _.pickBy(postData, val => val);
    const data = await new BatchDeliveryService(ctx).getBatchDetails(postData);
    ctx.json(0, 'ok', data);
  }

  async getUploadToken(ctx) {
    const { kdtId } = ctx;
    const token = await new BatchDeliveryService(ctx).getUploadToken({
      kdtId,
      operator: this.operator.operatorName,
      operatorId: `${this.operator.operatorId}`,
    });
    ctx.json(0, 'ok', token);
  }

  async uploadBatch(ctx) {
    const kdtId = +ctx.kdtId;
    const { filePath, isSplit } = ctx.request.body;
    const shopInfo = ctx.getState('shopInfo');
    const result = await new BatchDeliveryService(ctx).access({
      kdtId,
      operator: this.operator.operatorName,
      operatorId: `${this.operator.operatorId}`,
      batchSource: this.getBatchResource(isSplit),
      batchBiz:
        utilsShop.checkUnifiedShop(shopInfo) && !utilsShop.checkPartnerStore(shopInfo)
          ? 'BATCH_RETAIL_FULFILL_DELIVERY'
          : 'BATCH_DELIVERY',
      batchParamDTO: {
        filePath,
      },
      version: 'FIRST',
    });
    ctx.json(0, 'ok', result.batchNo);
  }

  async modifyBatch(ctx) {
    const kdtId = +ctx.kdtId;
    const { filePath } = ctx.request.body;
    const result = await new BatchDeliveryService(ctx).access({
      kdtId,
      operator: this.operator.operatorName,
      operatorId: `${this.operator.operatorId}`,
      batchSource: this.getBatchResource(),
      batchBiz: 'BATCH_MODIFY_EXPRESS',
      batchParamDTO: {
        filePath,
      },
      version: 'FIRST',
    });
    ctx.json(0, 'ok', result.batchNo);
  }

  async queryProgressByNo(ctx) {
    const kdtId = +ctx.kdtId;
    const { batchNo } = ctx.query;
    const result = await new BatchDeliveryService(ctx).getBatchProgress(kdtId, batchNo);
    ctx.json(0, 'ok', result);
  }
}

module.exports = BatchDeliveryController;
