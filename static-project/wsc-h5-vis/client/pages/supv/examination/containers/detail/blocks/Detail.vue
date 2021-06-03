<template>
  <div class="block-detail">
    <div class="block-detail__title">
      考试详情
    </div>

    <!-- richtext lazyload 有点问题，暂时换成 div -->
    <div
      class="block-detail__rich-text custom-richtext"
      :class="{
        'block-detail__rich-text--folded': overHeight && folded,
      }"
      v-html="detail"
    />

    <div v-if="overHeight" class="block-detail__footer">
      <div v-if="folded" class="block-detail__footer__bg" />
      <div v-if="folded" class="block-detail__footer__button" @click="folded = false">
        查看全部<van-icon name="arrow-down" size="14px" />
      </div>
      <div v-else class="block-detail__footer__button" @click="folded = true">
        收起<van-icon name="arrow-up" size="14px" />
      </div>
    </div>
  </div>
</template>

<script>
import { Icon as VanIcon } from 'vant';

let observer = null;
export default {
  name: 'block-detail',

  components: {
    VanIcon,
  },

  state: ['detail'],

  props: {
    showMore: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      folded: true,
      overHeight: false,
    };
  },

  watch: {
    detail: {
      immediate: true,
      handler(detail) {
        if (this.showMore && this.detail) {
          this.observeRichText();
        }
      },
    },
  },

  mounted() {
    this.observeRichText();
  },

  destroyed() {
    if (observer) observer.disconnect();
  },

  methods: {
    observeRichText() {
      // 观察富文本节点，如果超过232，则收起超出的内容
      const targetNode = document.querySelector('.block-detail__rich-text');
      if (targetNode) {
        const config = { childList: true, subtree: true };
        const callback = (mutations) => {
          const rect = targetNode.getBoundingClientRect();
          if (rect.height > 232) {
            this.overHeight = true;
          } else {
            this.overHeight = false;
          }
        };
        observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        // 可能富文本dom已经生成，默认执行一次
        callback();
      }
    },
  },
};
</script>

<style lang="scss">
@import '~supv/examination/style/index';

.block-detail {
  position: relative;
  margin-top: 8px;
  background: $white;

  &__title {
    @include text(16px, $black, 18px, 500);

    padding: 12px 16px 14px;
  }

  &__rich-text {
    @include richtext;

    padding: 16px;

    &--folded {
      max-height: 232px;
      overflow: hidden;
    }
  }

  &__footer {
    @include text(14px, $black, 18px);

    position: relative;
    text-align: center;

    .van-icon {
      margin-left: 4px;
      vertical-align: -1px;
    }

    &__bg {
      position: absolute;
      top: -92px;
      width: 100%;
      height: 92px;
      background-image: linear-gradient(-180deg, rgba($white, .16), rgba($white, .96));
    }

    &__button {
      padding: 10px 0 14px;
      background: #fff;
    }
  }
}
</style>
