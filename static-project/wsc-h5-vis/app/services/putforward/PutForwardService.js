const formatDate = require('zan-utils/date/formatDate');
const BaseService = require('../base/BaseService');

class PutForwardService extends BaseService {
  get WITHDRAW_SERVICE() {
    return 'com.youzan.owl.biz.service.adapter.WithdrawAdapterService';
  }

  /**
   * 是否能使用微信钱包
   * @param {*} params
   * @param params.buyerId
   */
  async checkWalletValid(params) {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'checkWalletValid', [params]);
    return result;
  }

  /**
   * 获取绑定的微信钱包
   * @param {*} params
   * @param params.kdtId
   * @param params.buyerId
   */
  async getWxBindWallet(params) {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'getBindWeChatWallet', [params]);
    return result;
  }

  /**
   * 绑定微信钱包
   * @param {*} params
   * @param params.kdtId
   * @param params.buyerId
   * @param params.nickName
   */
  async bindWeChatWallet(params) {
    const dubboData = await this.owlInvoke(
      this.WITHDRAW_SERVICE,
      'bindWeChatWallet',
      [params]
    );
    return dubboData;
  }

  /**
   * 查看支持的银行卡
   */
  async getWithdrawSupportBank() {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'getWithdrawSupportBank', []);
    return result;
  }

  /**
   * 获取绑定的卡
   * @param {*} params
   * @param params.buyerId
   */
  async getBindCard(params) {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'getBindCard', [params]);
    return result;
  }

  /**
   * 绑定银行卡
   * @param {*} params
   * @param params.bankCode 发卡行code
   * @param params.bankName 银行卡名
   * @param params.cardBindId 绑卡id
   * @param params.cardholder 持卡人姓名
   * @param params.cardNo 卡号
   */
  async bindCard(params) {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'bindCard', [params]);
    return result;
  }

  /**
   * 获取绑定的微信钱包和银行卡
   * @param params.kdtId
   * @param params.buyerId
   */
  async getBindWeChatWalletAndBindCard(params) {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'getBindWeChatWalletAndBindCard', [params]);
    return result;
  }

  /**
   * 查看提现列表
   * @param {*} params
   * @param params.buyerId
   * @param param.page
   * @param params.pageSize
   */
  async getRecordList(params) {
    const dubboData = await this.owlInvoke(
      this.WITHDRAW_SERVICE,
      'getWithdrawList',
      [params]
    );
    dubboData.items = dubboData.items.map(item => {
      item.time = formatDate(item.applyTime * 1000, 'YYYY-MM-DD HH:mm:ss');
      return item;
    });
    return dubboData;
  }

  /**
   * 查询提现详情
   * @param {*} params
   * @param params.waterNo
   * @param params.buyerId
   * @param params.dataType
   */
  async getWithdrawDetial(params) {
    const dubboData = await this.owlInvoke(
      this.WITHDRAW_SERVICE,
      'getWithdrawDetail',
      [params]
    );
    dubboData.applyTime = formatDate(dubboData.applyTime * 1000, 'YYYY-MM-DD HH:mm:ss');
    dubboData.finishTime = formatDate(dubboData.finishTime * 1000, 'YYYY-MM-DD HH:mm:ss');
    return dubboData;
  }

  /**
   * 获取可提现余额
   * @param {*} params
   * @param params.buyerId
   */
  async getForward(params) {
    const dubboData = await this.owlInvoke(
      this.WITHDRAW_SERVICE,
      'getAccountAssets',
      [params]
    );
    return dubboData;
  }

  /**
   * 提现
   * @param {*} params
   * @param params.buyerId
   * @param params.money
   * @param params.acctType
   * @param params.bindCardId
   */
  async putForward(params) {
    const dubboData = await this.owlInvoke(
      this.WITHDRAW_SERVICE,
      'apply',
      [params]
    );
    return dubboData;
  }
}

module.exports = PutForwardService;
