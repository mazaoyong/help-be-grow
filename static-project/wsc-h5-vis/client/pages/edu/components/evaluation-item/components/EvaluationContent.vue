<template>
  <div class="evaluation-content">
    <div
      v-if="!evaluation"
      class="evaluation-content__empty"
    >
      此用户没有填写评价
    </div>
    <template v-else>
      <p
        ref="content"
        :class="contentClass"
      >
        {{ evaluation }}
      </p>
      <div
        v-if="status"
        @click.stop="onShowMore"
        class="show-more tag-text"
      >
        <span>
          {{ showMoreText }}
        </span>
        <van-icon
          :name="showMoreIcon"
          :color="themeColor"
          class="show-more__arrow"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';

export default {
  name: 'evaluation-content',

  components: {
    'van-icon': Icon,
  },

  props: {
    evaluation: {
      type: String,
      default: '',
    },
    themeColor: {
      type: String,
      default: '#f44',
    },
    contentStyle: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      status: '',
      contentClass: '',
      showMoreText: '',
      showMoreIcon: 'arrow-down',
    };
  },

  mounted() {
    if (this.evaluation) {
      this.init();
    }
  },

  methods: {
    init() {
      this.initContentClass();
    },
    initContentClass() {
      if (this.contentStyle === 'ellipsis') {
        this.contentClass = 'content-ellipssis';
      } else if (this.contentStyle === 'fold') {
        this.formatContent();
      }
    },
    formatContent() {
      const height = parseInt((window.getComputedStyle(this.$refs.content) || {}).height.slice(0, -2)) || 0;
      if (height > 100) {
        this.status = 'show-more';
        this.contentClass = 'content-short';
      }
      this.formatShowMoreData(this.status);
    },

    formatShowMoreData(status) {
      this.showMoreText = this.status === 'show-more' ? '展开' : '收起';
      this.showMoreIcon = this.status === 'show-more' ? 'arrow-down' : 'arrow-up';
      this.contentClass = this.status === 'show-more' ? 'content-short' : '';
    },

    onShowMore() {
      if (this.status === 'show-more') {
        this.status = 'hide-more';
      } else if (this.status === 'hide-more') {
        this.status = 'show-more';
      }
      this.formatShowMoreData(this.status);
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.evaluation-content {
  line-height: 20px;
  padding: 10px 0 0 32px;
  font-size: 13px;
  color: #323233;

  &__empty {
    color: #999;
    font-size: 12px;
    line-height: 16px;
  }

  p {
    word-wrap: break-word;
    text-align: justify;
  }

  .content-ellipssis {
    @include multi-ellipsis(2);
  }

  .content-short {
    height: 100px;

    @include multi-ellipsis(5);
  }

  .show-more {
    width: 43px;
    height: 17px;
    color: #1989fa;
    font-size: 12px;
    margin-top: 8px;
    line-height: 17px;
    position: relative;
  }
}
</style>
