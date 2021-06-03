<template>
  <div class="content-info">
    <div class="content-info__header">
      <div class="content-info__header-left">
        <h2 class="content-info__title">
          {{ contentData.title }}
        </h2>
        <p class="content-info__author">
          {{ contentData.author }}
        </p>
      </div>
    </div>

    <div class="content-info__rich-content-wrap">
      <h3 v-if="contentData.mediaType !== 1" class="content-info__rich-content-title">
        内容简介
      </h3>
      <div
        v-if="richContent"
        id="rich-content"
        class="content-info__rich-content custom-richtext"
        v-html="richContent"
      />
    </div>
  </div>
</template>

<script>
import { MEDIA_TYPE } from 'pct/constants';

// 辅助图文展示类型：1：无辅助图文  2：购买前显示完整图文 3：购买前仅显示图文简介，购买后显示图文详情
const SHOW_TYPE = {
  NONE: 1,
  ENTIRE: 2,
  PREVIEW: 3,
};

export default {
  name: 'content-info',

  props: {
    contentData: {
      type: Object,
      default() { return {}; },
    },
  },

  data() {
    return {
      SHOW_TYPE,
    };
  },

  computed: {
    richContent() {
      if (!this.contentData.isFree) return '';

      switch (this.contentData.mediaType) {
        case MEDIA_TYPE.IMAGE_TEXT:
          return this.contentData.content;
        case MEDIA_TYPE.AUDIO:
          return this.contentData.audioText;
        case MEDIA_TYPE.VIDEO:
          return this.contentData.videoText;
        default:
          return this.contentData.content;
      }
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
@import "components/custom_richtext.scss";

.content-container--preview .content-info {
  position: relative;
  padding: 0;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .mask {
    background-color: rgba(0, 0, 0, 0);
  }

  &__header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #fff;

    &::after {
      @include border-retina(bottom);
    }
  }

  &__title {
    line-height: 26px;
    font-size: 18px;
    font-weight: 700;
    word-break: break-all;

    /* @include multi-ellipsis(2); */
  }

  &__author {
    margin-top: 14px;
    line-height: 18px;
    color: #999;
    font-size: 12px;
  }

  &__rich-content-wrap {
    background-color: #fff;
  }

  &__rich-content-title {
    padding: 15px 0 0 15px;
    line-height: 22px;
    font-size: 16px;
    font-weight: 700;
  }

  &__rich-content.custom-richtext {
    padding: 15px;
    margin-bottom: 0;

    p { margin-bottom: 0; }
  }

  &__content-title {
    font-size: 14px;
    color: #9b9b9b;
    padding: 20px 0 14px 15px;
  }

  &__buy-tip--normal {
    padding-bottom: 15px;
    position: relative;

    .buy-tip {
      &__tip {
        line-height: 26px;
        text-align: center;
        color: #333;
        font-size: 14px;
        background: linear-gradient(180deg, rgba(255, 255, 255, .8), rgba(255, 255, 255, 1));
      }
      &__tip img {
        width: 10px;
        height: 12px;
      }
    }
  }
}
</style>
