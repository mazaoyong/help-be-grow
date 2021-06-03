<template>
  <div class="image">
    <img-wrap
      v-if="show"
      :height="height"
      :src="picture.url"
      :cover="false"
      fullfill="!large.jpg"
      disable-lazyload
    />
    <van-count-down
      v-if="countDown"
      class="count-down"
      :time="countDown"
      @finish="countDownFinish"
    >
      <template slot-scope="{ days, hours, minutes, seconds }">
        <!-- 0秒时其实还有1秒，此时只显示‘距开始报名还剩’，加上判断避免这种情况 -->
        <span v-if="days || hours || minutes || seconds">距直播开始仅剩</span>
        <span class="time">
          <span v-if="days" class="day">{{ days }}天</span>
          <span v-if="days || hours">{{ padZero(hours) }}:</span>
          <span v-if="days || hours || minutes">{{ padZero(minutes) }}:</span>
          <span v-if="days || hours || minutes || seconds">{{ padZero(seconds) }}</span>
        </span>
      </template>
    </van-count-down>
  </div>
</template>

<script>
import { CountDown } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import { LIVE_STATUS } from '@/constants/course/live-status';

// 知识付费封面固定16:9的比例
const RATIO = 16 / 9;

export default {
  components: {
    'van-count-down': CountDown,
    ImgWrap,
  },

  rootState: ['goodsData'],
  rootGetters: ['pageWidth', 'isImageText'],

  computed: {
    show() {
      if (this.isImageText) {
        return !this.goodsData.isOwnAsset;
      }
      if (this.picture.url) {
        return true;
      }
      return false;
    },

    picture() {
      return this.goodsData.pictures[0];
    },

    height() {
      const width = this.picture.width;
      const height = this.picture.height;
      if (this.picture.width <= this.picture.height) {
        return `${this.pageWidth / RATIO}px`;
      }
      return `${this.pageWidth * height / width}px`;
    },

    countDown() {
      const { liveStartAt, liveStatus } = this.goodsData;
      if (liveStartAt && liveStatus === LIVE_STATUS.UNSTART) {
        const now = Date.now();
        if (now < liveStartAt) {
          return liveStartAt - now;
        }
      }
      return 0;
    },
  },

  methods: {
    countDownFinish() {
      this.$rootCommit('liveStatus', LIVE_STATUS.LIVING);
    },

    padZero(num) {
      if (num < 10) {
        return `0${num}`;
      }
      return num;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.image {
  position: relative;

  .count-down {
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 14px;
    line-height: 44px;
    color: $white;
    text-align: center;
    background-color: rgba($main-text-color, .6);

    .time {
      margin-left: 4px;
      font-size: 20px;
      font-weight: bold;
      vertical-align: bottom;

      .day {
        margin-right: 4px;
      }
    }
  }
}
</style>
