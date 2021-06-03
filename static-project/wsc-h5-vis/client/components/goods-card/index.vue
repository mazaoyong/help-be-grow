<template>
  <a
    class="goods-card"
    :class="size"
    :href="toDetail"
    @click="$emit('click', $event)"
  >
    <div class="img-wrap">
      <img-wrap
        :width="`${width}px`"
        :height="`${height}px`"
        :fullfill="`!small.jpg`"
        :src="img"
        :cover="false"
      />
      <mini-font-tag
        v-if="proxyImgTag"
        :text="proxyImgTag"
        class="img-tag"
        height="16px"
        background-color="rgba(50, 50, 51, .8)"
      />
    </div>
    <div class="info-wrap">
      <h2 class="title">
        <mini-font-tag
          v-if="titleTag"
          :text="titleTag"
          :background-color="mainColor"
          class="title-tag"
          :class="[titleTagClass]"
          height="16px"
        />
        {{ title }}
      </h2>
      <div class="bottom" :class="{ 'has-button': buttonText }">
        <slot />
        <van-button
          v-if="buttonText"
          :text="buttonText"
          :color="mainColor"
          class="goods-card__btn button"
          size="mini"
          plain
          round
        />
      </div>
    </div>
  </a>
</template>

<script>
import Vue from 'vue';
import { Button } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import MiniFontTag from '@/components/mini-font-tag';
import { MEDIA_TYPE_DESC } from '@/constants/course/media-type';
import { OWL_TYPE_DESC } from '@/constants/course/owl-type';
import { COURSE_TYPE_DESC } from '@/constants/course/course-type';

export default Vue.extend({
  components: {
    'van-button': Button,
    ImgWrap,
    MiniFontTag,
  },

  props: {
    // small、middle
    size: {
      type: String,
      default: 'small',
    },
    url: {
      type: String,
      default: '',
    },
    alias: {
      type: String,
      default: '',
    },
    owlType: {
      type: Number,
      default: undefined,
    },
    mediaType: {
      type: Number,
      default: undefined,
    },
    courseType: {
      type: Number,
      default: undefined,
    },
    img: {
      type: String,
      default: '',
    },
    imgTag: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    titleTag: {
      type: String,
      default: '',
    },
    titleTagClass: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '',
    },
  },

  computed: {
    width() {
      const map = {
        small: 110,
        middle: 98,
      };
      return map[this.size];
    },

    height() {
      const map = {
        small: 62,
        middle: 98,
      };
      return map[this.size];
    },

    toDetail() {
      if (this.url) {
        return this.url;
      }
      if (this.alias) {
        return `/wscvis/course/detail/${this.alias}?kdt_id=${_global.kdt_id}`;
      }
      return 'javascript:;';
    },

    proxyImgTag() {
      // 优先判断外部传入的imgTag
      if (this.imgTag) {
        return this.imgTag;
      }
      // 优先判断 mediaType
      if (this.mediaType !== undefined) {
        return MEDIA_TYPE_DESC[this.mediaType];
      }
      if (this.courseType !== undefined) {
        return COURSE_TYPE_DESC[this.courseType];
      }
      if (this.owlType !== undefined) {
        return OWL_TYPE_DESC[this.owlType];
      }
      return '';
    },

    mainColor() {
      return this.$theme.colors.main;
    },
  },
});
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.goods-card {
  @include clearfix;

  display: block;

  &.small {
    padding: 12px 16px 12px 134px;

    .img-wrap {
      margin-left: -118px;
    }

    .title {
      height: 36px;
      line-height: 18px;
    }

    .bottom {
      margin-top: 6px;
    }
  }

  &.middle {
    padding: 12px 16px 12px 122px;

    .img-wrap {
      margin-left: -106px;
    }

    .title {
      height: 40px;
      line-height: 20px;
    }

    .bottom {
      margin-top: 38px;
    }
  }

  .img-wrap {
    position: relative;
    float: left;
    overflow: hidden;
    border-radius: 4px;

    .img-tag {
      position: absolute;
      right: 8px;
      bottom: 8px;
      padding: 0;
    }
  }

  .info-wrap {
    float: left;
    width: 100%;

    .title {
      @include multi-ellipsis(2);

      font-size: 14px;
      font-weight: bold;
      color: $main-text-color;
      word-break: break-all;
    }

    .title-tag {
      padding: 0 1px;
      vertical-align: text-bottom;
    }

    .bottom {
      @include clearfix;

      position: relative;
      font-size: 12px;
      line-height: 16px;
      color: $disabled-color;

      &.has-button {
        padding-right: 68px;
      }

      .button {
        position: absolute;
        top: 0;
        right: 0;
        height: 20px;
        padding: 0 5px;
        line-height: 19px;
      }
    }
  }
}
</style>

<style lang="scss"> // eslint-disable-line vue-scoped-css/require-scoped
.img-wrap .img-tag .tag {
  transform: scale(.6666666);
}
</style>
