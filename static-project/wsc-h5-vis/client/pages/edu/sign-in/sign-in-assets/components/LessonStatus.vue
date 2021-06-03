<template>
  <div class="sing-in-lesson-status">
    <vis-icon
      name="check-o"
      class="sing-in-lesson-status__icon"
    />
    <p class="sing-in-lesson-status__desc">
      {{ desc }}
    </p>
    <div class="sing-in-lesson-status__bg" />
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';

export default {
  name: 'lesson-status',

  components: {
    'vis-icon': Icon,
  },

  props: {
    lessons: {
      type: [Number, String],
      default: 0,
      required: true,
    },
  },

  data() {
    return {
    };
  },

  computed: {
    desc() {
      const { lessons } = this;
      if (lessons === 0) {
        return '今天的课程都已签到';
      }

      return `你今天还有${lessons}节课可以签到`;
    },
  },
};
</script>

<style lang="scss">
  .sing-in-lesson-status {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 355px;
    height: 75px;
    border-radius: 6px;
    background-color: #ececec;
    position: relative;
    overflow: hidden;

    &__icon {
      color: #fff;
      font-size: 20px;
      margin-right: 5px;
      margin-left: 12px;
    }

    &__desc {
      font-weight: bold;
      color: #fff;
      font-size: 16px;
    }

    &__bg {
      position: absolute;
      right: -10px;
      top: 50%;
      transform: translateY(-50%);
      background-image: url('https://b.yzcdn.cn/public_files/2019/03/09/2a68305937af7e78147d1d76176966a3.png');
      width: 66px;
      height: 86px;
      background-size: 66px;
    }
  }
</style>
