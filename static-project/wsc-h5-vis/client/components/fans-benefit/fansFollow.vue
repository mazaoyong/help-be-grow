<template>
  <vis-follow-mp
    v-model="showPop"
    :qrcode-url="qrcodeUrl"
    :description="description"
  >
    <div
      slot="shopInfo"
      class="shopinfo"
    >
      <img class="shop-logo" :src="logo">
      <h4 class="shop-name">
        {{ shopName }}
      </h4>
    </div>
  </vis-follow-mp>
</template>

<script>
import { FollowMp } from '@youzan/vis-ui';
const { miniprogram = {}, mp_data: mpData = {} } = _global;
const isWeapp = miniprogram.isWeapp;

export default {
  name: 'fans-follow',

  components: {
    'vis-follow-mp': FollowMp,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    qrcodeUrl: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      shopName: mpData.shop_name,
      logo: mpData.logo,
      description: isWeapp ? '长按保存图片识别或扫一扫关注品牌官网微信公众号' : '长按识别二维码关注店铺',
    };
  },

  computed: {
    showPop: {
      get() {
        return this.value;
      },

      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>

<style lang="scss">
.shopinfo {
  .shop-logo {
    width: 56px;
    height: 56px;
    margin-bottom: 12px;
  }

  .shop-name {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
