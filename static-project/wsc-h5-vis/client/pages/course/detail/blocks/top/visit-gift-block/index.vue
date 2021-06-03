<template>
  <shop-ad
    :kdt-id="kdtId"
    :is-login="user.hasLogin"
    :source="2"
    support-visit-gift
  />
</template>

<script>
import inject from '@/common/inject-h5-components';

const [ShopAd] = inject({ pureComponents: ['shop-ad'] });

export default {
  components: {
    ShopAd,
  },

  rootState: ['kdtId', 'user'],
};
</script>
