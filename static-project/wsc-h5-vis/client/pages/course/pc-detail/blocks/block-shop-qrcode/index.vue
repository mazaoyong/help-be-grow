<template>
  <div class="shop-qrcode">
    <div class="shop-qrcode__shop-info">
      <div class="shop-qrcode__shop-info__main">
        <img-wrap
          class="shop-qrcode__shop-info__logo"
          :src="shopLogo"
          width="40px"
          height="40px"
        />
        <div class="shop-qrcode__shop-info__title">
          {{ shopName }}
        </div>
      </div>

      <div class="shop-qrcode__shop-info__desc">
        {{ intro }}
      </div>
    </div>

    <van-icon
      class="shop-qrcode__arrow-down"
      name="arrow-down"
      size="16"
      color="#323233"
    />

    <div class="shop-qrcode__home-info">
      <div class="shop-qrcode__text">
        <div class="shop-qrcode__text--desc">
          扫码访问机构<br>获取更多精彩
        </div>
      </div>

      <img-wrap
        class="shop-qrcode__home-qrcode"
        :src="homeQrcode"
        width="80px"
        height="80px"
        disable-lazyload
      />
    </div>
  </div>
</template>

<script>
import { Icon as VanIcon } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import { getQrcode } from '../../apis';

export default {
  name: 'shop-qrcode',

  components: {
    VanIcon,
    ImgWrap,
  },

  data() {
    const {
      logo: shopLogo = '',
      shop_name: shopName = '',
      intro = '',
    } = _global.mp_data;

    return {
      shopLogo,
      shopName,
      intro,
      homeQrcode: '',
    };
  },

  created() {
    getQrcode({
      url: `https://h5.youzan.com/wscshop/showcase/homepage?kdt_id=${_global.kdt_id}` || '',
      errorCorrectionLevel: 1,
      deleteWhite: true,
    }).then(res => {
      if (res) {
        this.homeQrcode = res;
      }
    }).catch(errMsg => {
      console.log(errMsg);
    });
  },
};
</script>

<style lang="scss">
.shop-qrcode {
  position: relative;
  padding: 24px;
  margin-top: 16px;
  text-align: center;
  cursor: pointer;
  background: #fff;

  &:hover {
    .van-icon-arrow-down {
      visibility: hidden;
    }

    .shop-qrcode__home-info {
      display: flex;
    }
  }

  &__shop-info {
    margin-bottom: 24px;
    color: #323233;
    text-align: left;

    &__main {
      display: flex;
      align-items: center;
    }

    &__logo {
      flex: 0 0 40px;
    }

    &__title {
      margin-left: 16px;
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
    }

    &__desc {
      margin-top: 24px;
      font-size: 14px;
      line-height: 20px;
    }
  }

  &__text {
    flex: 1 1 auto;

    &--desc {
      margin-top: 24px;
      font-size: 14px;
      line-height: 20px;
      color: #323233;
    }
  }

  &__home-info {
    position: absolute;
    bottom: -88px;
    left: 0;
    display: none;
    width: calc(100% - 48px);
    padding: 24px;
    padding-top: 24px;
    text-align: left;
    background: #fff;

    &::before {
      position: absolute;
      top: 0;
      right: 24px;
      left: 24px;
      height: 1px;
      background: #ebedf0;
      content: '';
    }

    .shop-qrcode__text--desc {
      margin-top: 20px;
    }
  }

  &__home-qrcode {
    flex: 0 0 80px;
  }
}
</style>
