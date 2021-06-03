<template>
  <div class="award award-ticket">
    <i
      class="award__status-icon"
      :class="[{
        'award__status-icon-1': status === 4,
        'award__status-icon-2': status !== 1 && status !== 4,
      }]"
    />
    <template>
      <div
        v-if="type === 1"
        class="award__left"
      >
        <span
          class="award__number"
          :style="{
            'font-size': money.numberLength >= 6 ? '20px' : '32px'
          }"
        >{{ money.intPart }}</span>
        <i
          class="award__unit"
          :style="{
            'top': money.numberLength >= 6 ? '2px' : '6px'
          }"
        >{{ money.decimalPart }}{{ unit }}</i>
      </div>
      <div
        v-else-if="type === 2"
        class="award__left"
      >
        <span class="award__number">{{ number }}</span>
        <i class="award__unit">{{ unit }}</i>
      </div>
    </template>
    <div class="award__right">
      <span class="award__label">{{ label }}</span>
      <div class="award__bottom">
        <div class="award__descs">
          <p class="award__desc">{{ desc }}</p>
          <p v-if="campus" class="award__desc">{{ `· ${campus}` }}</p>
          <p class="award__desc">{{ date }}</p>
        </div>
        <van-botton
          v-if="status === 1"
          class="award__btn"
          type="primary"
          size="mini"
          @click="getAward('TICKET')"
        >
          马上领取
        </van-botton>
        <span
          v-else-if="status === 32"
          class="award__btn award__btn-text"
        >已使用</span>
        <van-botton
          v-else-if="status === 3"
          class="award__btn"
          type="primary"
          plain
          size="mini"
          @click="linkTicket"
        >
          去使用
        </van-botton>
        <span
          v-else-if="status === 4"
          class="award__btn award__btn-text"
        >已失效</span>
        <span
          v-else
          class="award__btn award__btn-text"
        >已领取</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Toast } from 'vant';
import getAward from '../mixin/getAward.js';
import api from '../../../api';
import * as SafeLink from '@youzan/safe-link';

export default {
  components: {
    'van-botton': Button,
  },
  mixins: [getAward],
  props: {
    label: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    campus: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    unit: {
      type: String,
      default: '',
    },
    number: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
    },
    jumpUrl: {
      type: String,
      default: '',
    },
    type: {
      type: Number,
      default: undefined,
    },
    kdtId: {
      type: Number,
    },
    couponId: {
      type: Number,
    },
  },
  data() {
    return {};
  },
  computed: {
    /**
     * 金额优惠券
     */
    money() {
      const { number } = this;
      const numberStr = number.toString();
      const numberLength = numberStr.length;
      const [ intPart, decimalPart ] = numberStr.split('.');
      return {
        intPart,
        decimalPart: decimalPart ? `.${decimalPart}` : '',
        numberLength,
      };
    },
  },
  methods: {
    linkTicket() {
      api.getCouponRedirect({
        couponId: this.couponId,
      }).then(res => {
        SafeLink.redirect({
          url: res.h5Url || this.jumpUrl,
        });
      }).catch(errMsg => {
        Toast.fail(errMsg || '网络错误，请稍后重试');
      });
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.award-ticket {
  padding-left: 0 !important;
  .award__left{
    width: 100.5px;
    border-right: 1px dashed #D8D8D8;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    @include ellipsis;
  }
  .award__right {
    padding-left: 14.5px;
    justify-content: space-evenly;
  }
}
</style>
