const BaseService = require('../../../base/BaseService');

class WithdrawAdapterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.assets.WithdrawAdapterFacade';
  }

  // 是否能使用微信钱包
  async checkWalletValid(params) {
    const result = await this.owlInvoke('checkWalletValid', [params]);

    return result;
  }

  // 查看支持的银行卡
  async getWithdrawSupportBank(params) {
    const result = await this.owlInvoke('getWithdrawSupportBank', [params]);

    return result;
  }

  // 获取绑定的卡
  async getBindCard(params) {
    const result = await this.owlInvoke('getBindCard', [params]);

    return result;
  }

  // 获取绑定的微信钱包
  async getBindWeChatWallet(params) {
    const result = await this.owlInvoke('getBindWeChatWallet', [params]);

    return result;
  }

  // 绑定微信钱包
  async bindWeChatWallet(params) {
    const result = await this.owlInvoke('bindWeChatWallet', [params]);

    return result;
  }

  // 绑定银行卡
  async bindCard(params) {
    const result = await this.owlInvoke('bindCard', [params]);

    return result;
  }

  // 提现
  async apply(params) {
    const result = await this.owlInvoke('apply', [params]);

    return result;
  }

  // 查询提现列表
  async getWithdrawList(params) {
    const result = await this.owlInvoke('getWithdrawList', [params]);

    return result;
  }

  // 查询提现详情
  async getWithdrawDetail(params) {
    const result = await this.owlInvoke('getWithdrawDetail', [params]);

    return result;
  }

  // 获取可提现余额
  async getAccountAssets(params) {
    const result = await this.owlInvoke('getAccountAssets', [params]);

    return result;
  }

  // 获取绑定微信和银行卡
  async getBindWeChatWalletAndBindCard(params) {
    const result = await this.owlInvoke('getBindWeChatWalletAndBindCard', [params]);

    return result;
  }
}

module.exports = WithdrawAdapterService;
