<template>
  <div class="invite-wrap">
    <div
      v-if="isShowBtn"
      class="invite-btn"
      @click="onClick"
    >
      <p v-if="maxProfit > 0">
        最高赚￥{{ maxProfit }}
      </p>

      <template v-else>
        <span class="invite-btn__icon-img" />
        <p>分享给好友</p>
      </template>
    </div>

    <van-popup
      v-model="show"
      position="bottom"
      class="invite-pop-wrap"
      :class="pcPop"
    >
      <div class="invite-pop">
        <div class="invite-pop__title">
          请选择优惠方式
          <van-icon
            class="invite-pop__close"
            name="clear"
            color="#dcdde0"
            @click="onDoClose"
          />
        </div>

        <div class="invite-pop__item" @click="onDoSelect(0)">
          <div class="invite-pop__item-info">
            <div class="invite-pop__item-info-desc">
              <p>好友立减</p>
              <span>{{ newerSubsidyPrice | numberToCurrency }}</span>
            </div>
            <div class="invite-pop__item-info-desc">
              <p>同时你获得</p>
              <span>{{ commissionMoney | numberToCurrency }}</span>
            </div>
            <van-icon
              name="checked"
              :class="['invite-pop__item-info-select', selectedType == 0 ? 'theme-color' : '' ]"
            />
          </div>
          <p class="invite-pop__item-tip">
            <span>好友首次下单享立减价，你亦可获得分享佣金</span>
          </p>
        </div>

        <div class="invite-pop__item" @click="onDoSelect(1)">
          <div class="invite-pop__item-info">
            <div class="invite-pop__item-info-desc">
              <p>好友下单，你可得</p>
              <span>{{ fxInfo.distributionMoney / 100 | numberToCurrency }}</span>
            </div>
            <van-icon
              name="checked"
              :class="['invite-pop__item-info-select', selectedType == 1 ? 'theme-color' : '' ]"
            />
          </div>
          <p class="invite-pop__item-tip">
            <span>任何好友下单，你可获得分享佣金</span>
          </p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Popup, Icon } from 'vant';
import UA from 'zan-utils/browser/ua_browser';
import filters from 'common/filters';
// import get from 'lodash/get';
import API from '../../pages/paid-content/api';
import { ZNB } from '@youzan/wxsdk';
import { delurlquery } from 'common/utils/helper';
import * as SafeLink from '@youzan/safe-link';
import compareVersions from '@youzan/utils/string/compareVersions';

const { numberToCurrency } = filters;

/* const ACTIVITY_TYPE = {
  INVITE_FRIEND: 1,
  INVITE_CARD: 2,
  PERSENT_GIFT: 3,
  COLLECT_ZAN: 4,
  RECOMMEND_POLITE: 6
}; */
const numberFloor = (number) => {
  return Math.floor(number);
};
const global = window._global;
const miniprogram = global.miniprogram || {};
const isWeapp = miniprogram.isWeapp;
// 跳转weapp专用字段
const userInfo = global.visBuyer || {};

export default {
  name: 'invite-btn',

  components: {
    'van-popup': Popup,
    'van-icon': Icon,
  },

  filters: {
    numberToCurrency,
  },

  props: {
    fxInfo: Object,
    shareInfo: Object,
    referralInfo: Object,
    isPaid: [Number, Boolean],
    extendInfo: Object,
    owlType: Number,
  },

  data() {
    return {
      show: false,
      selectedType: -1,
      isSupportFx: false,
      isSupportRefferal: false,
      commissionMoney: 0,
      newerSubsidyPrice: 0,
      maxProfit: 0,
      isShowBtn: true,
    };
  },

  computed: {
    pcPop() {
      return !UA.isMobile() ? 'pc-pop' : '';
    },
  },

  mounted() {
    this.initInviteBtn(); // 百度小程序内分分销员屏蔽分享给好友按钮
    this.formatData();
  },

  methods: {
    initInviteBtn() {
      ZNB.getEnv().then(env => {
        if (env.platform === 'swan') {
          API.postRegister({})
            .then(({ status }) => {
              this.isShowBtn = Boolean(status === 1);
            });
        }
      });
    },
    formatData() {
      this.isSupportFx = Boolean(this.fxInfo.isDistribution);
      this.isSupportRefferal = this.isPaid;
      if (this.isSupportRefferal) {
        this.computeReferralPrice();
        this.commissionMoney = numberFloor((this.referralInfo.recommendPoliteCourse.maxCommissionMoney || 0) / 100);
        this.newerSubsidyPrice = numberFloor((this.referralInfo.recommendPoliteCourse.maxNewerSubsidyPrice || 0) / 100);
      }
      this.computeMaxProfit();
    },
    // 删除webview的敏感信息
    filterSensitiveInfo(url) {
      let delSidUrl = delurlquery(url, 'sid');
      let delAccessTokenUrl = delurlquery(delSidUrl, 'accessToken');
      let delAppIdUrl = delurlquery(delAccessTokenUrl, 'appId');
      let delOpenIdUrl = delurlquery(delAppIdUrl, 'openId');
      let delWeappUrl = delurlquery(delOpenIdUrl, 'isWeapp');

      return delWeappUrl;
    },

    computeReferralPrice() {
      this.commissionMoney =
        this.referralInfo.isCourseUmp
          ? numberFloor((this.referralInfo.recommendPoliteCourse.maxCommissionMoney || 0) / 100)
          : numberFloor((this.referralInfo.commissionMoney || 0) / 100);
      this.newerSubsidyPrice =
      this.referralInfo.isCourseUmp
        ? numberFloor((this.referralInfo.recommendPoliteCourse.maxNewerSubsidyPrice || 0) / 100)
        : numberFloor((this.referralInfo.commissionMoney || 0) / 100);
    },

    computeMaxProfit() {
      const fxProfit = this.fxInfo.distributionMoney || 0;
      if (this.isSupportRefferal) {
        // 此处判断是否为课程商品，后面会将知识付费的入口收敛进来
        const refferalProfit =
        this.referralInfo.isCourseUmp
          ? this.referralInfo.recommendPoliteCourse.maxCommissionMoney
          : this.referralInfo.commissionMoney;
        this.maxProfit = refferalProfit > fxProfit ? numberFloor(refferalProfit / 100) : (fxProfit / 100).toFixed(2);
      } else {
        this.maxProfit = (fxProfit / 100).toFixed(2);
      }
    },

    onClick() {
      if (this.isSupportFx && this.isSupportRefferal) {
        // 既支持分销，也支持推荐有礼
        this.show = true;
        return;
      }
      if (this.isSupportRefferal) {
        this.toRefferal();
      } else {
        this.toFxInvite();
      }
    },

    // 多页面重定向
    // 前往卡片生成页面
    toFxInvite() {
      try {
        // 订阅消息迁回原生并且原生代码有改动需要判断小程序版本号（>2.46.1）
        if (isWeapp && compareVersions(global.weappVersion, '2.46.1') > 0) {
          const redirectH5 = `${global.url.h5}/wscvis/edu/prod-detail?kdt_id=${global.kdt_id}&alias=${this.shareInfo.alias}`;
          const weappUrl = `/packages/paidcontent/invite-card/index?title=${this.shareInfo.title}&alias=${this.shareInfo.alias}&avatarUrl=${userInfo.finalAvatar}&nickName=${userInfo.finalUsername}&isDistribution=${this.fxInfo.isDistribution}&distributionMoney=${this.fxInfo.distributionMoney}&redirectH5=${encodeURIComponent(redirectH5)}`;
          ZNB.navigate({
            weappUrl,
          });
        } else {
          let reUrl = `${global.url.h5}/wscvis/ump/invite-card?alias=${this.shareInfo.alias}&kdt_id=${global.kdt_id}&owlType=${this.owlType}`;
          SafeLink.redirect({
            url: reUrl,
            kdtId: global.kdt_id,
          });
        }
      } catch (err) {
        let reUrl = `${global.url.h5}/wscvis/ump/invite-card?alias=${this.shareInfo.alias}&kdt_id=${global.kdt_id}&owlType=${this.owlType}`;
        SafeLink.redirect({
          url: reUrl,
          kdtId: global.kdt_id,
        });
      }
    },

    // 多页面重定向（待处理）
    // 前往推荐有礼邀请页面
    toRefferal() {
      try {
        if (isWeapp && compareVersions(global.weappVersion, '2.46.1') > 0) {
          const redirectH5 = `${global.url.h5}/wscvis/edu/prod-detail?kdt_id=${global.kdt_id}&alias=${this.shareInfo.alias}`;
          const weappUrl = `/packages/paidcontent/referral-invite/index?title=${this.shareInfo.title}&alias=${this.shareInfo.alias}&avatarUrl=${userInfo.finalAvatar}&nickName=${userInfo.finalUsername}&price=${this.shareInfo.skuFormatModel.minPrice}&redirectH5=${encodeURIComponent(redirectH5)}`;
          ZNB.navigate({
            weappUrl,
          });
        } else {
          const reUrl = `/wscvis/knowledge/index?
            alias=${this.shareInfo.alias}&kdt_id=${global.kdt_id}&page=referralinvite
            &title=${this.shareInfo.title}&price=${this.shareInfo.skuFormatModel.minPrice || 0}&mediaType=10`;
          SafeLink.redirect({
            url: reUrl,
            kdtId: global.kdt_id,
          });
        }
      } catch (err) {
        const reUrl = `/wscvis/knowledge/index?
          alias=${this.shareInfo.alias}&kdt_id=${global.kdt_id}&page=referralinvite
          &title=${this.shareInfo.title}&price=${this.shareInfo.skuFormatModel.minPrice || 0}&mediaType=10`;
        SafeLink.redirect({
          url: reUrl,
          kdtId: global.kdt_id,
        });
      }
    },

    onDoClose() {
      this.show = false;
      this.selectedType = -1;
    },

    onDoSelect(type) {
      this.selectedType = type;
      setTimeout(() => {
        type === 0 ? this.toRefferal() : this.toFxInvite();
      }, 500);
    },
  },
};
</script>

<style lang="scss">
  @import 'mixins/index.scss';
  @import 'var';

  .invite-btn {
    position: fixed;
    right: 0;
    bottom: 100px;
    z-index: 999;
    display: flex;
    height: 30px;
    padding: 0 10px;
    font-size: 12px;
    color: #333;
    background-color: #fff;
    border-bottom-left-radius: 20px;
    border-top-left-radius: 20px;
    box-shadow: 0 0 5px #d0cdcd;
    align-items: center;

    &__icon-img {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 5px;
      vertical-align: middle;
      background-image: url(https://img01.yzcdn.cn/pct/images/invite-white@2x.png), linear-gradient(#00b389, #00b389);
      background-size: cover;
      background-blend-mode: lighten;
    }

    &__name {
      color: #333;
    }

    &__money {
      font-size: 16px;
      color: #333;
    }
  }

  .invite-pop-wrap {
    max-height: 80%;
    min-height: 50%;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
  }

  .invite-pop {
    padding: 0 20px;

    &__title {
      position: relative;
      padding: 15px 0;
      font-size: 16px;
      font-weight: 500;
      color: #323233;
      text-align: center;
    }

    &__close {
      position: absolute;
      top: 12px;
      right: 0;
      display: initial;
      font-size: 22px;
      color: $c-gray-dark;
    }

    &__item {
      height: 105px;
      margin: 15px auto 20px;
      border: 1px solid #bbb;
      border-radius: 4px;

      &-info {
        position: relative;
        display: flex;
        height: 70px;
        padding: 0 20px;
        line-height: 70px;

        &-desc {
          display: flex;
          width: 50%;
          padding: 16px 0;
          margin-right: 16px;
          color: $c-black;
          flex-direction: column;

          p {
            font-size: 12px;
            line-height: 17px;
          }

          span {
            font-size: 20px;
            line-height: 24px;
          }
        }

        &-select {
          position: absolute;
          top: 50%;
          right: 12px;
          margin-top: -10px;
          font-size: 20px;
          color: #e5e5e5;
        }
      }

      &-tip {
        height: 35px;
        margin: 0 16px;
        font-size: 13px;
        line-height: 35px;
        color: $c-gray-dark;
        border-top: 1px dashed #d8d8d8;
      }
    }
  }

  .pc-pop {
    width: 375px !important;
  }

  @media screen and (max-width: 340px) {
    .invite-pop__item:nth-child(2) {
      .invite-pop {
        &__item-info-desc {
          height: 35px;
          font-size: 13px;
          line-height: 35px;

          span {
            font-size: 18px;
          }
        }

        &__item-tip {
          font-size: 11px;
        }
      }
    }
  }
</style>
