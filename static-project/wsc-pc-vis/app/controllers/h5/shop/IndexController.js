/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const ShopQueryService = require('../../../services/owl/pc/shop/ShopQueryService');
const ShopLoginService = require('../../../services/shopcenter/shopfront/ShopLoginService');
const ShopSwitchService = require('../../../services/shopcenter/chain/ShopSwitchService');

class IndexController extends BaseController {
  /**
   * 店铺列表页面
   */
  async getIndexHtml(ctx) {
    await ctx.render('h5/shop-list.html');
  }

  /**
   * 分校区列表页
   */
  async getMultShopListHtml(ctx) {
    await ctx.render('h5/mult-shop-list.html');
  }

  /**
   * 获取关联的机构列表
   */
  async getShopList(ctx) {
    const { pageSize, pageNumber, shopTypeValues, shopTopics } = ctx.request.body;
    let accountId = ctx.request.body.accountId || 0;
    if (!accountId) {
      const userInfo = ctx.getLocalSession('userInfo');
      if (!userInfo) {
        return ctx.json(-100, 'login failed');
      }
      accountId = userInfo.id;
    }
    const page = {
      pageSize: Number(pageSize),
      pageNumber: Number(pageNumber),
    };
    const query = {
      shopTypeValues: [Number(shopTypeValues)],
      shopTopics: [Number(shopTopics)],
    };

    const res = await new ShopQueryService(ctx).queryShopSummaries(accountId, page, query);

    const content = (res && res.content) || [];
    const { offset } = res.pageable;
    const pageable = (offset + content.length) < res.total;

    return ctx.json(0, 'ok', { content, pageable });
  }

  /**
   * 进入某个机构验证
   */
  async authBeforeEntryShop(ctx) {
    const { kdtId = 0 } = ctx.query;
    let sid = ctx.query.sid;
    if (!sid) {
      sid = ctx.sid;
    }
    const dto = {
      kdtId,
      sid,
    };
    const res = await new ShopLoginService(ctx).login(dto);
    return ctx.json(0, 'ok', res);
  }

  /**
   * 搜索连锁总部下面的店铺
   */
  async searchShopForSwitch(ctx) {
    const adminId = this.ctx.getLocalSession('userInfo').id;
    const request = {
      adminId,
      hasHq: true,
      hqKdtId: ctx.query.hqKdtId,
      pageSize: ctx.query.pageSize,
      pageNum: ctx.query.pageNumber,
    };
    const res = await new ShopSwitchService(ctx).searchShopForSwitch(request);
    return ctx.json(0, 'ok', res);
  }

  // 机构端小程序登陆需要根据shopInfo反查店铺类型
  async getShopMetaInfo(ctx) {
    const kdtId = ctx.query.kdtId || 0;
    const shopMetaInfo = await this.callService(
      'wsc-pc-base/shop.ShopMetaReadService',
      'queryShopMetaInfo',
      kdtId,
    );
    return ctx.json(0, 'ok', shopMetaInfo);
  }
}

module.exports = IndexController;
