<template>
  <div
    v-show="isLoaded"
    class="detail-cover"
    :style="{ height: coverWrapHeight }"
  >
    <img-wrap
      class="detail-cover--normal"
      :class="{ 'detail-cover--blur': isCompatibleCover }"
      :style="coverStyle"
      :src="coverUrl || ''"
      :fullfill="'!800x0q75.png'"
      disable-lazyload
      @load="onCoverLoaded"
    />
    <img
      v-if="isCompatibleCover"
      class="detail-cover--small"
      :src="fullfill(coverUrl)"
    >
    <slot />
  </div>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';
import fullfillImage from 'zan-utils/fullfillImage';

export default {
  name: 'detail-cover',

  components: {
    ImgWrap,
  },

  props: {
    coverUrl: String,
  },

  data() {
    const isPC = window.innerWidth > 600;

    return {
      isPC,
      // 封面是否采用兼容模式
      isCompatibleCover: false,
      coverWidth: '',
      coverHeight: '',
      coverScale: 1,
      isLoaded: false,
    };
  },

  computed: {
    // 封面高度计算
    coverWrapHeight() {
      if (this.isCompatibleCover) {
        return `${this.isPC ? 210 : window.innerWidth / 16 * 9}px`;
      }
      return 'auto';
    },

    coverStyle() { // 封面样式
      return {
        width: this.coverWidth,
        height: this.coverHeight,
      };
    },
  },

  methods: {
    /**
      * 封面图 loaded
      */
    onCoverLoaded(e) {
      const cover = e.currentTarget;
      const coverWidth = cover.width;
      const coverHeight = cover.height;
      const whScale = coverWidth / coverHeight;

      // 判断是否使用兼容模式
      if (whScale > 1) {
        this.isCompatibleCover = false;
        this.coverWidth = '100%';
      } else {
        this.isCompatibleCover = true;
        // 计算封面背景图缩放比率
        const widthScale = coverWidth / (window.innerWidth > 600 ? 375 : window.innerWidth);
        const coverWrapHeight = this.isPC ? 210 : window.innerWidth / 16 * 9;
        const heightScale = coverHeight / coverWrapHeight;
        this.coverScale = Math.min(widthScale, heightScale);
        this.coverWidth = parseInt(coverWidth / this.coverScale) + 'px';
        this.coverHeight = parseInt(coverHeight / this.coverScale) + 'px';
      }

      this.isLoaded = true;
    },

    fullfill(img) {
      return fullfillImage(img, '!0x0q75.png');
    },
  },
};
</script>

<style lang="scss">
.detail-cover {
  position: relative;
  width: 100%;
  height: 210px;
  overflow: hidden;

  &--normal {
    display: block;
  }

  &--blur {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: blur(14px);
  }

  &--small {
    position: absolute;
    top: 12px;
    left: 50%;
    height: calc(100% - 24px);
    border-radius: 4px;
    transform: translateX(-50%);
  }
}
</style>
