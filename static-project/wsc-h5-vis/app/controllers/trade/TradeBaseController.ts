import { Context } from 'astroboy';
import { get } from 'lodash';

import BaseController from '../base/BaseNewController';

class TradeBaseController extends BaseController {
  // 获取cache/confirm/create的公用入参
  public getBuyPostData(ctx: Context) {
    const postData = ctx.getPostData();
    postData.kdtId = ctx.kdtId;
    postData.umpInfo = postData.umpInfo || {};
    // 当商品参加积分商城之后，usePoints默认为true
    postData.umpInfo.pointsExchange = {
      usePoints: false,
      ...postData.umpInfo.pointsExchange,
    };
    postData.userInfo = this.getUserInfo(ctx);
    postData.orderMark = this.getOrderMark(ctx);
    postData.newCouponProcess = true;

    return postData;
  }

  // 获取下单参数 orderMark
  public getOrderMark(ctx: Context) {
    if (ctx.isGuang) {
      return 'weapp_guang';
    }

    if (ctx.isWeapp) {
      return 'wx_shop';
    }
  }

  // 获取下单参数的 userInfo
  public getUserInfo(ctx: Context) {
    const {
      buyerPhone,
      buyerId,
      fansId,
      fansNickname,
      fansType,
      nobody,
      youzanFansId,
      platform,
    } = ctx.visBuyer;

    return {
      buyerPhone,
      fansId,
      fansNickname,
      fansType,
      nobody,
      // App开店所需字段
      outerUserId: get(platform, 'platform_user_id'),
      userId: buyerId,
      youzanFansId,
    };
  }

  // 获取下单参数的 source
  public getSource(ctx: Context) {
    const { kdtId, ip: clientIp = 0, platform, userAgent } = ctx;

    const source = {
      kdtId,
      clientIp,
      platform,
      isReceiveMsg: '1',
      userAgent,
    };

    return JSON.stringify(source);
  }

  // 获取下单参数的platform，暂时只判断小程序和微信h5
  public getPlatform(ctx: Context) {
    const { isWeapp, isWeixin } = ctx;
    if (isWeapp) {
      return 'weapp';
    } else if (isWeixin) {
      return 'weixin';
    }
    return '';
  }
}

export = TradeBaseController;
