<template>
  <div class="mp-pop">
    <h3 class="title">
      {{ title }}
    </h3>
    <div v-if="shopData" class="shop-data">
      <img class="shop-logo" :src="shopData.logo">
      <p class="shop-name">
        {{ shopData.name }}
      </p>
    </div>
    <div class="img-wrap">
      <img class="img" :src="qrCode">
    </div>
    <p class="tip">
      {{ tip }}
    </p>
    <van-button
      class="button"
      block
      round
      @click="click"
    >
      我知道了
    </van-button>
  </div>
</template>

<script>
import { Button } from 'vant';

export default {
  components: {
    'van-button': Button,
  },

  props: {
    title: {
      type: String,
      default: '关注公众号',
    },
    qrCode: {
      type: String,
      default: '',
    },
    tip: {
      type: String,
      default: '识别二维码，或截图保存',
    },
    shopData: {
      type: Object,
      default: null,
    },
  },

  methods: {
    click() {
      this.$emit('resolve');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.mp-pop {
  padding: 0 24px 28px;
  color: $main-text-color;
  text-align: center;

  .title {
    font-size: 16px;
    font-weight: 500;
    line-height: 44px;
  }

  .shop-data {
    .shop-logo {
      width: 56px;
      height: 56px;
    }

    .shop-name {
      margin-top: 16px;
      font-weight: 500;
    }
  }

  .img-wrap {
    position: relative;
    width: 178px;
    height: 178px;
    margin: 20px auto 0;

    &::after {
      @include border-retina;
    }

    .img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .tip {
    margin-top: 16px;
    font-size: 14px;
    line-height: 20px;
  }

  .button {
    margin-top: 20px;
  }
}
</style>
