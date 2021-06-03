<template>
  <div class="award award-point">
    <i
      class="award__status-icon"
      :class="[{
        'award__status-icon-1': status === 4,
        'award__status-icon-2': status !== 1 && status !== 4,
      }]"
    />
    <div class="award__left">
      <span class="award__number">{{ number }}</span>
      <i class="award__unit">{{ unit }}</i>
    </div>
    <div class="award__right">
      <span class="award__label">{{ label }}</span>
      <div class="award__bottom">
        <div class="award__descs">
          <p class="award__desc">{{ desc }}</p>
        </div>
        <van-botton
          v-if="status === 1"
          class="award__btn"
          type="primary"
          size="mini"
          @click="getAward('POINT')"
        >
          立即领取
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
import { Button } from 'vant';
import getAward from '../mixin/getAward.js';

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
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">

.award-point {
  padding-left: 0 !important;

  .award__left {
    width: 100.5px;
    border-right: 1px dashed #d8d8d8;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .award__right {
    padding-left: 14.5px;
    justify-content: space-evenly;
  }
}
</style>
