<template>
  <div
    v-show="isLoaded"
    ref="cover"
    class="detail-cover"
  >
    <img-wrap
      class="detail-cover--normal"
      :src="coverUrl || ''"
      :fullfill="'!800x0q75.png'"
      width="100%"
      height="100%"
      disable-lazyload
      @load="onCoverLoaded"
    />
    <img
      class="detail-cover--small"
      :style="style"
      :src="fullfill(coverUrl)"
    >
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
    return {
      isCover: false,
      isLoaded: false,
      coverWidth: '',
      coverHeight: '',
    };
  },

  computed: {
    style() {
      return {
        width: `${this.coverWidth}px`,
        height: `${this.coverHeight}px`,
      };
    },
  },

  methods: {
    onCoverLoaded(e) {
      const cover = e.currentTarget;
      const coverWidth = cover.naturalWidth;
      const coverHeight = cover.naturalHeight;
      const whScale = coverWidth / coverHeight;
      const coverWrap = this.$refs.cover.parentNode;
      const coverWrapWidth = coverWrap.clientWidth;
      const coverWrapHeight = coverWrap.clientHeight;

      if (coverWidth <= coverWrapWidth) {
        if (coverHeight <= coverWrapHeight) {
          this.coverWidth = coverWidth;
          this.coverHeight = coverHeight;
        } else {
          this.coverHeight = coverWrapHeight;
          this.coverWidth = 'auto';
        }
      } else {
        if (coverHeight > coverWrapHeight) {
          if (whScale > 1) {
            this.coverWidth = coverWrapWidth;
            this.coverHeight = coverWrapWidth / whScale;
          } else {
            this.coverWidth = coverWrapHeight * whScale;
            this.coverHeight = coverWrapHeight;
          }
        } else {
          this.coverWidth = coverWrapWidth;
          this.coverHeight = 'auto';
        }
      }
      this.$emit('size', {
        width: coverWidth,
        height: coverHeight,
      });
      this.isLoaded = true;
    },

    fullfill(img) {
      return fullfillImage(img, '!0x0q75.png');
    },
  },
};
</script>

<style lang="scss" scoped>
.detail-cover {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &--normal {
    display: block;
  }

  &--small {
    position: absolute;
    top: 12px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    &.cover {
      width: 100%;
      height: auto;
    }

    &.contain {
      width: auto;
      height: calc(100% - 24px);
    }
  }

}
</style>
