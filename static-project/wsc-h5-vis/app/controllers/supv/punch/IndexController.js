const get = require('lodash/get');
const SnapshotService = require('../../../services/snap-shot/SnapShotService');

class IndexController {
  async getSharePoster(ctx) {
    const { userId: operatorId } = ctx;
    const query = ctx.request.body;

    const {
      type = 'share',
      userInfo,
      punchInfo,
    } = query;

    let result, html;
    try {
      if (type === 'long') {
        const showText = userInfo.punchText;
        const showAudios = get(userInfo, 'punchAudios.length', 0);
        const showImages = get(userInfo, 'punchImages.length', 0);
        const textEllipsis = showAudios || showImages;
        punchInfo.qrcode = punchInfo.longQrcode;
        html = await ctx.renderView('common/poster/punch/long.html', {
          userInfo,
          punchInfo,
          showText,
          textEllipsis,
          showAudios,
          showImages,
        });
      } else {
        punchInfo.qrcode = punchInfo.shareQrcode;
        html = await ctx.renderView('common/poster/punch/share.html', {
          userInfo,
          punchInfo,
        });
      }

      result = await new SnapshotService(ctx).postSnapshot({
        html,
        operatorId,
        height: 490,
        width: 325,
        alwaysCdn: 1,
        quality: 100,
      });
    } catch (err) {
      ctx.logger.warn('打卡分享海报生成失败', err);
      return ctx.json('WSC-H5-VIS-PUNCH-POSTER-ERROR', 'error', '打卡分享海报生成失败');
    }

    ctx.json(0, 'ok', result);
  }
}

module.exports = IndexController;
