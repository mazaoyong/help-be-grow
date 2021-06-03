const BaseController = require('../base/BaseController');
const WeappQRCodeService = require('../../services/channels/WeappQRCodeService');
const MpVersionService = require('../../services/channels/MpVersionService');
const BaiduAppInfoService = require('../../services/channels/BaiduAppInfoService');

const get = require('lodash/get');

class ChannelsController extends BaseController {
  getUserId(ctx) {
    return ctx.getLocalSession('userInfo').id;
  }
  // 获取优惠券列表
  async wxaGetCodeUnlimit(ctx) {
    const kdtId = ctx.kdtId;
    const { page, scene } = ctx.request.query || {};

    const data = await new WeappQRCodeService(ctx).wxaGetCodeUnlimit(kdtId, page, scene);
    ctx.json(0, 'ok', data);
  }

  /**
   *  获取百度小程序、微信小程序、公众号信息
   *  @param {any} ctx
   *  @see http://zanapi.qima-inc.com/site/service/view/475884
   *  @description
   *    后续使用这个接口的，请在下面跟上使用的仓库以及简单的路径
   *    1. wsc-pc-shop(decorate-components) -> edu-regis-form -> editor.js
   */

  async getMpVersionJson(ctx) {
    const { query } = ctx;
    const kdtId = ctx.kdtId;
    const rootKdtId = get(ctx.getState('shopInfo'), 'rootKdtId');
    const getMpVersionDto = {
      businessType: get(query, 'businessType', 1),
      accountType: get(query, 'accountType', 6),
      kdtId: rootKdtId || kdtId,
    };

    const res = await new MpVersionService(ctx).getMpVersion(getMpVersionDto);
    ctx.json(0, 'ok', res);
  }

  // 生成百度小程序码
  async getBaiduAppCodeJson(ctx) {
    const kdtId = ctx.kdtId;
    const { path, businessType, width } = ctx.request.query || {};
    const dto = {
      kdtId,
      businessType,
      path,
      width,
    };

    const res = await new BaiduAppInfoService(ctx).getBaiduAppQrCode(dto);
    ctx.json(0, 'ok', res);
  }
}

module.exports = ChannelsController;
