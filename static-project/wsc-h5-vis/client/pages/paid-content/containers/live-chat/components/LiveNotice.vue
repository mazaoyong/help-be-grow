<template>
  <div
    :class="['live-notice', {
      'live-notice--lecturer': lecturerType === 2 && type === 1
    }]">
    <template v-if="type === 1">
      <p class="live-notice__title">
        直播须知
      </p>
      <p class="live-notice__item">
        1. 直播时请保持设备网络畅通，提前测试录音效果
      </p>
      <p class="live-notice__item">
        2. 一条语音最长60秒，可连续录音，系统会自动切割
      </p>
      <p class="live-notice__item">
        3. 直播不宜超过2小时，注意把控时长
      </p>
    </template>

    <template v-else>
      <p class="live-notice__title">
        直播观看须知
      </p>
      <p class="live-notice__item">
        1. 本次直播为语音图文直播，请确保手机没有静音
      </p>
      <p class="live-notice__item">
        2. 直播界面显示讲师发布的内容，听众可在评论区交流
      </p>
      <p class="live-notice__item">
        3. 课程语音永久保留，你可以随时回看全部内容
      </p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'live-notice',

  props: {
    type: Number,
    lecturerType: [Number, String],
  },

  data() {
    return {

    };
  },
};
</script>

<style lang="scss">
  .live-notice {
    margin: 50px 15px 30px;
    border-radius: 2px;
    background-color: #fff;
    padding: 15px;

    &--lecturer {
      margin-top: 15px;
    }

    &__title {
      color: #333;
      font-size: 16px;
      line-height: 22px;
      margin-bottom: 5px;
    }

    &__item {
      color: #666;
      font-size: 12px;
      line-height: 22px;
    }
  }
</style>
