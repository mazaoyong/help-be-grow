const { checkBranchStore } = require('@youzan/utils-shop');
const BaseController = require('../base/BaseController');
const ShopFrontService = require('../../services/api/ebiz/salesman/ShopFrontService');
const ShopCenterWebApiService = require('../../services/api/ebiz/salesman/ShopCenterWebApiService');
const SalesmanWhiteOrGrayApiService = require('../../services/api/ebiz/salesman/SalesmanWhiteOrGrayApiService');

class SalesmanEntryType extends BaseController {
  errCatch(msg, e) {
    this.ctx.logger.error(msg, e, e.extra);
  }

  getQueryKdtId(ctx) {
    const shopInfo = ctx.getState('shopInfo');
    let queryKdtId = ctx.kdtId;

    if (checkBranchStore(shopInfo)) {
      queryKdtId = shopInfo.rootKdtId;
    }

    return queryKdtId;
  }

  // 判断是否在白名单内
  async getIfInWhiteList(ctx, key) {
    let queryKdtId = this.getQueryKdtId(ctx);

    return this.callService(
      'wsc-pc-base/common.GrayReleaseService',
      'isInGrayReleaseByKdtId',
      key,
      queryKdtId
    ).catch(() => false);
  }

  /**
   * 获取分销员或销售员入口
   * @param {object} ctx 上下文
   * @returns {number} 0: 不显示入口 1: 显示销售员入口 2: 显示分销员入口
   */

  async getType(ctx) {
    let res = 0;
    /**
     * salesmanShopType
     * 1: 单店(包括大网店)
     * 2: 连锁模式下总店(不包括大网店)
     * 3: 连锁模式下网店
     * 4: 连锁模式下门店
     * 5: 合伙人MU
     */
    const salesmanShopType = await new ShopCenterWebApiService(ctx)
      .getOriginShopTypeByKdtId(ctx.kdtId)
      .catch(e => this.errCatch('店铺类型获取失败', e));

    // 判断是否是连锁类型
    const isChain = [2, 3, 4].includes(salesmanShopType);

    // 判断是否在销售员商业化白名单
    const isInCommercializationWhiteList = await new ShopFrontService(ctx)
      .salesmanYopWhiteList(ctx.kdtId)
      .catch(e => this.errCatch('商业化白名单判断失败', e));

    // 判断是否在销售员支持连锁白名单内
    const isInChainWhiteList = await new SalesmanWhiteOrGrayApiService(ctx)
      .isInChainGrayReleaseByKdtId(ctx.kdtId)
      .catch(e => this.errCatch('连锁白名单判断失败', e));

    // 判断是否在销售员内测白名单内（仅连锁类型中的3.0店铺）
    const isInSalesEntry = await this.getIfInWhiteList(ctx, 'sales_entry').catch(e =>
      this.errCatch('内测白名单判断失败', e)
    );

    // 属于连锁
    if (isChain) {
      // 在连锁白名单
      if (isInChainWhiteList) {
        res = 1;
      } else {
        // 在内测白名单
        if (isInSalesEntry) {
          res = 1;
        } else {
          res = 2;
        }
      }
    } else {
      if (isInCommercializationWhiteList) {
        res = 1;
      } else {
        res = 2;
      }
    }
    return res;
  }
}

module.exports = SalesmanEntryType;
