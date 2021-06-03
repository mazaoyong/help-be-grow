<template>
  <van-popup v-model="show" class="coupons-popup">
    <div class="coupons">
      <img class="coupons-bg-a" src="https://img01.yzcdn.cn/punch/image/coupon-bg-a@2x.png">
      <img class="coupons-bg-b" src="https://img01.yzcdn.cn/punch/image/coupon-bg-b@2x.png">
      <div class="coupons__close" @click="onClose" />
      <div class="coupons__title">
        已完成打卡任务
      </div>
      <div class="coupons__subtitle">
        获得以下奖励
      </div>
      <div class="coupons__list">
        <coupon
          v-for="(item, index) in coupons"
          :key="index"
          :type="item.type"
          :coupon-type="item.couponType"
          :title="item.title"
          :count="item.count"
          :description="item.description"
          :no-expiration="item.noExpiration"
          :start-date="item.startDate"
          :end-date="item.endDate"
        />
      </div>
      <div class="coupons__button" @click="onGoDetail">
        {{ btnText || '查看详情' }}
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Popup } from 'vant';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';

import { REWARD_TYPE } from 'supv/punch/constants';
import Coupon from './coupon';

export default {
  name: 'coupons-popup',

  components: {
    'van-popup': Popup,
    Coupon,
  },

  props: {
    show: Boolean,
    coupons: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  computed: {
    btnText() {
      if (this.coupons.length === 1) {
        return this.coupons[0].type === 1 ? '查看优惠券' : '查看积分';
      }
      return '查看详情';
    },
  },

  methods: {
    onClose() {
      this.$emit('close');
    },

    onGoDetail() {
      const { coupons = [] } = this;
      let url = '';

      if (coupons.length === 2) {
        url = '/wscuser/membercenter';
      } else if (coupons[0] && coupons[0].type === REWARD_TYPE.COUPON) {
        url = '/wscump/coupon/collection';
      } else {
        url = '/wscump/pointstore/pointcenter';
      }
      const kdtId = window._global.kdt_id;
      url += `?kdt_id=${kdtId}`;

      SafeLink.redirect({
        url: buildUrl(url, 'h5', kdtId),
        kdtId,
      });
    },
  },
};
</script>

<style lang="scss">
.coupons-popup {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // position: fixed;
  // top: 0;
  // bottom: 0;
  // left: 0;
  // right: 0;
  // z-index: 1200;
  // background: rgba(0, 0, 0, .7);

  &.van-popup {
    overflow-y: visible;
    background: transparent;
  }

  .coupons {
    position: relative;
    width: 295px;
    padding: 15px 0;
    text-align: center;
    background: linear-gradient(to bottom, #ff6c0a, #e58509);
    border-radius: 8px;
    flex: 0 0 auto;

    &__close {
      position: absolute;
      top: -94px;
      right: 0;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, .1);
      border: 1px solid rgba(255, 255, 255, .3);
      border-radius: 50%;
      box-sizing: border-box;

      &::after {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 10px;
        height: 10px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAW1JREFUOBG1lD1Ow0AQRm0IRFwnHUJykSYlF6FBuUNEkwJugEQRfqSIK1iiisRd0kQpAOd9q0wY27sbUTDSF+/OzL6dHa9TFP9pTdOco9O/7sGaATprrcNxjd7RM7pqBTMTcsfoDS3RpFQugyGPF3SiOfaD5mVZ1mGW+BGA0I0Lbw3whXPrAvJPWVA5X2sYgSm+CUAq+WbygFSZWRKagKmoe6uwAPqBY46y0AxsBuMz9NBK0nN/zCnDw2aMQ095XiDfM6aFKhNspUkPKGcG6jdRagsmRxSoQAKqkFkPpkASqGAGGoVpTfcI8nlTz2I58inWs2SFVNe9tN3F4UXxMmofiO2uo8ZgOmb2SgncA2ZgM/KP3tOBqGY5mN0zcpTu76mK0meqj6M+9BDHmMCtsp1F3ya5FTkeqiVqx10AkqBKF0j/OmZRmAUT0LX1UGD/x5qFCbp/u92e/raQHSfoFT2ikVVy7EnuJXpCC1TtAEtbzLucXZs3AAAAAElFTkSuQmCC) no-repeat;
        background-size: 10px 10px;
        content: '';
      }
    }

    &__title {
      font-size: 24px;
      font-weight: 700;
      line-height: 33px;
      color: #fff;
    }

    &__subtitle {
      font-size: 12px;
      line-height: 18px;
      color: #fff;
    }

    &__list {
      max-height: 182px;
      overflow: auto;
    }

    &__button {
      width: 265px;
      height: 42px;
      margin: 15px auto 0;
      font-size: 16px;
      font-weight: 700;
      line-height: 42px;
      color: #ff300b;
      text-align: center;
      background: linear-gradient(to bottom, #ffe625, #ffc910);
      border-radius: 21px;
    }

    &-bg-a {
      position: absolute;
      top: -57px;
      left: 12px;
      z-index: -1;
      display: block;
      width: 272px;
      height: 97px;
    }

    &-bg-b {
      position: absolute;
      top: -37px;
      left: 17px;
      display: block;
      width: 260px;
      height: 93px;
    }
  }
}
</style>
