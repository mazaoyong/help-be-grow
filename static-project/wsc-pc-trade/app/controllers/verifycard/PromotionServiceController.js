const BaseController = require('../base/BaseController');
const CouponVerifyFacadeService = require('../../services/ump/verifycard/CouponVerifyFacadeService');
const VoucherActivityReadService = require('../../services/ump/verifycard/VoucherActivityReadService');
const CouponVerifyService = require('../../services/ump/verifycard/CouponVerifyService');
const VerifyToolService = require('../../services/ump/verifycard/VerifyToolService');
const { checkWscHqStore, checkRetailMinimalistHqStore } = require('@youzan/utils-shop');

class PromotionServiceContorller extends BaseController {
  /**
   * 获取卡券名称
   */
  async getPromoNameList(ctx) {
    const { kdtId, query } = ctx;
    const params = {
      ...query,
      kdtId,
    };
    const data = await new VoucherActivityReadService(ctx).listActivityOnShowScene(params);
    ctx.json(0, 'ok', data);
  }

  /**
   * 根据核销码获取买家券信息
   */
  async getCouponByVerifyCode(ctx) {
    const {
      kdtId,
      query: { verifyCode },
    } = ctx;

    const data = await new CouponVerifyFacadeService(ctx).getCouponByVerifyCode(kdtId, verifyCode);
    ctx.json(0, 'ok', data);
  }

  /**
   * 根据query筛选返回对应的优惠券/码验证记录
   */
  async getVerifyLogList(ctx) {
    const query = ctx.getQueryData();
    const shopInfo = ctx.getState('shopInfo');
    const { kdtId } = ctx;

    query.kdtId = kdtId;
    if (!checkWscHqStore(shopInfo) && !checkRetailMinimalistHqStore(shopInfo)) {
      // 如果是分店则不允许传入subKdtId
      delete query.subKdtId;
    }
    const data = await new CouponVerifyFacadeService(ctx).searchVerifyLogList(query);
    ctx.json(0, 'ok', data);
  }

  /**
   * 核销优惠券码
   */
  async verifyPromo(ctx) {
    const {
      request: {
        body: { verifyCode, verifyType },
      },
      kdtId,
      userId: buyerId,
    } = ctx;
    const requestParams = {
      verifyCode,
      verifyType,
      kdtId,
      buyerId,
    };

    const data = await new CouponVerifyService(ctx).verify(requestParams);
    ctx.json(0, 'ok', data);
  }

  /**
   * 根据query导出优惠券码验证记录下载链接
   */
  async exportVerifyLogList(ctx) {
    const { subKdtId, ...rest } = ctx.request.body;
    const shopInfo = ctx.getState('shopInfo');
    const { kdtId, userId: operatorId } = ctx;

    const params = {
      ...rest,
      kdtId,
      operatorId,
    };

    if (checkWscHqStore(shopInfo) && subKdtId) {
      // 如果是总店查询分店,则kdtId为分店kdtId
      params.kdtId = subKdtId;
    }

    const data = await new VerifyToolService(ctx).exportVerifyRecords(params);
    ctx.json(0, 'ok', data);
  }
}

module.exports = PromotionServiceContorller;
