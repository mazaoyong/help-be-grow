const BaseController = require('../base/BaseNewController');
const SnapshotService = require('../../services/snap-shot/SnapShotService');
const WeappQRCodeService = require('../../services/channels/WeappQRCodeService');
const BaiduAppInfoService = require('../../services/channels/BaiduAppInfoService');
const OwlCommonService = require('../../services/owl/biz/service/OwlCommonService');
const StorageQiniuImageWriteService = require('../../services/api/material/materialcenter/StorageQiniuImageWriteService');
/**
 * 接服务端绘制海报通用接口
 */
class DrawPosterController extends BaseController {
  // 获取用户头像
  get userAvatar() {
    return this.ctx.visBuyer.finalAvatar || 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png';
  }

  get userName() {
    return this.ctx.visBuyer.finalUsername || '小伙伴';
  }

  // url: 原始链接
  // 通用链接二维码生成
  async getCommonCode(ctx, url) {
    let base64 = '';
    const { isWeapp, isSwanApp } = ctx;
    if (isWeapp) {
      const targetUrl = encodeURIComponent(url);
      base64 = await this.getCommonWeappCode(ctx, targetUrl, '/packages/edu/webview/index');
    } else if (isSwanApp) {
      const targetUrl = `/packages/edu/webview/index?targetUrl=${encodeURIComponent(url)}`;
      base64 = await this.getCommonSwanCode(ctx, targetUrl);
    } else {
      base64 = await this.getQrcode(ctx, url);
    }

    return base64;
  }

  // 通用生成微信小程序码接口
  async getCommonWeappCode(ctx, url, pagePath) {
    let targetUrl = ctx.query.targetUrl || url || {};
    let page = ctx.query.page || pagePath || '';
    let params = {
      targetUrl,
      kdtId: this.ctx.kdtId,
      page,
    };
    params = JSON.stringify(params);
    const weappQRCodeService = new WeappQRCodeService(this.ctx);
    const data = await weappQRCodeService.getChainCodeUltra(this.ctx.kdtId, 'pages/common/blank-page/index', params);
    if (!data) {
      ctx.logger.warn('微信小程序码获取失败');
      return '';
    }
    return 'data:image/png;base64,' + data.imageBase64;
  }

  // 通用生成百度小程序码接口
  async getCommonSwanCode(ctx, url) {
    let targetUrl = ctx.query.targetUrl || url || {};
    let dto = {
      businessType: 1,
      kdtId: Number(ctx.kdtId),
      path: targetUrl,
    };
    const baiduAppInfoService = new BaiduAppInfoService(ctx);
    const data = await baiduAppInfoService.getBaiduAppQrCode(dto);
    if (!data) {
      ctx.logger.warn('百度小程序码获取失败');
      return '';
    }
    return 'data:image/png;base64,' + data;
  }

  // 通用生成h5二维码接口
  async getQrcode(ctx, url) {
    const queryData = {
      width: 280,
      height: 280,
      isShortenUrl: false,
      url,
      deleteWhite: true,
      errorCorrectionLevel: 2,
    };

    const result = await new OwlCommonService(ctx).createQrCode(queryData);
    if (!result) {
      ctx.logger.warn('二维码获取失败');
      return '';
    }
    return result;
  }

  async getSnopshotByKey(ctx) {
    const { key } = ctx.getQueryData();
    const snapshotService = new SnapshotService(ctx);
    const result = await snapshotService.getCache(key);
    ctx.json(0, 'ok', result);
  }

  async fetchPublicImage(ctx, fetchUrl) {
    const channel = 'wsc_vis_common';
    const operator = this.formatOperator;
    const request = {
      channel,
      fetchUrl,
      ip: operator.clientIp,
      fromApp: 'wsc-h5-vis',
      maxSize: 30 * 1024 * 1024,
      operatorId: operator.userId,
      operatorType: 1,
    };
    const data = await new StorageQiniuImageWriteService(ctx).fetchPublicImage(request);
    return data.url;
  }
}

module.exports = DrawPosterController;
