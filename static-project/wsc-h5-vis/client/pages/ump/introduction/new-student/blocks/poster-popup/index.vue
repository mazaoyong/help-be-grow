<template>
  <div class="poster-popup__container">
    <div v-if="!url" class="poster-popup__loading">
      <loading size="50" />
    </div>
    <div class="poster-popup">
      <p class="poster-popup__tip">
        {{ text }}
      </p>
      <vis-img-wrap
        :src="url"
        :width="`${width}px`"
        :height="`${height}px`"
        :fullfill="fullfill"
      />
    </div>
  </div>
</template>
<script>
import { ImgWrap } from '@youzan/vis-ui';
import { Loading } from 'vant';

export default {
  components: {
    'vis-img-wrap': ImgWrap,
    Loading,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    url: {
      type: String,
      required: true,
    },

    width: {
      type: Number,
      default: 292,
    },

    height: {
      type: Number,
      default: 414,
    },

    fullfill: {
      type: String,
      default: 'origin',
    },

    text: {
      type: String,
      default: '长按保存海报，发送给好友领取奖励',
    },
  },

  computed: {},

  methods: {},
};
</script>
<style lang="scss" scoped>
.poster-popup {
  position: relative;

  &__container {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -60px;
    transform: translateX(-50%) translateY(-50%);
    z-index: 99999;
  }
  &__loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 1;
  }
  .imgWrap {
    border-radius: 8px;
    background-color: #fff;
  }
  p {
    margin-bottom: 16px;
    color: #fff;
    text-align: center;
  }
}
</style>
