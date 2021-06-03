<template>
  <popup
    v-model="visible"
    :buttons="buttons"
    title="促销"
    close-on-click-overlay
  >
    <div class="promotion-popup">
      <section
        v-if="isValidArray(optimalCoupons)"
        class="box-item activity-item"
      >
        <div class="title">
          <span>使用以下优惠预计券后</span>
          <vis-price-label
            class="title-price"
            font-size="16"
            :active-color="mainColor"
            :price="optimalPrice"
          />
          <span v-if="isRangePrice">起</span>
        </div>
        <template>
          <cap-coupon
            v-for="coupon in selectOneOrMany(!moreBestCouponVisible, optimalCoupons)"
            :key="coupon.id"
            :coupon="coupon"
            :theme-type="themeType"
            :btn-text="coupon.btnText"
            :btn-icon="false"
            display-type="flat"
          >
            <template slot="B">
              <cap-coupon-button
                v-if="!coupon.isReceived"
                :btn-icon="false"
                :btn-text="coupon.btnText"
                @click="handleReceiveCoupon(coupon)"
              />
              <cap-coupon-stamp
                v-else
                visible
                :theme-type="themeType"
              />
            </template>
          </cap-coupon>
        </template>

        <div
          v-if="hasMoreOptimalCoupons && !moreBestCouponVisible"
          class="more"
          @click="displayMoreBestCoupon"
        >
          <span>更多推荐优惠券</span>
          <van-icon name="arrow" />
        </div>
      </section>

      <section
        v-if="presentInfo"
        class="box-item present-item-temp"
      >
        <div class="title">
          <span>赠品</span>
        </div>
        <div @click="handleClick">
          <cap-coupon
            v-if="isValidArray(presentInfo.goods)"
            :coupon="presentInfo"
            display-type="flat"
            :theme-type="themeType"
            class="gift-coupon"
          >
            <template slot="B">
              <van-icon
                name="arrow"
                :color="mainColor"
              />
            </template>
            <template slot="C2">
              <div class="goods-box">
                <div
                  v-for="(good, index) in firstTwo(presentInfo.goods)"
                  :key="index"
                  class="good-item"
                >
                  <img-wrap
                    width="96px"
                    height="54px"
                    fullfill="!small.jpg"
                    :src="good.imageUrl"
                    :cover="false"
                  />

                  <div class="good-price">
                    ￥{{ good.price }}
                  </div>
                </div>
              </div>
            </template>
          </cap-coupon>

          <cap-coupon
            v-else
            :coupon="presentInfo"
            display-type="flat"
            :theme-type="themeType"
          >
            <template slot="B">
              <van-icon
                name="arrow"
                :color="mainColor"
              />
            </template>
          </cap-coupon>
        </div>
      </section>

      <section
        v-if="isValidArray(otherCoupons)"
        class="box-item coupon-item"
      >
        <div class="title">
          <span>优惠券</span>
        </div>
        <cap-coupon
          v-for="coupon in otherCoupons"
          :key="coupon.id"
          :coupon="coupon"
          :btn-icon="false"
          :btn-text="coupon.btnText"
          :theme-type="themeType"
          display-type="flat"
        >
          <template slot="B">
            <cap-coupon-button
              v-if="!coupon.isReceived"
              :btn-icon="false"
              :btn-text="coupon.btnText"
              @click="handleReceiveCoupon(coupon)"
            />
            <cap-coupon-stamp
              v-else
              visible
              :theme-type="themeType"
            />
          </template>
        </cap-coupon>
      </section>
      <div
        v-if="isValidArray(optimalCoupons)"
        class="coupon-tip"
      >
        <span>券后价格仅为初步预估，最终购买价格以实际支付为准</span>
      </div>
      <popup v-model="showLoginModal">
        <login-pop :after-login-cb="handleAfterLogin" />
      </popup>
    </div>
  </popup>
</template>

<script>
// 由于使用 store ，命令式的 popup 暂时还不能连接 store ，所以这里用声明式组件
import { get, uniqBy } from 'lodash';
import { Icon, Button } from 'vant';
import format from '@youzan/utils/money/format';
import { Popup, ImgWrap, PriceLabel } from '@youzan/vis-ui';
import log from '@/pages/course/detail/utils/log';
import { Coupon } from '@youzan/captain';
import { COUPON_STATUS } from '@/constants/course/coupon-status';
import { fns, getThemeColor } from '@youzan/vue-theme-plugin';
import LoginPop from '@/shared/components/login-pop';
import { mapActions } from 'vuex';
import { themeTypeMap } from 'common/constants';

import PresentPopup from '../present-popup';
import {
  formatCoupon,
  formatScoreToCoupon,
  formatGood,
  formatPresentCoupon,
} from './utils';

const { CouponButton, CouponStamp } = Coupon;

const openPresentPopup = Popup.getOpenPopup(PresentPopup, {
  props: {
    title: '买赠',
    buttons: [
      {
        text: '我知道了',
        color: getThemeColor('main'),
        onClick: (ctx) => {
          ctx.$emit('resolve');
        },
      },
    ],
  },
});

export default {
  components: {
    'van-icon': Icon,
    [Button.name]: Button,
    ImgWrap,
    Popup,
    [Coupon.name]: Coupon,
    [CouponButton.name]: CouponButton,
    [CouponStamp.name]: CouponStamp,
    [LoginPop.name]: LoginPop,
    'vis-price-label': PriceLabel,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      themeType: themeTypeMap[_global.themeType || 0],
      moreBestCouponVisible: false,
      presentPopupVisible: false,
      showLoginModal: false,
      COUPON_STATUS: { ...COUPON_STATUS },
    };
  },

  rootState: [
    'activityData',
    'goodsCoupons',
    'user',
    'goodsData',
    'shopConfig',
  ],
  rootGetters: [
    'meetReduceDescription',
    'meetReduceCouponDesc',
    'meetReduceScoreDesc',
  ],
  rootActions: ['receiveCoupon'],

  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        if (!val) {
          log({
            et: 'custom',
            ei: 'promotion_close',
            en: '关闭促销弹窗',
          });
        }
        this.$emit('input', val);
      },
    },

    isLogin() {
      return !!(this.user && this.user.hasLogin);
    },

    state() {
      return get(this.activityData, 'meetReduce', {});
    },

    goodsList() {
      return get(this.state, 'presentInfoList[0].presentGoodsList', []);
    },

    buttons() {
      return [
        {
          text: '完成',
          color: this.$theme.colors.main,
          onClick: () => {
            this.$emit('input', false);
          },
        },
      ];
    },

    mainColor() {
      return this.$theme.colors.main;
    },
    couponUnvaliableBackColor() {
      return fns.hexToRgba(this.$theme.colors.main, 0.3);
    },
    isRangePrice() {
      let skuOptimalCoupons = get(
        this.activityData,
        'coupon.skuPreferenceList',
        [],
      );
      if (skuOptimalCoupons.length <= 1) {
        return false;
      }
      const totalPreferentialPrice = skuOptimalCoupons.map(
        (item) => item.preferentialPrice || 0,
      );
      const uniqPrices = Array.from(new Set(totalPreferentialPrice));
      if (uniqPrices.length <= 1) return false;
      return true;
    },
    optimalPrice() {
      const preferentialPrice = get(
        this.activityData,
        'coupon.optimalSkuPreference.preferentialPrice',
        0,
      );
      return preferentialPrice;
    },

    totalCoupons() {
      if (!Array.isArray(this.goodsCoupons)) return [];
      return this.goodsCoupons.map((d) => formatCoupon(d));
    },
    skuOptimalCouponIds() {
      let skuOptimalCoupons = get(
        this.activityData,
        'coupon.skuPreferenceList',
        [],
      );
      let skuOptimalCouponIds = uniqBy(skuOptimalCoupons, 'activityId').map(
        (d) => d.activityId,
      );
      return skuOptimalCouponIds;
    },
    groupCoupons() {
      let optimalCoupons = [];
      let otherCoupons = [];
      this.totalCoupons.forEach((coupon) => {
        if (this.skuOptimalCouponIds.includes(coupon.id)) {
          optimalCoupons.push(coupon);
        } else {
          otherCoupons.push(coupon);
        }
      });
      return { optimalCoupons, otherCoupons };
    },
    optimalCoupons() {
      return this.groupCoupons.optimalCoupons;
    },

    otherCoupons() {
      return this.groupCoupons.otherCoupons;
    },

    hasMoreOptimalCoupons() {
      return this.optimalCoupons.length > 1;
    },
    presentInfoMap() {
      const {
        score,
        presentInfoList,
        couponId,
        ...restCouponData
      } = this.state;
      const res = {};
      let scoreInfo, couponInfo;

      if (couponId) {
        couponInfo = formatPresentCoupon(
          { couponId, ...restCouponData },
          this.meetReduceCouponDesc,
        );
        Object.assign(res, { coupon: couponInfo });
      }

      if (score) {
        scoreInfo = formatScoreToCoupon({
          score,
          name: this.meetReduceScoreDesc,
          unit: this.shopConfig.pointsName,
        });
        Object.assign(res, { score: scoreInfo });
      }

      if (presentInfoList && presentInfoList.length) {
        const goods = get(presentInfoList, ['0', 'presentGoodsList'], []).map(
          formatGood,
        );
        if (goods.length) {
          // TODO title compose
          const goodInfo = {
            id: 'goodInfo',
            value: '课程大礼包',
            name: this.meetReduceDescription,
            unit: '',
            goods, // [{ imageUrl: '', num: 1, presentPrice: 9900, title: '', url }]
          };
          Object.assign(res, { good: goodInfo });
        }
      }
      return res;
    },
    presentInfo() {
      const {
        score: scoreInfo,
        coupon: couponInfo,
        good: goodInfo,
      } = this.presentInfoMap;
      let res;
      // no good
      if (!goodInfo) {
        if (couponInfo && scoreInfo) {
          // coupon and score
          const scoreAndCouponInfo = {
            id: 'scoreAndCoupon',
            value: '课程大礼包',
            unit: '',
            name: this.meetReduceDescription,
          };
          return scoreAndCouponInfo;
        } else if (couponInfo) {
          // only coupon
          return couponInfo;
        } else if (scoreInfo) {
          // only score
          return scoreInfo;
        }
      } else {
        // 赠品包含商品
        return goodInfo;
      }
      return res;
    },
  },

  methods: {
    ...mapActions(['receiveCoupon']),
    format(money) {
      return format(money);
    },
    isValidArray(val) {
      return Array.isArray(val) && val.length;
    },
    firstTwo(data) {
      return data.slice(0, 2);
    },
    selectOneOrMany(isOne, data) {
      if (!isOne) {
        return data;
      }
      return [data[0]];
    },

    handleClick() {
      openPresentPopup({ props: { presentInfo: this.presentInfoMap } });
    },
    handleAfterLogin() {},

    handleReceiveCoupon({ id: couponId, isReceived }) {
      if (isReceived) return;
      this.receiveCoupon({ couponId });
    },
    displayMoreBestCoupon() {
      this.moreBestCouponVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.promotion-popup {
  padding: 16px;

  .gift-coupon {
    ::v-deep .cap-couponbox__block-content {
      padding: 12px 8px;
    }
    ::v-deep .cap-couponbox__block-discount {
      padding-left: 16px;
    }
  }

  .box-item {
    margin-bottom: 18px;
    .title {
      display: flex;
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
      color: $main-text-color;
      margin-bottom: 8px;
    }
    .title-price {
      margin: 0 2px;
      ::v-deep .pl-int-number-1 {
        font-family: Avenir;
      }
    }
  }

  .coupon-tip {
    margin-top: 20px;
    font-size: 12px;
    text-align: center;
    color: $disabled-color;
  }

  .more {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $disabled-color;
    font-size: 12px;
    height: 17px;
    margin-top: 16px;
    margin-bottom: 24px;
  }

  .present-item-temp {
    ::v-deep .cap-couponbox__block-action {
      min-width: 22px;
    }
  }

  .goods-box {
    display: flex;

    .good-item {
      margin-right: 4px;
      position: relative;
      border-radius: 4px;
      overflow: hidden;

      .good-price {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        color: #ffffff;
        line-height: 16px;
        font-size: 12px;
        font-weight: bold;
        background-color: rgba($color: #000000, $alpha: 0.24);
      }
    }
  }
}
</style>
