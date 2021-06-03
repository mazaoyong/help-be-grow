// const BaseController = require('../base/BaseNewController');
const DrawPosterController = require('../common/DrawPosterController');
const SnapshotService = require('../../services/snap-shot/SnapShotService');
class PosterController extends DrawPosterController {
  // 获取邀请卡页面海报
  async getInvitePoster(ctx) {
    const { buyerId: operatorId, query = {} } = ctx;

    // 构造海报数据
    let drawInfo = { ...query };
    drawInfo.userAvatar = this.userAvatar;
    drawInfo.userName = this.userName;

    const weappCode = await this.getCommonWeappCode(ctx);
    if (weappCode) {
      drawInfo.qrUrl = weappCode;
    }
    let html = '';
    try {
      html = await ctx.renderView('ump/poster/invite-poster.html', { drawInfo });
    } catch (err) {
      console.log('err', err);
    }

    ctx.visLogger.info('[weapp invite poster params]', '', { result: drawInfo });

    let result = '';
    try {
      result = await new SnapshotService(ctx).postSnapshot({
        html,
        operatorId,
        height: 667,
        width: 375,
        alwaysCdn: 1,
        quality: 100,
      });
    } catch (err) {
      ctx.logger.warn('邀请卡海报生成失败', err);
    }

    if (!result) return ctx.json('WSC-H5-VIS-INVITE-POSTER-WEAPP', 'error', '邀请卡海报生成失败，请重试');
    ctx.json(0, 'ok', result);
  }

  // 拼团活动海报
  async getGrouponPoster(ctx) {
    const { buyerId: operatorId, query = {}, isWeapp, isSwanApp } = ctx;
    // 构造海报数据
    let drawInfo = { ...query };
    if (isWeapp) {
      const weappCode = await this.getCommonWeappCode(ctx);
      if (weappCode) {
        drawInfo.qrUrl = weappCode;
      }
    } else if (isSwanApp) {
      const SwanAppCode = await this.getCommonSwanCode(ctx);
      if (SwanAppCode) {
        drawInfo.qrUrl = SwanAppCode;
      }
    } else {
      const h5Code = await this.getQrcode(ctx, drawInfo.shareUrl);
      if (h5Code) {
        drawInfo.qrUrl = h5Code;
      }
    }

    let result = '';
    let html = '';

    ctx.visLogger.info('[groupon poster params]', '', { result: drawInfo });

    if (drawInfo.qrUrl) {
      try {
        html = await ctx.renderView('ump/poster/groupon-poster.html', { drawInfo });
      } catch (err) {
        console.log('err', err);
      }
      try {
        result = await new SnapshotService(ctx).postSnapshot({
          html,
          operatorId,
          height: 476,
          width: 292,
          alwaysCdn: 1,
          quality: 100,
        });
      } catch (err) {
        ctx.logger.warn('拼团海报生成失败', err);
      }
    } else {
      return ctx.json('WSC-H5-VIS-GROUPON-POSTER', 'error', '二维码获取失败，请重试');
    }

    if (!result) return ctx.json('WSC-H5-VIS-GROUPON-POSTER', 'error', '拼团海报生成失败，请重试');
    ctx.json(0, 'ok', result);
  }

  // 获取转介绍海报
  async getIntroductionPoster(ctx) {
    const { buyerId: operatorId } = ctx;
    const drawInfo = ctx.getPostData();
    let result;
    // 渲染html
    let html = '';
    try {
      html = await ctx.renderView('common/poster/ump/introduction/poster.html', { drawInfo });
    } catch (err) {
      ctx.logger.warn('err', err);
    }

    try {
      result = await new SnapshotService(ctx).postSnapshot({
        html,
        operatorId,
        type: 'png',
        height: 414,
        width: 292,
        alwaysCdn: 1,
        quality: 100,
      });
    } catch (err) {
      ctx.logger.warn('邀请海报生成失败', err);
    }

    if (!result) {
      return ctx.json('WSC-H5-VIS-POST-SNAPSHOT-ERROR', 'error', '邀请海报生成失败，请重试');
    }
    ctx.json(0, 'ok', result);
  }

  // 转介绍助力活动海报
  async getBoostPoster(ctx) {
    const { buyerId: operatorId, query = {} } = ctx;

    // 构造海报数据
    let drawInfo = { ...query };
    drawInfo.userAvatar = this.userAvatar;
    drawInfo.userName = this.userName;

    const weappCode = await this.getCommonWeappCode(ctx);
    if (weappCode) {
      drawInfo.qrUrl = weappCode;
    }
    let html = '';
    try {
      html = await ctx.renderView('common/poster/ump/introduction/boost-poster.html', { drawInfo });
    } catch (err) {
      console.log('err', err);
    }

    ctx.logger.warn('转介绍助力海报参数', html);

    let result = '';
    try {
      result = await new SnapshotService(ctx).postSnapshot({
        html,
        operatorId,
        height: 420,
        width: 292,
        alwaysCdn: 1,
        quality: 100,
      });
    } catch (err) {
      ctx.logger.warn('转介绍助力海报生成失败', err);
    }

    if (!result) return ctx.json('WSC-H5-VIS-POST-BOOST-ERROR', 'error', '转介绍助力海报生成失败，请重试');
    ctx.json(0, 'ok', result);
  }

  async getRecommendGiftPoster(ctx) {
    const { buyerId: operatorId } = ctx;
    const drawInfo = ctx.getPostData() || {};

    const allCode = await this.getCommonCode(ctx, drawInfo.shareUrl);

    if (allCode) {
      drawInfo.qrUrl = allCode;
    }

    const userAvatar = await this.fetchPublicImage(ctx, drawInfo.userAvatar);

    if (userAvatar) {
      drawInfo.userAvatar = userAvatar;
    }

    let result;
    // 渲染html
    let html = '';
    try {
      const viewMap = {
        0: 'common/poster/ump/recommend-gift/poster.html',
        1: 'common/poster/ump/recommend-gift/poster-diy.html',
      };
      html = await ctx.renderView(`${viewMap[drawInfo.bgType]}`, { drawInfo });
    } catch (err) {
      ctx.logger.warn('err', err);
    }

    try {
      const heightMap = {
        0: 445,
        1: 434,
      };
      result = await new SnapshotService(ctx).postSnapshot({
        html,
        operatorId,
        height: heightMap[drawInfo.bgType],
        width: 300,
        alwaysCdn: 1,
        quality: 100,
        type: 'png',
      });
    } catch (err) {
      ctx.logger.warn('下单有礼海报生成失败', err);
    }

    if (!result) {
      return ctx.json('WSC-H5-VIS-POST-SNAPSHOT-ERROR', 'error', '下单有礼海报生成失败，请重试');
    }
    ctx.json(0, 'ok', result);
  }

  async getRecommendGiftShareImg(ctx) {
    const { buyerId: operatorId } = ctx;
    const drawInfo = ctx.getPostData() || {};

    let result;
    // 渲染html
    let html = '';
    try {
      html = await ctx.renderView(`common/poster/ump/recommend-gift/weapp-share.html`, { drawInfo });
    } catch (err) {
      ctx.logger.warn('err', err);
    }

    try {
      result = await new SnapshotService(ctx).postSnapshot({
        html,
        operatorId,
        height: 148,
        width: 185,
        alwaysCdn: 1,
        quality: 100,
        type: 'png',
      });
    } catch (err) {
      ctx.logger.warn('下单有礼小程序分享生成失败', err);
    }

    if (!result) {
      return ctx.json('WSC-H5-VIS-POST-SNAPSHOT-ERROR', 'error', '下单有礼小程序分享生成失败，请重试');
    }
    ctx.json(0, 'ok', result);
  }
}

module.exports = PosterController;
