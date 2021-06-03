<template>
  <vis-popup-close :show-pop="show" @close-pop="onPopupClose">
    <div
      class="poster-popup"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchMove"
    >
      <vis-img-wrap
        :src="url"
        :width="`${width}px`"
        :height="`${height}px`"
        :fullfill="fullfill"
      />
      <p class="poster-popup__tip">
        {{ text }}
      </p>
    </div>
  </vis-popup-close>
</template>
<script>
import { PopupClose, ImgWrap } from '@youzan/vis-ui';
export default {
  components: {
    'vis-popup-close': PopupClose,
    'vis-img-wrap': ImgWrap,
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

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  methods: {
    onPopupClose() {
      this.show = false;
    },

    handleTouchStart(e) {
      if (this.touchTimer) {
        clearTimeout(this.touchTimer);
      }
      this.touchTimer = setTimeout(() => {
        this.handleLongTap();
      }, 1200);
    },

    handleTouchMove() {
      if (this.touchTimer) {
        clearTimeout(this.touchTimer);
        this.touchTimer = null;
      }
    },

    handleLongTap() {
      this.$emit('share');
    },
  },
};
</script>
<style lang="scss" scoped>
.poster-popup {
  .imgWrap {
    border-radius: 8px;
    background-color: #fff;
  }
  p {
    margin-top: 16px;
    color: #fff;
    text-align: center;
  }
}
</style>
