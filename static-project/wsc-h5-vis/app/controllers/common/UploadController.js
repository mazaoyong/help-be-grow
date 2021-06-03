const BaseController = require('../../controllers/base/BaseNewController');
const UploadTokenFacade = require('../../services/owl/common/UploadTokenFacade');
const TencentVideoWriteService = require('../../services/api/material/materialcenter/TencentVideoWriteService');

class UploadController extends BaseController {
  async getPubImgUploadToken(ctx) {
    const kdtId = ctx.kdtId || 0;
    const maxSize = ctx.query.size || 0;
    const result = await new UploadTokenFacade(ctx).getPubImgUploadToken(kdtId, maxSize);
    ctx.json(0, 'ok', result);
  }

  async getAudiaUploadToken(ctx) {
    const kdtId = ctx.kdtId || 0;
    const result = await new UploadTokenFacade(ctx).getAudiaUploadToken(kdtId);
    ctx.json(0, 'ok', result);
  }

  async getQiniuAggregateUploadToken() {
    const ctx = this.ctx;
    const {
      mediaAccessType = 1,
      mediaType = 1,
      storeType = 2,
      channel = 'owl_ceres_img',
    } = ctx.request.body || {};

    const data = await new UploadTokenFacade(ctx).getQiniuAggregateUploadToken(ctx.kdtId, {
      mediaAccessType,
      mediaType,
      storeType,
      operatorId: this.formatOperator.userId,
      ip: ctx.firstXff,
      operatorType: 1,
      channel,
    });

    return ctx.json(0, 'ok', data);
  }

  // 获取视频上传token
  async postVideoUploadTokenJson(ctx) {
    const kdtId = ctx.kdtId;
    const userId = this.formatOperator.userId;
    const { file_name } = ctx.request.body || {}; // eslint-disable-line

    const useHLS = true; // await this.isInWhiteList('pct_video_hls', kdtId);

    const data = await new TencentVideoWriteService(ctx).getVideoUploadToken({
      channel: 'owl_ceres_post',
      fileName: file_name,
      fromApp: 'wsc-h5-vis',
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

    const data = await new TencentVideoWriteService(ctx).createVideo({
      filePath: video_path,
      fromApp: 'wsc-h5-vis',
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
      fromApp: 'wsc-h5-vis',
      videoName: video_name,
      operatorType: 1,
      operatorId: userId,
      partnerBizType: 1,
      partnerBizId: kdtId,
      ip: id,
    });

    ctx.json(0, 'ok', data);
  }
}

module.exports = UploadController;
