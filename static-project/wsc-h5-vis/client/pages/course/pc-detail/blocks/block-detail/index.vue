<template>
  <div class="pc-detail-block">
    <div
      ref="el"
      v-lazy-container="{ selector: '.js-richtext-lazy-img' }"
      @contextmenu="contextmenu($event)"
    >
      <rich-text
        class="intro"
        :content="intro"
      />
    </div>
  </div>
</template>

<script>
import { RichText } from 'captain-ui';

export default {
  components: {
    RichText,
  },

  rootState: ['goodsData', 'env'],

  computed: {
    intro() {
      return this.goodsData.intro;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.pc-detail-block {
  position: relative;
  min-height: 100%;
  margin-bottom: 8px;
  background-color: $white;

  .intro {
    padding: 24px;
    font-size: 14px;
    line-height: 24px;
    color: $main-text-color;

    ::v-deep img {
      width: 100%;
    }

    ::v-deep video {
      width: 100%;
    }

    &.forbid-copy {
      user-select: none !important;

      ::v-deep img {
        pointer-events: none !important;
      }

      ::v-deep a {
        display: inline-block;
      }

      ::v-deep p {
        user-select: none !important;
      }

      ::v-deep span {
        user-select: none !important;
      }
    }
  }
}
</style>
