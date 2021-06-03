const BaseController = require('../base/BaseController');
const WechatDeliveryService = require('../../services/delivery/WechatDeliveryService');

class WechatDeliveryHelperController extends BaseController {
  constructor(ctx) {
    super(ctx);
    this.ctx.biz = 'wechat-delivery-helper';
  }

  async getIndexHtml(ctx) {
    await ctx.render('wechat-delivery-helper/index.html');
  }

  async searchWechatDeliveryConfig(ctx) {
    const { kdtId } = ctx;
    const { includePrinterInfo, includeAllSupportDeliveryAddress } = ctx.query;
    const params = {
      kdtId,
      includePrinterInfo,
      includeAllSupportDeliveryAddress,
    };
    const config = await new WechatDeliveryService(ctx).searchWechatDeliveryConfig(params);
    ctx.json(0, 'ok', config);
  }

  async updateWechatDelvieryConfig(ctx) {
    const { kdtId } = ctx;
    const { addressDTO, bindNo, bizId, serviceTypeDTO } = ctx.request.body;
    const params = {
      addressDTO,
      bindNo,
      bizId,
      kdtId,
      serviceTypeDTO,
    };
    const result = await new WechatDeliveryService(ctx).updateWechatDelvieryConfig(params);
    ctx.json(0, 'ok', result);
  }

  async refreshWechatDeliveryAccount(ctx) {
    const { kdtId } = ctx;
    const result = await new WechatDeliveryService(ctx).refreshWechatDeliveryAccount({ kdtId });
    ctx.json(0, 'ok', result);
  }

  async searchWechatDeliveryPrinter(ctx) {
    const { kdtId } = ctx;
    const printers = await new WechatDeliveryService(ctx).searchWechatDeliveryPrinter({ kdtId });
    ctx.json(0, 'ok', printers);
  }

  async submitWechatDeliveryPrinter(ctx) {
    const { kdtId } = ctx;
    const { printers } = ctx.request.body;
    const params = printers.map(printer => ({
      account: printer.account,
      name: printer.name,
      uid: printer.uid,
      role: printer.role,
      kdtId,
    }));
    const result = await new WechatDeliveryService(ctx).submitWechatDeliveryPrinter(params);
    ctx.json(0, 'ok', result);
  }

  async deleteWechatDeliveryPrinter(ctx) {
    const { kdtId } = ctx;
    const { uid } = ctx.request.body;
    const result = await new WechatDeliveryService(ctx).deleteWechatDeliveryPrinter({
      kdtId,
      uid,
    });
    ctx.json(0, 'ok', result);
  }
}

module.exports = WechatDeliveryHelperController;
