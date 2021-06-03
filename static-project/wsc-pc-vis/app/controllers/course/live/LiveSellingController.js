const LiveDashboardFacade = require('../../../services/api/owl/pc/LiveDashboardFacade');
const LiveItemFacade = require('../../../services/api/owl/pc/LiveItemFacade');
const CouponFacade = require('../../../services/api/owl/pc/CouponFacade');
const BaseController = require('../../base/BaseController');

class LiveSellingController extends BaseController {
  /** */
  async getFindCouponListJson(ctx) {
    const requestData = ctx.getQueryParse();
    const operatorKdtId = ctx.kdtId;

    const result = await new CouponFacade(ctx).findCouponList(operatorKdtId, requestData);
    ctx.json(0, 'ok', result);
  }

  /** @desciption 分页查询直播间商品 */
  async getFindPageJson(ctx) {
    const requestData = ctx.getQueryParse();
    const { pageRequest, query } = requestData;

    const result = await new LiveItemFacade(ctx).findPage(ctx.kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }

  /** @desciption 查询直播间统计信息 */
  async getGetLiveMarketingDashboardInfoJson(ctx) {
    const requestData = ctx.getQueryParse();
    const liveAlias = requestData.liveAlias;

    const result = await new LiveDashboardFacade(ctx).getLiveMarketingDashboardInfo(
      ctx.kdtId,
      liveAlias,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 保存（创建&更新）直播商品 */
  async postSaveJson(ctx) {
    const requestData = ctx.getRequestData();
    const commandWithOperator = {
      ...requestData,
      ...this.formatOperator,
    };

    const result = await new LiveItemFacade(ctx).save(ctx.kdtId, commandWithOperator);
    ctx.json(0, 'ok', result);
  }

  /** @desciption 移除直播间商品 */
  async postRemoveJson(ctx) {
    const requestData = ctx.getRequestData();
    const commandWithOperator = {
      ...requestData,
      ...this.formatOperator,
    };

    const result = await new LiveItemFacade(ctx).remove(ctx.kdtId, commandWithOperator);
    ctx.json(0, 'ok', result);
  }

  /** */
  async postCreateCouponJson(ctx) {
    const requestData = ctx.getRequestData();
    const operatorKdtId = ctx.kdtId;
    const commandWithOperator = {
      ...requestData,
      ...this.formatOperator,
    };

    const result = await new CouponFacade(ctx).createCoupon(operatorKdtId, commandWithOperator);
    ctx.json(0, 'ok', result);
  }

  /** */
  async postDeleteCouponJson(ctx) {
    const requestData = ctx.getRequestData();
    const operatorKdtId = ctx.kdtId;
    const commandWithOperator = {
      ...requestData,
      ...this.formatOperator,
    };

    const result = await new CouponFacade(ctx).deleteCoupon(operatorKdtId, commandWithOperator);
    ctx.json(0, 'ok', result);
  }

  /** @desciption 直播间卖货开关配置 */
  async postUpdateLiveMarketingSettingJson(ctx) {
    const requestData = ctx.getRequestData();
    const settingWithOperator = {
      ...requestData,
      ...this.formatOperator,
    };

    const result = await new LiveDashboardFacade(ctx).updateLiveMarketingSetting(
      ctx.kdtId,
      settingWithOperator,
    );
    ctx.json(0, 'ok', result);
  }
}

module.exports = LiveSellingController;
