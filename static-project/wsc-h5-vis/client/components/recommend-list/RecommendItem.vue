<template>
  <div
    class="recommand-item"
    @click="onPathToCourse"
  >
    <div class="recommand-item__box">
      <div class="img-box">
        <vis-img-wrap
          :src="imageUrl"
          :fullfill="'!245x0.jpg'"
          class="recommand-item__img"
        />
        <vis-tag
          v-if="courseTypeName"
          size="mini"
          extend-class="vis-tag-theme vis-tab-position-absolute"
        >
          {{ courseTypeName }}
        </vis-tag>
      </div>
      <div class="recommand-item__title">
        {{ title }}
      </div>
      <div class="recommand-item__extra">
        <div class="recommand-item__extra-price">
          {{ price === 0 ? '免费' : `￥${ Number((price / 100)).toFixed(2) }` }}
        </div>
        <div
          v-if="sales"
          class="recommand-item__extra-learnt"
        >
          {{ sales | formatSales }}人{{ salesText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatSalesNum } from '@/pages/edu/utils';
import fullfillImage from 'zan-utils/fullfillImage';
import Tag from 'components/tag';
import { ImgWrap } from '@youzan/vis-ui';
import * as SafeLink from '@youzan/safe-link';
import { OWL_TYPE, OWL_TYPE_DESC } from '@/constants/course/owl-type';
import { MEDIA_TYPE_DESC, MEDIA_TYPE_SUFFIX } from '@/constants/course/media-type';

export default {
  name: 'recommand-item',

  components: {
    'vis-tag': Tag,
    'vis-img-wrap': ImgWrap,
  },

  filters: {
    formatSales(value) {
      return formatSalesNum(value);
    },
    formatImage: function(src, ext) {
      return fullfillImage(src, ext || '!245x0.jpg');
    },
  },

  props: {
    imageUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    url: {
      type: Number,
      default: 0,
    },
    owlType: {
      type: Number,
      default: 0,
    },
    mediaType: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    courseTypeName() {
      if (this.owlType === OWL_TYPE.CONTENT) {
        return MEDIA_TYPE_DESC[this.mediaType];
      }

      return OWL_TYPE_DESC[this.owlType] || '';
    },

    salesText() {
      if (this.owlType === OWL_TYPE.CONTENT) {
        return MEDIA_TYPE_SUFFIX[this.mediaType];
      }

      return {
        [OWL_TYPE.COLUMN]: '已学',
        [OWL_TYPE.CONTENT]: '已学',
        [OWL_TYPE.LIVE]: '观看',
        [OWL_TYPE.COURSE]: '学过',
      }[this.owlType];
    },
  },

  methods: {
    onPathToCourse() {
      SafeLink.redirect({
        url: this.url,
        kdtId: window._global.kdt_id,
      });
    },
  },
};
</script>

<style lang="scss">
.recommand-item {
  width: 50%;
  box-sizing: border-box;

  &:nth-child(2n+1) {
    padding-right: 5px;
  }

  &:nth-child(2n) {
    padding-left: 5px;
  }

  .img-box {
    position: relative;
    height: 96px;
    overflow: hidden;
  }

  .vis-tab-position-absolute {
    position: absolute;
    right: 8px;
    bottom: 8px;
    padding: 3px 4px;
    background: rgba(#323233, .8);
    border-radius: 8px;
  }

  &__box {
    display: flex;
    width: auto;
    margin-top: 10px;
    overflow: hidden;
    background-color: #fff;
    border-radius: 6px;
    flex-direction: column;
  }

  &__img {
    width: auto;
    height: 96px;
    background-color: #bebebe;
    border: none;
  }

  &__title {
    display: -webkit-box;
    width: auto;
    height: 34px;
    padding: 8px 4px 0;
    overflow: hidden;
    font-size: 13px;
    line-height: 17px;
    color: #333;
    text-align: left;
    text-overflow: ellipsis;
    word-break: normal;
    white-space: normal;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  &__extra {
    display: flex;
    width: auto;
    padding: 0 6px 8px;
    margin-top: 22px;
    justify-content: space-between;
    align-items: center;

    &-price {
      font-size: 16px;
      line-height: 1.25;
      color: #ec5c55;
    }

    &-learnt {
      font-size: 10px;
      line-height: 17px;
      color: #999;
      white-space: nowrap;
    }
  }
}
</style>
