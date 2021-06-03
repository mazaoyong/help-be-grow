<template>
  <div :class="prefixcls">
    <div :class="`${prefixcls}-img`" :style="`padding-top: ${paddingTop}px`">
      <img src="https://b.yzcdn.cn/public_files/aa057b35556a459c5f5a05280ec1a58d.png" />
    </div>
    <div :class="`${prefixcls}-tip`">
      {{ tip }}
    </div>
    <div :class="`${prefixcls}-time`" v-if="time.length">活动时间：{{ timeStr }}</div>
    <div :class="`${prefixcls}-btn`">
      <div class="btn" @click="onJumpToShop">
        进店逛逛
      </div>
    </div>
    <slot name="bottom" />
  </div>
</template>

<script>
import { navigateEnv } from '@/common/utils/env';
import formatDate from '@youzan/utils/date/formatDate';

export default {
  name: 'activeity-error',
  data() {
    return {
      prefixcls: 'activity-error',
    };
  },
  components: {},
  props: {
    paddingTop: {
      type: Number,
      default: 105,
    },
    tip: {
      type: String,
      default: '',
    },
    time: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    timeStr() {
      return `${formatDate(this.time[0], 'YYYY.MM.DD')} - ${formatDate(this.time[1], 'YYYY.MM.DD')}`;
    },
  },
  mounted() {},
  methods: {
    onJumpToShop() {
      navigateEnv();
    },
  },
};
</script>

<style lang="scss">
.activity-error {
  width: 100%;
  text-align: center;
  &-img {
    img {
      width: 132px;
      height: 132px;
    }
  }
  &-tip {
    padding-top: 16px;
    font-size: 14px;
    line-height: 20px;
    color: #875a21;
  }
  &-time {
    font-size: 14px;
    line-height: 20px;
    color: #875a21;
  }
  &-btn {
    padding: 16px 44px;

    .btn {
      height: 54px;
      line-height: 54px;
      text-align: center;
      font-size: 16px;
      color: #fff;
      background: linear-gradient(45deg, #ff7b17 0%, #ff2b00 100%);
      border-radius: 32px;
    }
  }
}
</style>
