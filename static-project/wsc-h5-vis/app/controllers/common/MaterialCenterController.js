const BaseController = require('../base/BaseNewController');
const StorageQiniuImageWriteService = require('../../services/api/material/materialcenter/StorageQiniuImageWriteService');
const QiniuAggregationWriteService = require('../../services/api/material/materialcenter/QiniuAggregationWriteService');

class MaterialCenterController extends BaseController {
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
      fromApp: 'wsc-h5-vis',
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
      fromApp: 'wsc-h5-vis',
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
