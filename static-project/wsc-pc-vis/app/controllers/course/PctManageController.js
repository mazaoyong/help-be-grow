/**
 * 知识付费内容管理相关接口，统一放在这个controller，原名：owlbizcontroller
 */
const BaseController = require('../base/BaseController');
const OwlCommonService = require('../../services/owl/biz/OwlCommonService');

class PctManageController extends BaseController {
  // 知识付费下内容和专栏的 隐藏/显示
  async hideOwl(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new OwlCommonService(ctx).hideOwl(req);
    ctx.json(0, 'ok', res);
  }

  // 对知识付费下内容,直播,专栏,专栏下的内容,专栏下的直播进行排序
  async sortOwl(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new OwlCommonService(ctx).sortOwl(req);
    ctx.json(0, 'ok', res);
  }

  // 专栏下添加内容
  async postColumnContentJson(ctx) {
    const kdtId = ctx.kdtId;
    const { owlList, columnAlias } = ctx.request.body || {};

    const res = await new OwlCommonService(ctx).addContentToColumn(kdtId, owlList, columnAlias);
    ctx.json(0, 'ok', res);
  }

  async postBatchContentJson(ctx) {
    const kdtId = ctx.kdtId;
    const { contents } = ctx.request.body || {};

    const data = await new OwlCommonService(ctx).batchAdd(kdtId, contents);
    if (data.success) {
      return ctx.json(0, 'ok', data.results);
    }
    return ctx.json(10099, '部分创建成功', data.results);
  }

  async stopUpdateColumn(ctx) {
    const kdtId = ctx.kdtId;
    const { columnAlias } = ctx.request.body || {};

    const res = await new OwlCommonService(ctx).stopUpdateColumn(kdtId, columnAlias);
    ctx.json(0, 'ok', res);
  }

  async getWscQrCode(ctx) {
    const { url, height = 80, width = 80, deleteWhite = false } = ctx.query || {};
    const qrCodeDTO = {
      height,
      width,
      isShortenUrl: true,
      url,
      deleteWhite
    };

    const res = await new OwlCommonService(ctx).createQrCode(qrCodeDTO);
    ctx.json(0, 'ok', res);
  }
}

module.exports = PctManageController;
