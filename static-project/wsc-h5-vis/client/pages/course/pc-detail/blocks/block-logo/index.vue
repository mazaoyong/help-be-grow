<template>
  <img-wrap
    class="shop-logo"
    :data-shopname="shopName"
    height="24px"
    :src="shopLogo"
  />
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'logo-block',

  components: {
    ImgWrap,
  },

  data() {
    const {
      logo: shopLogo = '',
      shop_name: shopName = '',
    } = _global.mp_data;

    return {
      shopLogo,
      shopName,
    };
  },
};
</script>

<style lang="scss">
.shop-logo {
  position: relative;
  height: 24px;
  overflow: visible;

  &::after {
    position: absolute;
    top: 50%;
    left: calc(100% + 16px);
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #323233;
    white-space: nowrap;
    content: attr(data-shopname);
    transform: translateY(-50%);
  }

  .imgWrap__img {
    width: auto;
  }
}
</style>
