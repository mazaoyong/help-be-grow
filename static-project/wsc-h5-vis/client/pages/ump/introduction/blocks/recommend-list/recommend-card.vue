<template>
  <div
    class="recommand-card"
    @click="onPathToCourse"
  >
    <div class="recommand-card-box">
      <div class="img-box">
        <vis-img-wrap
          :src="sourceData.imageUrl"
          :fullfill="'!245x0.jpg'"
          class="recommand-card-img"
        />
        <vis-tag
          v-if="sourceData.courseTypeName"
          size="mini"
          extend-class="vis-tag-theme vis-tab-position-absolute"
        >
          {{ sourceData.courseTypeName }}
        </vis-tag>
      </div>
      <div class="recommand-card-title">
        {{ sourceData.title }}
      </div>
      <div class="recommand-card-extra">
        <div class="recommand-card-extra-price">
          {{ sourceData.price === 0 ? '免费' : `￥${ Number((sourceData.price / 100)).toFixed(2) }` }}
        </div>
        <div
          v-if="sourceData.totalSoldNum"
          class="recommand-card-extra-learnt"
        >
          {{ sourceData.totalSoldNum | formateSoldNum }}人学过
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
import * as customSafeLink from '@/common/utils/custom-safe-link';

export default {
  name: 'recommand-card',

  components: {
    'vis-tag': Tag,
    'vis-img-wrap': ImgWrap,
  },

  filters: {
    formateSoldNum(value) {
      return formatSalesNum(value);
    },
    formatImage: function(src, ext) {
      return fullfillImage(src, ext || '!245x0.jpg');
    },
  },

  props: {
    sourceData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {};
  },

  methods: {
    onPathToCourse() {
      customSafeLink.redirect({
        url: this.sourceData.url,
        kdtId: window._global.kdt_id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.recommand-card {
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
    left: 10px;
    bottom: 10px;
  }

  &-box {
    background-color: #fff;
    border-radius: 6px;
    width: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  &-img {
    width: auto;
    height: 96px;
    border: none;
    background-color: #bebebe;
  }

  &-title {
    width: auto;
    height: 34px;
    padding: 8px 4px 0;
    color: #333;
    font-size: 13px;
    line-height: 17px;
    word-break: normal;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  &-extra {
    margin-top: 22px;
    display: flex;
    padding: 0 6px 8px;
    width: auto;
    justify-content: space-between;
    align-items: center;

    &-price {
      color: #ec5c55;
      font-size: 16px;
      line-height: 1.25;
    }

    &-learnt {
      color: #999;
      font-size: 10px;
      line-height: 17px;
      white-space: nowrap;
    }
  }
}
</style>
