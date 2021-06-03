<template>
  <div class="good-card" @click="onClick">
    <div class="good-card__img">
      <img-wrap
        :width="`137px`"
        :height="`77px`"
        :src="picture"
        :fullfill="'!145x145.jpg'"
        :cover="false"
      />
    </div>
    <div class="good-card__title">
      <p class="title">
        {{ title }}
      </p>
      <p
        v-if="salesNum"
        class="sale-num"
      >
        {{ salesNum }}人正在学习
      </p>
    </div>
  </div>
</template>

<script>
// import { Tag } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
// import * as SafeLink from '@youzan/safe-link';

export default {
  name: 'good-card',

  components: {
    // 'van-tag': Tag,
    ImgWrap,
  },

  props: {
    picture: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    salesNum: {
      type: Number,
      default: 0,
    },
  },

  methods: {
    onClick() {
      this.$emit('card-click');
    },
  },
};
</script>

<style lang="scss">
  @import 'mixins/index.scss';
  @import "var";

  .good-card {
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
