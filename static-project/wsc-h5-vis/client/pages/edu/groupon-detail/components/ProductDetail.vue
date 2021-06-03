<template>
  <div
    @click="onGoCourseDetail"
    class="product-detail"
  >
    <div class="product-detail__img">
      <img-wrap
        :width="`137px`"
        :height="`77px`"
        :src="picture"
        :fullfill="'!145x145.jpg'"
        :cover="false"
      />
      <van-tag
        v-if="groupType===1"
        class="group-type"
        mark
        type="danger"
      >
        老带新
      </van-tag>
    </div>
    <div class="product-detail__title">
      <p class="title">
        {{ productDetail.title }}
      </p>
      <p
        v-if="productDetail.totalSoldNum"
        class="sale-num"
      >
        {{ productDetail.totalSoldNum }}人正在学习
      </p>
    </div>
  </div>
</template>

<script>
import { Tag } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'product-detail',

  components: {
    'van-tag': Tag,
    ImgWrap,
  },

  props: {
    productDetail: {
      type: Object,
    },

    groupType: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      picture: (this.productDetail.pictures || [])[0].url || '',
    };
  },

  methods: {
    onGoCourseDetail() {
      const alias = this.productDetail.alias;
      SafeLink.redirect({
        url: `${window._global.url.h5}/wscvis/edu/prod-detail?alias=${alias}&kdt_id=${window._global.kdt_id}`,
        kdtId: window._global.kdt_id,
      });
    },
  },
};
</script>

<style lang="scss">
  @import 'mixins/index.scss';
  @import "var";

  .product-detail {
    position: relative;
    display: flex;
    padding: 25px 15px;
    background-color: $c-white;
    border-radius: 6px;

    &__img {
      position: relative;
      width: 137px;
      height: 77px;

      .img-wrap {
        max-height: 100%;
        max-width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .group-type {
        position: absolute;
        left: 0;
        bottom: 14px;
      }
    }

    &__title {
      display: inline-flex;
      flex-direction: column;
      justify-content: space-around;
      margin-left: 10px;

      .title {
        line-height: 18px;
        font-size: 16px;
        font-weight: 500;
        color: $c-black;
        word-break: break-all;

        @include multi-ellipsis(2);
      }

      .sale-num {
        line-height: 17px;
        font-size: 13px;
        color: $c-gray-dark;
      }
    }
  }
</style>
