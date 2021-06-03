const BaseController = require('../base/BaseController');
const RefundBatchService = require('../../services/refund/RefundBatchService');

class IndexController extends BaseController {
  /**
   * @param {AstroboyContext} ctx
   * @memberof IndexController
   */
  async getIndexHtml(ctx) {
    this.initUserInfo();
    await ctx.render('batch-refund/index.html');
  }

  /**
   * 获取批量退款历史记录列表
   * @param {Context} ctx
   */
  async getBatchRefundList(ctx) {
    const { kdtId } = ctx;
    const { page, count, orderby, sortOrder } = ctx.getQueryData();
    const params = {
      kdtId,
      page,
      count,
      orderby,
      sortOrder,
    };
    const result = await new RefundBatchService(ctx).getList(params);

    ctx.successRes(result);
  }

  /**
   * 获取素材银行上传TOKEN
   * @param {Context} ctx
   */
  async getUploadTokon(ctx) {
    const { kdtId, userId } = ctx;
    const result = await new RefundBatchService(ctx).getToken(kdtId, userId);

    ctx.successRes(result);
  }

  /**
   * 操作批量退款
   * @param {Context} ctx
   */
  async doRefund(ctx) {
    const { kdtId } = ctx;
    const { url, smsCaptcha, note } = ctx.request.body;
    const params = {
      kdtId,
      adminId: this.operator.operatorId,
      adminName: this.operator.operatorName,
      url,
      mobile: this.operator.operatorPhone,
      smsCaptcha,
      note,
    };
    const result = await new RefundBatchService(ctx).doRefund(params);

    ctx.successRes(result);
  }

  /**
   * 查询当天操作次数是否超过3次
   * @param {Context} ctx
   */
  async isOverBatchRefundTime(ctx) {
    const { kdtId } = ctx;
    const result = await new RefundBatchService(ctx).isOverBatchRefundTime(kdtId);

    ctx.successRes(result);
  }
}

module.exports = IndexController;
