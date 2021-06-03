import Vue from 'vue';
import { Toast } from 'vant';
import { isBranchStore } from '@youzan/utils-shop';
import ua from '@youzan/utils/browser/ua_browser';
import { getMpFollowStatus } from '../../common-api/utils/index';
import mpQrcodeComponent from '../../components/mp-qrcode';
import { login } from '../mixins/mixin-vis-page/setters/set-user';

/**
 * 检查购物门槛
 */
let _didLogin = false; // whether login in this process
export default function checkFansBuy({
  didLogin = false,
  productId = 0,
  buyTip,
} = {}) {
  didLogin = didLogin || _didLogin;

  const _checkMpFollowStatus = (resolve, reject) => {
    getMpFollowStatus()
      .then(res => {
        if (res.isFollow) {
          resolve({ didLogin });
        } else {
          showMPQrcode(productId, buyTip);
          reject({
            code: -1001,
            message: '未关注公众号',
          });
        }
      })
      .catch(() => {
        Toast('获取公众号关注状态失败');
        reject({
          code: -200,
          message: '接口错误：获取公众号关注状态失败',
        });
      });
  };

  return new Promise((resolve, reject) => {
    // 小程序环境屏蔽购物门槛检查
    if (_global.miniprogram && _global.miniprogram.isMiniProgram) {
      resolve({ didLogin });
      return;
    }

    const { shopConfigs = {} } = window._global;
    const {
      no_fans_buy: noFansBuy = 0,
      weixin_no: weixinNo = 0,
      weixin_pay: weixinPay = 0,
      weixin_server: weixinServer = 0, // 认证服务号
      only_fans_buy_channel: onlyFansBuyChannel = 0, // 仅限粉丝购买渠道配置 0: 所有渠道；1：微信渠道
    } = shopConfigs;

    const channelIsShowFansLimit = +noFansBuy &&
       ((+onlyFansBuyChannel === 1 && ua.isWeixin()) || +onlyFansBuyChannel === 0);

    if (channelIsShowFansLimit && (isBranchStore || (!+weixinNo && +weixinServer && +weixinPay))) {
      if (!didLogin && window._global.need_ajax_login) {
        setTimeout(() => {
          login(() => {
            _didLogin = true;
            _checkMpFollowStatus(resolve, reject);
          });
        }, 500);
      } else {
        _checkMpFollowStatus(resolve, reject);
      }
    } else {
      resolve({ didLogin });
    }
  });
};

const ctrId = 'mp-qrcode-container';
const anchorId = 'mp-qrcode-anchor';
export function showMPQrcode(productId = 0, buyTip) {
  const mpQrcodeContainer = document.createElement('div');
  mpQrcodeContainer.id = ctrId;
  const mpQrcodeAnchor = document.createElement('div');
  mpQrcodeAnchor.id = anchorId;
  mpQrcodeContainer.appendChild(mpQrcodeAnchor);
  document.body.appendChild(mpQrcodeContainer);

  const unmountMPQrcode = () => {
    document.body.removeChild(mpQrcodeContainer);
  };

  // eslint-disable-next-line
  new Vue({
    el: `#${anchorId}`,
    render: h => h(mpQrcodeComponent, {
      props: {
        pushMessage: true,
        productId, // 因为会员权益拿不到商品 id，故不推送商品链接
        mpId: window._global.mp_account.id || 0,
        buyTip,
      },
      on: {
        'close'() {
          return unmountMPQrcode();
        },
      },
    }),
  });
}
