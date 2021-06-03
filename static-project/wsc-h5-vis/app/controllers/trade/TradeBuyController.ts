import { Context } from 'astroboy';
import { get, find } from 'lodash';
import BusinessServiceError from '@youzan/iron-base/app/services/base/BusinessServiceError';
import buildUrl from '@youzan/utils/url/buildUrl';

import TradeBaseController from './TradeBaseController';
import TradeOrderFacade from '../../services/api/owl/api/TradeOrderFacade';
import ActivityService from '../../services/api/owl/ump/ActivityFacade';
import PackageBuyCustomerFacade from '../../services/api/owl/api/PackageBuyCustomerFacade';
import SeckillFacade from '../../services/owl/ump/seckill/SeckillFacade';

import { ACTIVITY_TYPE } from '../../constants/activity-type';
// import { buyDesignList } from './page-config';

interface UMP_INFO {
  packageBuy?: object;
  secKill?: object;
  timelimitDiscount?: object;
  meetReduce?: object;
  userPoints?: number;
}
interface SHOP_INFO {
  visPointsName: string;
  isShopRest: boolean;
  [propName: string]: any;
}

interface INFO_MAP {
  [key: string]: any;
}
class TradeBuyController extends TradeBaseController {
  public async buyAcl() {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
  }

  public async getIndexHtml(ctx: Context) {
    const { kdtId } = ctx;
    const { book_key: bookKey } = ctx.getQueryData();

    let { prepare, umpInfo, shopInfo } = await this.getTradeOrderInfo(bookKey);

    const redirect = prepare.redirectConfig || {};
    // 页面停留超时
    if (redirect.timeout) {
      throw new BusinessServiceError(101240006, '页面停留太久，请返回重新购买');
    }
    // 订单已支付，跳到订单详情
    if (redirect.orderPaid) {
      return ctx.redirect(buildUrl(`/wsctrade/order/detail?order_no=${prepare.orderNo}&kdt_id=${kdtId}`, 'h5', kdtId));
    }
    // 订单已创建且未支付，跳到待付款
    if (redirect.orderCreated) {
      return ctx.redirect(`/pay/wsctrade_pay?order_no=${prepare.orderNo}&kdt_id=${kdtId}`);
    }

    // 手动抛出prepare异常信息
    const warning = get(prepare, 'forbid.warning');
    if (warning) {
      throw new BusinessServiceError('WSC_H5_VIS_PREPARE_FORBID' as any, warning);
    }

    // 额外补全信息
    const [isThirdApp] = await Promise.all([ctx.isThirdApp(), this.setGlobalTheme()]);

    this.setYZYInfo(ctx);
    this.setGlobalInfo(umpInfo);
    this.setGlobalInfo(shopInfo);
    this.setSpm('trade', kdtId);

    ctx.setGlobal('prepare', prepare);
    ctx.setGlobal('env', {
      isThirdApp,
      platform: ctx.platform,
      isWeixin: ctx.isWeixin,
      isSwanApp: ctx.isSwanApp,
      isWeapp: ctx.isWeapp,
      isGuang: ctx.isGuang,
    });

    await ctx.render('trade/buy.html', {
      title: '确认订单',
    });
  }

  // 下单信息接口
  public async getTradeOrderJson() {
    const { bookKey } = this.ctx.getQueryData();
    const result = await this.getTradeOrderInfo(bookKey);
    this.ctx.json(0, 'ok', result);
  }

  // 预下单
  public async postConfirmJson(ctx: Context) {
    const params = this.getBuyPostData(ctx);
    params.source = this.getSource(ctx);
    params.platform = this.getPlatform(ctx);
    // 招生海报依赖来源信息，预下单不需要
    params.from = undefined;
    const result = await new TradeOrderFacade(ctx).confirm(params);
    ctx.json(0, 'ok', result);
  }

  // 下单
  public async postCreateJson(ctx: Context) {
    const params = this.getBuyPostData(ctx);
    params.source = this.getSource(ctx);
    params.platform = this.getPlatform(ctx);

    const result = await new TradeOrderFacade(ctx).create(params);
    ctx.json(0, 'ok', result);
  }

  /* 获取下单页订单信息，聚合 prepare 和 umpInfo */
  private async getTradeOrderInfo(bookKey: string) {
    const ctx = this.ctx;
    const { kdtId } = ctx;

    const prepareParams = {
      kdtId,
      bookKey,
      userInfo: this.getUserInfo(ctx),
      source: this.getSource(ctx),
      platform: this.getPlatform(ctx),
      newCouponProcess: true,
    };

    // 获取下单预备信息
    try {
      const prepare = await new TradeOrderFacade(ctx).prepare(prepareParams);
      const [umpInfo, shopInfo] = await Promise.all([this.getUmpInfo(prepare), this.getShopInfo()]);

      return {
        prepare,
        umpInfo,
        shopInfo,
      };
    } catch (error) {
      const content = error.errorContent;

      if (content) {
        // 这里可以针对异常做特殊逻辑
        // 目前在 iron-base 里面抛PageException和普通异常的效果是一样的
        throw new BusinessServiceError(content.code, content.msg);
      } else {
        throw error;
      }
    }
  }

  // 获取店铺信息
  private async getShopInfo() {
    const { kdtId } = this.ctx;
    let shopInfo: SHOP_INFO = {
      visPointsName: '积分',
      isShopRest: false,
    };
    const [visPointsName] = await Promise.all([this.getPointsName(), this.injectShopRest()]);
    shopInfo['visPointsName'] = visPointsName || '积分';
    // @ts-ignore
    shopInfo['isShopRest'] = !!this.ctx.getState('shopRestHtml');
    const shopMetaInfo = await this.callService('iron-base/shop.ShopMetaReadService', 'getShopMetaInfo', kdtId);
    shopInfo = { ...shopInfo, ...shopMetaInfo };
    return shopInfo;
  }

  // 获取下单营销信息
  private async getUmpInfo(prepare: any) {
    const ctx = this.ctx;
    const { kdtId, userId } = ctx;
    const activityType = get(prepare, 'activityType', 0);
    const activityAlias = get(prepare, 'umpInfo.activityAlias', '');
    const firstGoods = get(prepare, 'orderItems[0]', {});

    let umpInfo: UMP_INFO = {};

    // 优惠套餐查套餐详情
    if (activityType === ACTIVITY_TYPE.PACKAGE_BUY) {
      const param = {
        userId: userId,
        activityAlias,
      };
      const packageBuy = await new PackageBuyCustomerFacade(ctx).listActivityDetail(kdtId, param);
      umpInfo['packageBuy'] = packageBuy;
      return;
    }

    // 秒杀查秒杀详情
    if (activityType === ACTIVITY_TYPE.SEC_KILL) {
      const param = {
        activityAlias,
        userId,
      };
      const secKill = await new SeckillFacade(ctx).getActivity(kdtId, param);
      umpInfo['secKill'] = secKill;
      return;
    }

    // 积分商城查总积分 & 积分别名
    if (activityType === ACTIVITY_TYPE.POINTS_EXCHANGE) {
      const userPoints = await this.getUserPoints();
      umpInfo['userPoints'] = userPoints || 0;
      return;
    }

    // 获取限时折扣 和 满减
    const activity = await this.getActivity(ctx, firstGoods.alias);
    umpInfo['timelimitDiscount'] = get(
      find(activity, ({ type }) => type === 'timelimitedDiscount'),
      'data',
    );
    umpInfo['meetReduce'] = get(
      find(activity, ({ type }) => type === 'meetReduce'),
      'data',
    );

    return umpInfo;
  }

  // 目前作为一个通用兜底的取活动信息的方法
  // 不是很推荐用这个接口，因为目前会把当前商品参加的所有活动查出来
  private async getActivity(ctx: Context, alias: string) {
    const { kdtId, userId } = ctx;
    const param = {
      userId,
      productAlias: alias,
      productType: 31,
    };
    return new ActivityService(ctx).findByProduct(kdtId, param);
  }

  // 信息填充到 _global 中
  private async setGlobalInfo(infoMap?: INFO_MAP) {
    if (!infoMap) return;
    Object.keys(infoMap).forEach((key: string) => {
      if (infoMap[key]) {
        this.ctx.setGlobal(key, infoMap[key]);
      }
    });
  }

  // 设置上云信息
  private async setYZYInfo(ctx: Context) {
    const { kdtId } = ctx;
    // 上云前端数据获取路径拼接
    const pageName = 'edu-buy';
    const env = process.env.NODE_ENV;
    const host = env === 'prod' ? `h5` : `h5.m-${env}`;
    // 当心！下面buildUrl方法带.m不替换
    const diyCheckScript = buildUrl(
      `https://${host}.youzan.com/h5-extension-service/check-discover?pageName=${pageName}&kdtId=${kdtId}`,
      '',
      kdtId,
      { isMobileSubmain: true },
    );
    const conditionContext = {
      pageType: ctx.isWeapp ? 'applet' : 'h5',
      platform: this.ctx.platform,
    };
    const h5ExtensionDiscoverParams = {
      kdtId,
      pageName,
      conditionContext,
    };
    ctx.setState('diyCheckScript', diyCheckScript);
    ctx.setGlobal('h5ExtensionDiscoverParams', h5ExtensionDiscoverParams);
    // ctx.setGlobal('design', buyDesignList);
  }
}

export = TradeBuyController;
