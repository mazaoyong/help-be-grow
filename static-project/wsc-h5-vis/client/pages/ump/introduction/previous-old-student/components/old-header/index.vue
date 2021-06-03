<template>
  <div class="old-header">
    <div class="old-header__first">
      <span @click="onClickRule" class="rule">详细规则</span>
      <span @click="onClickRecord" class="record">邀请记录</span>
    </div>
    <join-count-banner
      v-if="showJoinNum && count > 0"
      :count="count"
      :page-style="pageStyle"
    />
    <div :class="['old-header__guide', (showJoinNum && count > 0) ? '' : 'no-count' ]">
      <img :src="titleImg">
    </div>
    <count-down :end-at="endAt" :status="status" :page-style="pageStyle" />
  </div>
</template>

<script>
import JoinCountBanner from '../join-count-banner';
import CountDown from '../count-down';

import { PAGE_STYLE_TITLE_OLD } from '../../constants';

export default {
  name: 'old-header',

  components: {
    JoinCountBanner,
    CountDown,
  },

  props: {
    count: {
      type: Number,
      default: 0,
    },

    endAt: {
      type: [String, Number],
      default: 0,
    },

    pageStyle: {
      type: Number,
      default: 1,
    },

    showJoinNum: {
      type: Number,
      default: 0,
    },

    status: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    titleImg() {
      return PAGE_STYLE_TITLE_OLD[this.pageStyle];
    },
  },

  methods: {
    onClickRecord() {
      this.$emit('clickRecord');
    },

    onClickRule() {
      this.$emit('clickRule');
    },
  },
};
</script>

<style lang="scss" scoped>
.old-header {
  position: relative;
  padding: 14px 16px 20px;

  &__first {
    margin-bottom: 6px;
    text-align: right;
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: #fff;

    .rule {
      position: relative;
      padding-right: 10px;
      margin-right: 5px;

      &:after {
        position: absolute;
        content: '|';
        font-size: 14px;
        line-height: 20px;
        right: 0;
        color: rgb(255 255 255 / .3);
      }
    }
  }

  &__guide {
    height: 55px;
    margin-top: 8px;
    text-align: center;

    &.no-count {
      margin-top: 24px;
    }

    img {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
