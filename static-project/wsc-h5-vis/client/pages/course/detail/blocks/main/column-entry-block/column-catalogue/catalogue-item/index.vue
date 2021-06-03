<template>
  <a v-if="data" :href="url" class="catalogue-item">
    <mini-font-tag
      class="tag"
      height="16px"
      :text="tag"
    />
    <div class="content">
      <p v-theme.main="currentColor" class="title" :class="{ done: isDone }">
        {{ data.title }}
      </p>
      <p class="desc" :class="{ done: isDone }">{{ desc }}</p>
    </div>
    <span
      v-if="isCurrent"
      v-theme.main="'color, border-color!important'"
      v-log="['click_continue_study', '点击继续学习']"
      class="continue-btn"
    >
      继续学习
    </span>
  </a>
</template>

<script>
import { MEDIA_TYPE, MEDIA_TYPE_DESC } from '@/constants/course/media-type';
import MiniFontTag from '@/components/mini-font-tag';
import secondsToColonTimeStr from '@/pages/course/detail/utils/seconds-to-colon-time';

export default {
  components: {
    MiniFontTag,
  },

  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  rootState: ['kdtId', 'contentProgress', 'columnProgress'],

  computed: {
    url() {
      return `/wscvis/course/detail/${this.data.alias}?kdt_id=${this.kdtId}`;
    },

    tag() {
      return MEDIA_TYPE_DESC[this.data.mediaType];
    },

    desc() {
      let desc = '';
      if (this.data.mediaType === MEDIA_TYPE.VIDEO) {
        desc += `${secondsToColonTimeStr(this.data.videoContentDTO.videoDuration)} | `;
      }
      if (this.progress) {
        desc += this.isDone ? '已学完' : `已学${this.progress.percent || 0}%`;
      } else {
        desc += '未开始';
      }
      return desc;
    },

    progress() {
      return this.contentProgress[`c-${this.data.alias}`];
    },

    isDone() {
      if (this.progress) {
        return this.progress.percent === 100;
      }
      return false;
    },

    isCurrent() {
      return !this.isDone && this.columnProgress.alias === this.data.alias;
    },

    currentColor() {
      if (this.isCurrent) {
        return 'color!important';
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.catalogue-item {
  @include clearfix;

  position: relative;
  display: block;
  padding-left: 60px;

  .tag {
    float: left;
    margin: 16px 0 0 -44px;
    background-color: $light-border-color;
    color: $main-text-color;
  }

  .content {
    position: relative;
    padding: 16px 16px 16px 0;

    &::after {
      @include border-retina(bottom, $light-border-color);
    }

    .title {
      @include ellipsis;

      font-size: 16px;
      font-weight: 500;
      color: $main-text-color;

      &.done {
        color: $gray-icon-color;
      }
    }

    .desc {
      margin-top: 8px;
      line-height: 16px;
      font-size: 12px;
      color: $disabled-color;

      &.done {
        color: $gray-icon-color;
      }
    }
  }

  .continue-btn {
    position: absolute;
    right: 16px;
    bottom: 9px;
    padding: 0 5px;
    line-height: 18px;
    border-radius: 10px;
    border: 1px solid transparent;
    font-size: 12px;
  }
}
</style>
