const BaseController = require('../base/BaseController');
const OverseaShopSettingService = require('../../services/trade/business/OverseaShopSettingService');
const CertInfoService = require('../../services/pay/CertInfoService');
const SecuredService = require('../../services/secured/SecuredService');
const ShopBaseReadService = require('../../services/shop/ShopBaseReadService');
const DepositService = require('../../services/pay/DepositService');
const AccountService = require('../../services/pay/AccountService');
const MerchantContractSignService = require('../../services/pay/ContractSignService');
const OverseaOrderQueryService = require('../../services/trade/business/OverseaOrderQueryService');
const uuid = require('uuid/v4');
const _get = require('lodash/get');
const ElectronicPortReadService = require('../../services/shopcenter/ElectronicPortReadService');

/**
 * 协议生效时间长度（永不失效无法支持，设置100年）
 */
const CONTRACT_VALID_TIME = 1000 * 3600 * 24 * 365 * 100;
/**
 * 跨境服务协议号
 */
const CONTRACT_PROTOCOL_NO = 'HTXY-B-DEPOSIT-OVERSEAS-PAY';
/**
 * 签约外部订单号
 */
const OUT_ORDER_ID = 'cross-border-service';
/**
 * 扫码支付显示名称
 */
const JOIN_GOODS_NAME = '有赞跨境服务保证金';

class IndexController extends BaseController {
  // 业务工具函数，不作为请求的处理方法被调用
  /**
   * 获取商户号（支付相关接口使用）
   */
  async getUserNo() {
    const ctx = this.ctx;
    const { kdtId } = ctx;
    const { paymentClientId } = await new ShopBaseReadService(ctx).getPaymentByKdtId(kdtId);
    return String(paymentClientId);
  }

  /**
   * @param {AstroboyContext} ctx
   */
  async getIndexHtml(ctx) {
    const { kdtId } = ctx;
    // 获取跨境服务开关状态
    const [serviceStatus, electronicPortList] = await Promise.all([
      new OverseaShopSettingService(ctx).query({ kdtId }),
      new ElectronicPortReadService(ctx).listElectronicPorts(kdtId),
    ]);

    ctx.setGlobal({ serviceStatus, electronicPortList });
    await ctx.render('cross-border/index.html');
  }

  /**
   * 检查能否入驻
   * @param {AstroboyContext} ctx
   */
  async checkApplyEntry(ctx) {
    const { kdtId } = ctx;
    const result = await new OverseaShopSettingService(ctx).checkApplyEntry({ kdtId });
    ctx.successRes(result);
  }

  /**
   * 查询入驻条件状态
   * @param {AstroboyContext} ctx
   */
  async queryAuthCondition(ctx) {
    const { kdtId } = ctx;
    const result = await Promise.all([
      // 跨境电商店铺主体认证状态
      new CertInfoService(ctx).queryCbcCertState(kdtId),
      // 有赞担保状态
      new SecuredService(ctx).query({ kdtId }),
    ]).then(([certResult, securedResult]) => {
      return {
        cert: certResult.status === CertInfoService.CertStatus.Pass,
        secured: _get(securedResult, 'joined', false),
      };
    });
    ctx.successRes(result);
  }

  /**
   * 查询跨境服务保证金记录
   * @param {AstroboyContext} ctx
   */
  async queryDepositRecord(ctx) {
    const userNo = await this.getUserNo();
    const result = await new DepositService(ctx).queryAccount(
      userNo,
      DepositService.types.CROSS_BORDER,
    );
    ctx.successRes(result);
  }

  /**
   * 签约保证金账户
   * @param {AstroboyContext} ctx
   */
  async contractSign(ctx) {
    const userNo = await this.getUserNo();
    const currentTimestamp = Date.now();
    const result = await new MerchantContractSignService(ctx).sign({
      contractProtocolNo: CONTRACT_PROTOCOL_NO,
      outOrderId: OUT_ORDER_ID,
      partnerAId: userNo,
      signMode: 'OVERWRITE_SIGN',
      validStartDate: currentTimestamp,
      validEndDate: currentTimestamp + CONTRACT_VALID_TIME,
    });
    return ctx.successRes(result);
  }

  /**
   * 查询充值支付信息
   * @param {AstroboyContext} ctx
   */
  async getPayInfo(ctx) {
    const { kdtId } = ctx;
    const userNo = await this.getUserNo();
    const { payAmount } = ctx.getPostData();

    const [joinResult, accountInfo] = await Promise.all([
      // 查询充值二维码
      new DepositService(ctx).join({
        userNo,
        depositType: DepositService.types.CROSS_BORDER,
        requestId: uuid(),
        goodsName: JOIN_GOODS_NAME,
        mchName: ctx.getState('shopInfo').shopName,
        payAmount: Number(payAmount),
        rechargeMethod: DepositService.rechargeMethod.QRCODE,
        kdtId: kdtId.toString(),
      }),
      // 查询账户余额
      new AccountService(ctx).queryBalance(userNo, 10),
    ]);
    const qrUrl = (
      await ctx.invokeServiceMethod(
        'wsc-pc-base',
        'common.QrcodeService',
        'batchQrcode',
        joinResult.qrUrl,
      )
    )[0];
    ctx.successRes({
      qrUrl,
      balance: accountInfo.balance,
    });
  }

  /**
   * 账户余额支付保证金
   * @param {AstroboyContext} ctx
   */
  async payBalance(ctx) {
    const { kdtId } = ctx;
    const userNo = await this.getUserNo();
    const { payAmount } = ctx.getPostData();
    const result = await new DepositService(ctx).join({
      userNo,
      depositType: DepositService.types.CROSS_BORDER,
      requestId: uuid(),
      goodsName: JOIN_GOODS_NAME,
      mchName: ctx.getState('shopInfo').shopName,
      payAmount: Number(payAmount),
      rechargeMethod: DepositService.rechargeMethod.BALANCE,
      kdtId: kdtId.toString(),
    });
    ctx.successRes(result);
  }

  /**
   * 查询概览页显示数据
   * @param {AstroboyContext} ctx
   */
  async getOverviewData(ctx) {
    const { kdtId } = ctx;
    const { time } = ctx.getQueryData();
    const overseaOrderQueryService = new OverseaOrderQueryService(ctx);
    const result = await (time === '1'
      ? overseaOrderQueryService.queryOrderDataOverviewRecentlyOneDay({ kdtId })
      : overseaOrderQueryService.queryOrderDataOverviewRecently30Days({ kdtId }));
    return ctx.successRes(result);
  }

  /**
   * 检查是否有未完成订单
   * @param {AstroboyContext} ctx
   */
  async hasOrderInProcess(ctx) {
    const { kdtId } = ctx;
    const result = await new OverseaOrderQueryService(ctx).hasOrderInProcess({ kdtId });
    return ctx.successRes(result);
  }

  /**
   * 退出跨境服务
   * @param {AstroboyContext} ctx
   */
  async applyQuit(ctx) {
    const { kdtId } = ctx;
    const result = await new OverseaShopSettingService(ctx).applyQuit({ kdtId });
    return ctx.successRes(result);
  }
}

module.exports = IndexController;
