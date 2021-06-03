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
        <p class="invite-btn__name">
          分享给好友
        </p>
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
            @click="onInvitePopClose"
          />
        </div>

        <div class="invite-pop__item" @click="onInvitePopSelect(0)">
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
            好友首次下单享立减价，你亦可获得分享佣金
          </p>
        </div>

        <div class="invite-pop__item" @click="onInvitePopSelect(1)">
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
            任何好友原价下单，你可获得分享佣金
          </p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Popup, Icon } from 'vant';
import { get } from 'lodash';
import UA from 'zan-utils/browser/ua_browser';
import { ACTIVITY_TYPE } from 'pct/constants';
import { numberFloor } from 'pct/utils';
import API from '../api';
import { ZNB } from '@youzan/wxsdk';
import * as SafeLink from '@youzan/safe-link';
import compareVersions from '@youzan/utils/string/compareVersions';

const global = window._global;
const miniprogram = global.miniprogram || {};
const isWeapp = miniprogram.isWeapp;
// 跳转weapp专用字段
const userInfo = global.visBuyer || {};

export default {
  name: 'invite-btn',

  components: {
    'van-icon': Icon,
    'van-popup': Popup,
  },

  props: {
    fxInfo: Object,
    shareInfo: Object,
    referralInfo: Object,
    isPaid: [Number, Boolean],
    owlType: [Number],
  },

  data() {
    return {
      show: false,
      selectedType: -1,
      isShowBtn: true,
    };
  },

  computed: {
    pcPop() {
      return !UA.isMobile() ? 'pc-pop' : '';
    },

    isSupportFx() {
      return Boolean(this.fxInfo.isDistribution);
    },

    isSupportRefferal() {
      return this.isPaid && this.referralInfo.channelType === ACTIVITY_TYPE.RECOMMEND_POLITE;
    },

    commissionMoney() {
      const commissionMoney = get(this.referralInfo, 'commissionMoney') || 0;
      return Number(commissionMoney / 100).toString().match(/(\d+(\.\d{1,2})?)(\d+)?/)[1];
    },

    newerSubsidyPrice() {
      const newerSubsidyPrice = get(this.referralInfo, 'newerSubsidyPrice') || 0;
      return Number(newerSubsidyPrice / 100).toString().match(/(\d+(\.\d{1,2})?)(\d+)?/)[1];
    },

    maxProfit() {
      const refferalProfit = get(this.referralInfo, 'commissionMoney') || 0;
      const fxProfit = get(this.fxInfo, 'distributionMoney') || 0;
      if (this.isPaid) {
        return refferalProfit > fxProfit
          ? numberFloor(refferalProfit / 100)
          : (fxProfit / 100).toFixed(2);
      }
      return (fxProfit / 100).toFixed(2);
    },
  },

  mounted() {
    this.initInviteBtn(); // 百度小程序内分分销员屏蔽分享给好友按钮
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

    // 前往卡片生成页面
    toFxInvite() {
      try {
        // 订阅消息迁回原生并且原生代码有改动需要判断小程序版本号（>2.46.1）
        if (isWeapp && compareVersions(global.weappVersion, '2.46.1') > 0) {
          let page = 'columnshow';
          if (this.owlType === 2) {
            page = 'contentshow';
          }
          const redirectH5 = `${global.url.h5}/wscvis/knowledge/index?kdt_id=${global.kdt_id}&alias=${this.shareInfo.alias}&page=${page}`;
          const weappUrl = `/packages/paidcontent/invite-card/index?title=${this.shareInfo.title}&alias=${this.shareInfo.alias}&avatarUrl=${userInfo.finalAvatar}&nickName=${userInfo.finalUsername}&isDistribution=${this.fxInfo.isDistribution}&distributionMoney=${this.fxInfo.distributionMoney}&redirectH5=${encodeURIComponent(redirectH5)}`;
          ZNB.navigate({
            weappUrl,
          });
        } else {
          SafeLink.redirect({
            url: `${global.url.h5}/wscvis/ump/invite-card?alias=${this.shareInfo.alias}&kdt_id=${global.kdt_id}&owlType=${this.owlType}`,
            kdtId: global.kdt_id,
          });
        }
      } catch (err) {
        SafeLink.redirect({
          url: `${global.url.h5}/wscvis/ump/invite-card?alias=${this.shareInfo.alias}&kdt_id=${global.kdt_id}&owlType=${this.owlType}`,
          kdtId: global.kdt_id,
        });
      }
    },

    // 前往推荐有礼邀请页面
    toRefferal() {
      try {
        if (isWeapp && compareVersions(global.weappVersion, '2.46.1') > 0) {
          let page = 'columnshow';
          if (this.owlType === 2) {
            page = 'contentshow';
          }
          const redirectH5 = `${global.url.h5}/wscvis/knowledge/index?kdt_id=${global.kdt_id}&alias=${this.shareInfo.alias}&page=${page}`;
          const weappUrl = `/packages/paidcontent/referral-invite/index?title=${this.shareInfo.title}&alias=${this.shareInfo.alias}&avatarUrl=${userInfo.finalAvatar}&nickName=${userInfo.finalUsername}&distributionMoney=${this.shareInfo.price}&redirectH5=${encodeURIComponent(redirectH5)}`;
          ZNB.navigate({
            weappUrl,
          });
        } else {
          this.$router.push({
            name: 'ReferralInvite',
            query: {
              alias: this.shareInfo.alias,
              mediaType: this.shareInfo.mediaType || 0,
              title: this.shareInfo.title || '',
              price: this.shareInfo.price,
            },
          });
        }
      } catch (err) {
        this.$router.push({
          name: 'ReferralInvite',
          query: {
            alias: this.shareInfo.alias,
            mediaType: this.shareInfo.mediaType || 0,
            title: this.shareInfo.title || '',
            price: this.shareInfo.price,
          },
        });
      }
    },

    onInvitePopClose() {
      this.show = false;
      this.selectedType = -1;
    },

    onInvitePopSelect(type) {
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
    bottom: 112px;
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
