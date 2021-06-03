<template>
  <section v-if="offlineData.name" class="shop-topbar">
    <template v-if="!hideStore">
      <a class="shop-topbar__info">
        <img :src="shopLogo" alt="店铺头像" class="shop-topbar__logo">
        <i class="shop-topbar__nickname">{{ offlineData.name }}</i>
      </a>
      <a v-if="offlineData.show" :href="offlineData.url" class="shop-topbar__info">[切换]</a>
    </template>
    <!-- <div class="shop-topbar__links">
      <a v-if="showRecord" :href="recordUrl" class="shop-topbar__record">我的记录</a>
    </div> -->
  </section>
</template>

<script>
import { Icon } from 'vant';
import fullfillImage from 'zan-utils/fullfillImage';

const _global = window._global;

export default {
  name: 'top-bar',

  components: {
    [Icon.name]: Icon,
  },

  props: {
    hideStore: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      offlineData: _global.offlineData || {},
      mpData: _global.mp_data || {},
    };
  },

  computed: {
    shopLogo() {
      if (this.mpData.logo) {
        return fullfillImage(this.mpData.logo, '!60x60.jpg');
      }
      return 'https://img01.yzcdn.cn/public_files/2016/05/13/8f9c442de8666f82abaf7dd71574e997.png!60x60.jpg';
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

$gray-dark: #666;
$gray-light: #999;

.shop-topbar {
  position: relative;
  display: flex;
  height: 36px;
  padding-right: 160px;
  color: $gray-dark;
  align-items: center;
  background-color: #f8f8f8;

  /* background: linear-gradient(to bottom, #f2f2f2, #fff); */

  &__info,
  &__links {
    font-size: 14px;
    line-height: 24px;

    a,
    i {
      color: $gray-dark;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    padding-left: 15px;

    @include ellipsis;

    & + & {
      overflow: visible;
      color: $gray-dark;
    }
  }

  &__logo {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    vertical-align: middle;
    border-radius: 100%;

    /* box-shadow: 0 0 3px rgba(0, 0, 0, 0.25); */
  }

  &__nickname {
    @include ellipsis;
  }

  &__links {
    position: absolute;
    top: 0;
    right: 15px;
    display: flex;
    align-items: center;
    line-height: 36px;

    > a {
      display: inline-block;
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
