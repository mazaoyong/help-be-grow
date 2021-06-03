<template>
  <!--
        +----+----------------+-------+
        |Tag | Title          |       |
        +----+----------------+ Extra |
        |      Desc           |       |
        +---------------------+-------+
 -->
  <a class="goods-card-lite" :href="toDetail" @click="$emit('click', $event)">
    <section class="body">
      <section class="title">
        <div class="title-tag">
          <mini-font-tag
            v-if="proxyImgTag"
            :text="proxyImgTag"
            class="mini-tag"
            height="16px"
            color="#646566"
            background-color="#f2f3f5"
          />
        </div>
        <h2 class="text">
          {{ title }}
        </h2>
      </section>
      <section class="desc">
        <slot />
        <mini-font-tag
          v-if="descTag.text"
          :text="descTag.text"
          :background-color="descTag.color || mainColor"
          class="desc-tag"
          height="16px"
        />
      </section>
    </section>
    <aside class="extra">
      <van-button
        v-if="buttonText"
        :text="buttonText"
        :color="mainColor"
        class="extra-button"
        block
        size="mini"
        plain
        round
      />
    </aside>
  </a>
</template>

<script>
import Vue from 'vue';
import { Button } from 'vant';
import MiniFontTag from '@/components/mini-font-tag';
import { MEDIA_TYPE_DESC } from '@/constants/course/media-type';
import { OWL_TYPE_DESC } from '@/constants/course/owl-type';
import { COURSE_TYPE_DESC } from '@/constants/course/course-type';

export default Vue.extend({
  name: 'goods-card-lite',
  components: {
    'van-button': Button,
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
    descTag: {
      type: Object,
      default: () => ({
        text: '',
        color: '',
      }),
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
@import "mixins/index.scss";

.goods-card-lite {
  display: flex;
  overflow: hidden;
  padding: 12px 16px;
  align-items: center;
  &:active {
    background-color: #f2f3f5;
  }
  section.body {
    flex: 1;
    section.title {
      display: flex;
      align-items: center;
      .title-tag {
        height: 16px;
        flex: 0 0 34px;
        .mini-tag {
          padding: 0 4px;
        }
      }
      h2.text {
        flex: 1;
        margin-left: 8px;
        word-break: break-all;
        font-size: 14px;
        color: $main-text-color;
        line-height: 20px;
      }
    }
    section.desc {
      padding-left: 42px; // tag.width 34px + h2.margin-left 8px
      margin-top: 4px;
      font-size: 12px;
      line-height: 16px;
      color: $disabled-color;
      .desc-tag {
        padding: 0 1px;
        margin-left: 4px;
        vertical-align: text-bottom;
      }
    }
  }
  aside.extra {
    margin-left: 8px;
    flex: 0 0 56px;
    .extra-button{
      font-weight: 500;
    }
  }
}
</style>
