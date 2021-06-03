const BaseController = require('../base/BaseController');
const TencentVideoWriteService = require('../../services/material/TencentVideoWriteService');
const CategoryReadService = require('../../services/material/CategoryReadService');
const StorageQiniuFileWriteService = require('../../services/material/StorageQiniuFileWriteService');
const QiniuAudioWriteService = require('../../services/material/QiniuAudioWriteService');
const StorageQiniuImageWriteService = require('../../services/material/StorageQiniuImageWriteService');
const QiniuAggregationWriteService = require('../../services/material/QiniuAggregationWriteService');

class MaterialCenterController extends BaseController {
  // 判断是否在白名单内
  async isInWhiteList(key, kdtId) {
    return this.callService(
      'wsc-pc-base/common.GrayReleaseService',
      'isInGrayReleaseByKdtId',
      key,
      kdtId
    );
  }

  // 获取视频上传token
  async postVideoUploadTokenJson(ctx) {
    const kdtId = ctx.kdtId;
    const userId = this.formatOperator.userId;
    const { file_name } = ctx.request.body || {}; // eslint-disable-line

    const useHLS = true; // await this.isInWhiteList('pct_video_hls', kdtId);

    const data = await new TencentVideoWriteService(ctx).videoUploadToken({
      channel: 'pc_vis_node',
      fileName: file_name,
      fromApp: 'wsc-pc-vis',
      operatorType: 1,
      operatorId: userId,
      partnerBizType: 1,
      partnerBizId: kdtId,
      useHLS,
    });

    ctx.json(0, 'ok', data);
  }

  // 确认上传视频
  async postConfirmVideoUploadJson(ctx) {
    const kdtId = ctx.kdtId;
    const userId = this.formatOperator.userId;
    const { video_path } = ctx.request.body || {}; // eslint-disable-line

    const useHLS = true; // await this.isInWhiteList('pct_video_hls', kdtId);

    const data = await new TencentVideoWriteService(ctx).confirmVideoUpload({
      filePath: video_path,
      fromApp: 'wsc-pc-vis',
      operatorType: 1,
      operatorId: userId,
      partnerBizType: 1,
      partnerBizId: kdtId,
      maxSize: 3 * 1024 * 1024 * 1024,
      useHLS,
    });

    ctx.json(0, 'ok', data);
  }

  // 发布视频
  async postPublishVideoJson(ctx) {
    const kdtId = ctx.kdtId;
    const userId = this.formatOperator.userId;
    const id = this.formatOperator.clientIp;
    const { video_path, video_name } = ctx.request.body || {}; // eslint-disable-line

    const data = await new TencentVideoWriteService(ctx).publishVideo({
      filePath: video_path,
      fromApp: 'wsc-pc-vis',
      videoName: video_name,
      operatorType: 1,
      operatorId: userId,
      partnerBizType: 1,
      partnerBizId: kdtId,
      ip: id,
    });

    ctx.json(0, 'ok', data);
  }

  // 获取素材中心分组列表
  async getCategoryList(ctx) {
    const params = {
      partnerBizId: ctx.kdtId,
      partnerBizType: ctx.request.query.partnerBizType || 1,
      mediaType: ctx.request.query.mediaType || 1,
      categoryType: ctx.request.query.categoryType,
    };
    const data = await new CategoryReadService(ctx).queryCategoryList(params);
    ctx.json(0, 'ok', data);
  }

  // 获取上传token
  async getPrivateFileUploadToken(ctx) {
    const { channel } = ctx.query;
    const operator = this.formatOperator;
    const request = {
      ip: operator.clientIp,
      channel: channel,
      fromApp: 'wsc-pc-vis',
      operatorType: 2,
      operatorId: operator.userId,
      maxSize: 500 * 1024 * 1024,
    };
    const data = await new StorageQiniuFileWriteService(ctx).getPrivateFileUploadToken(request);
    return ctx.json(0, 'ok', data);
  }

  // 获取宽泛限制的七牛公开音频上传必须的授权令牌(定制化能力)
  async getPublicBroadLimitAudioUploadToken(ctx) {
    const operator = this.formatOperator;
    const request = {
      ip: operator.clientIp,
      channel: 'owl_broad_audio',
      fromApp: 'wsc-pc-vis',
      operatorType: 2,
      operatorId: operator.userId,
      partnerBizId: ctx.kdtId,
      partnerBizType: 1,
    };
    const data = await new QiniuAudioWriteService(ctx).getPublicBroadLimitAudioUploadToken(request);
    return ctx.json(0, 'ok', { uptoken: data.uploadToken });
  }

  // 查询是否在宽泛限制的七牛公开音频上传白名单，与上一个接口共同使用（定制化接口）
  async checkPublicBroadLimitAudioUpload(ctx) {
    const inWhiteList = await this.callService(
      'wsc-pc-base/common.GrayReleaseService',
      'isInGrayReleaseByKdtId',
      'yzedu_loose_audio',
      ctx.kdtId
    );
    return ctx.json(0, 'ok', { broadAudioLimit: inWhiteList });
  }

  // 抓取远程地址保存为通用存储七牛公开图片
  async fetchPublicImage(ctx) {
    // @todo: 细化 channel
    const channel = 'wsc_vis_common';
    const { fetchUrl } = ctx.request.body;
    const operator = this.formatOperator;
    const request = {
      channel,
      fetchUrl,
      ip: operator.clientIp,
      fromApp: 'wsc-pc-vis',
      maxSize: 30 * 1024 * 1024,
      operatorId: operator.userId,
      operatorType: 1,
    };
    const data = await new StorageQiniuImageWriteService(ctx).fetchPublicImage(request);
    return ctx.json(0, 'ok', data);
  }

  // 获取上传授权token
  async getUploadToken(ctx) {
    // @todo: 细化 channel
    const channel = 'wsc_vis_common';
    const operator = this.formatOperator;
    const request = {
      channel,
      ip: operator.clientIp,
      mediaAccessType: 1,
      storeType: 2,
      mediaType: 1,
      fromApp: 'wsc-pc-vis',
      maxSize: 30 * 1024 * 1024,
      operatorId: operator.userId,
      operatorType: 1,
    };
    const data = await new QiniuAggregationWriteService(ctx).getUploadToken(request);

    if (data) {
      // 在 vis-ui 中，取的是 uptoken 字段，做一下兼容
      data.uptoken = data.token;
    }

    return ctx.json(0, 'ok', data);
  }
}

module.exports = MaterialCenterController;
