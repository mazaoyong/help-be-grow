import BaseController from '../base/BaseController';

class BizController extends BaseController {
  /**
   * @desc biz config 本地开发调试页面
   */
  async getIndexHtml(ctx) {
    const { config } = ctx.params;
    // remove: 测试代码
    const receipt = {
      outBizNo: 'E20210226171237020002054',
      payAmount: '',
      returnUrl: 'https://shop51247326.youzan.com/wscvis/order/paid-status?orderNo=E20210226171237020002054&alias=1y47xid0acow6&lessonNo=-1&kdt_id=51055158',
    };
    ctx.setGlobal('receipt', receipt);
    ctx.setGlobal('ranta_config', config);
    await ctx.render('common/biz.html');
  }
}

module.exports = BizController;
