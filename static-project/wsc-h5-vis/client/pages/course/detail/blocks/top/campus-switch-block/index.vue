<template>
  <shop-top-bar
    v-if="show"
    :shop-data="shopData"
    :offline-data="parsedOfflineData"
    :show-search-icon="false"
    show
  />
</template>

<script>
import fullfillImage from '@youzan/utils/fullfillImage';
import inject from '@/common/inject-h5-components';

const [ShopTopBar] = inject({ pureComponents: ['shop-top-bar'] });

export default {
  components: {
    ShopTopBar,
  },

  rootState: ['offlineData', 'mpData', 'kdtId', 'shopMetaInfo'],

  computed: {
    show() {
      if (this.offlineData.name) {
        return true;
      }
      return false;
    },

    shopData() {
      return {
        shopName: this.offlineData.name,
        shopLogo: fullfillImage(this.mpData.logo, '!small.png'),
        homepageUrl: `/wscshop/showcase/homepage?kdt_id=${this.kdtId}`,
        recordUrl: `/wscuser/membercenter?kdt_id=${this.shopMetaInfo.rootKdtId}&sub_kdt_id=${this.kdtId}`,
      };
    },

    parsedOfflineData() {
      return {
        offlineUrl: this.offlineData.url,
        show: Boolean(this.offlineData.show),
        hideStore: false,
      };
    },
  },
};
</script>
