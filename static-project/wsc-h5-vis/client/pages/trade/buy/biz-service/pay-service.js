import { PayManager } from '@youzan/captain';
import { Dialog, Toast } from 'vant';
import { get } from 'lodash';
import { ZNB } from '@youzan/wxsdk';
import formatMoney from '@youzan/utils/money/format';
import mapKeysToSnakeCase from '@youzan/utils/string/mapKeysToSnakeCase';
import mapKeysToCamelCase from '@youzan/utils/string/mapKeysToCamelCase';
import Args from '@youzan/utils/url/args';
import cookie from '@youzan/utils/browser/cookie';
import * as SafeLink from '@/common/utils/custom-safe-link';
import { getRedirectParam } from '../common/redirect';

export default class PayService {
  constructor({ state, dispatch, commit, getters }, vm) {
    this.state = state;
    this.getters = getters;
    this.$commit = commit;
    this.$dispatch = dispatch;
    this.$toast = Toast;
    this.$dialog = Dialog;

    this.onSelectPayWay = this.onSelectPayWay.bind(this);
    this.onPayFail = this.onPayFail.bind(this);
  }

  async onSelectPayWay(data) {
    this.$commit('SET_CASHIER_SELECTED_PAY_WAY_DATA', data);
    // 可中断有赞云 event
    try {
      await this.$dispatch('CLOUD_PAY_ITEM_CLICK', data);
    } catch (error) {
      return;
    }

    const { isWeapp, isGuang } = this.state.env;
    // 目前只有线下课支持爱逛
    const isSupportGuang = isGuang && this.getters.isCourse;
    if (isWeapp) {
      const redirectParams = getRedirectParam(this.state, this.getters);
      const returnUrl = SafeLink.getSafeUrl(redirectParams);
      const outBizCtxData = {
        // appId: cookie('appId') || 0, // https://jira.qima-inc.com/browse/ONLINE-263267
        wxSubOpenId: cookie('openId') || 0,
      };
      if (isSupportGuang) {
        Object.assign(outBizCtxData, {
          order_mark: 'weapp_guang',
          appId: 'wxa2e624400134d690',
        });
      }
      const outBizCtx = JSON.stringify(outBizCtxData);

      this.payManager.doPayActionAllowCancel(
        {
          ...data,
          outBizCtx,
        },
        result => {
          this.$commit('SET_CASHIER_SELECTED_PAY_WAY_DATA', {});

          if (data.payWay.pay_channel === 'WX_APPLET') {
            const payData = mapKeysToCamelCase(get(result, 'pay_data', {}));
            if (isSupportGuang) {
              Object.assign(payData, {
                businessType: 'edu',
                returnUrl: encodeURIComponent(returnUrl),
              });
            } else {
              Object.assign(payData, {
                goToResult: true,
                weappReturnUrl: `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
                  returnUrl,
                )}`,
              });
            }

            ZNB.navigate({
              weappUrl: Args.add('/packages/pay/wx-request/index', payData),
            });
          } else if (data.payWay.pay_channel === 'BANK_CARD') {
            // 目前小程序银行卡已被屏蔽，以下代码流程未能走通
            const payData = get(result, 'pay_data', {});
            const { submit_url: submitUrl, submit_data: submitData } = payData;
            const afterPayWeappUrl = `/packages/edu/webview/index?targetUrl=${encodeURIComponent(
              returnUrl,
            )}`;
            const viewUrl = Args.add(submitUrl, {
              ...submitData,
              is_from_weappwv: true,
              after_pay_weapp_url: afterPayWeappUrl,
            });

            ZNB.navigate({
              weappUrl: `/packages/pay/credit-card/index?viewUrl=${encodeURIComponent(
                viewUrl,
              )}`,
            });
          } else {
            // 其他，如E卡等，支付成功跳转成功页
            SafeLink.redirect({ url: returnUrl });
          }

          return false;
        },
      );
    } else {
      // 礼品卡用e卡形式支付，旧的礼品卡目前已不能创建
      // 当前场景值设置之后应该不会存在礼品卡这一项
      if (data.payWay.pay_channel === 'GIFT_CARD') {
        this.payManager.cashierOrderManager.doPayAction(data, payData => {
          this.payManager.doPayWithChannel('ECARD', payData);
          this.$commit('SET_CASHIER_SELECTED_PAY_WAY_DATA', {});
        });
      } else {
        this.payManager.doPayAction(data, () => {
          this.$commit('SET_CASHIER_SELECTED_PAY_WAY_DATA', {});
        });
      }
    }
  }

  startPay() {
    const {
      prePaymentPreparationDTO,
      preparePayResultDTO,
      zeroOrder,
      showPayResult,
    } = this.state.pay;
    const { prepay } = prePaymentPreparationDTO;

    // 0元单或者直接展示实付结果页的情况
    if (zeroOrder || showPayResult) {
      const redirectParams = getRedirectParam(this.state, this.getters);
      redirectParams.redirectType = 'replace';
      return SafeLink.redirect(redirectParams);
    }

    this.payManager = new PayManager({
      ...this.getPayApiUrl(prepay),
      fail: this.onPayFail,
    });

    const craeteParams = prepay
      ? mapKeysToSnakeCase(prePaymentPreparationDTO)
      : preparePayResultDTO;

    this.payManager.createCashierOrder(
      {
        ...craeteParams,
        scene: 'VALUE_COMMON',
      },
      () => {
        const payWays = this.payManager.getPayWays() || [];
        this.$commit('SET_CASHIER_PAY_WAYS', payWays);
        if (payWays.length === 0) {
          Toast('支付方式列表为空');
        } else {
          this.$commit('SET_CASHIER_SHOW_PAY_VIEW', true);
        }
      },
    );
  }

  // 处理交易url，如果为预下单，就走新交易
  getPayApiUrl(prepay) {
    const { isWeapp } = this.state.env;
    if (prepay) {
      return {
        cashierRequestUrl: isWeapp
          ? '/wsctrade/pay/wscweapp/payChannels.json'
          : '/wsctrade/pay/wsc/payChannels.json',
        payRequestUrl: isWeapp
          ? '/wsctrade/pay/wscweapp/pay.json'
          : '/wsctrade/pay/wsc/pay.json',
      };
    }
    // 兜底非预下单情况，暂不删除
    return {
      cashierRequestUrl: '/v2/pay/Preorder/query.json',
      payRequestUrl: '/v2/pay/Preorder/pay.json',
    };
  }

  onPayFail(err) {
    const { selectedPayWayData } = this.state.cashier;
    this.$commit('SET_CASHIER_SELECTED_PAY_WAY_DATA', {});

    // 商品改价
    if (err.data && err.data.adjust_price) {
      const res = err.data;
      this.$dialog
        .confirm({
          title: '改价提醒',
          message:
            res.msg ||
            `商家已将交易金额修改为${formatMoney(
              res.new_price,
            )}元,是否继续支付?`,
          confirmButtonText: '继续支付',
        })
        .then(() => {
          const newPayWays = {
            ...selectedPayWayData,
            new_price: res.new_price,
            accept_price: res.accept_price || 1,
          };
          this.onSelectPayWay(newPayWays);
        });
      return;
    }

    const resp = err.resp || {};
    switch (resp.code) {
      // 需要密码
      case 117799001:
      case 117700511:
        this.$commit('SET_CASHIER_SHOW_PASSWORD', true);
        break;
      // 密码错误
      case 117799801:
      case 117701503:
        this.$commit('SET_CASHIER_SHOW_PASSWORD', true);
        this.$toast(err.message || '密码错误');
        break;
      default:
        this.$toast(err.message || '支付失败，请稍候再试');
        break;
    }
  }
}
