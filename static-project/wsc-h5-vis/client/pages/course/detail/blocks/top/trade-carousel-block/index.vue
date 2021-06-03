<template>
  <trade-carousel
    v-if="show"
    class="trade-carousel-block"
    :class="{ 'has-top': offlineData.name }"
    :goods-id="goodsData.goodsId"
    :root-kdt-id="shopMetaInfo.rootKdtId"
    extension="报名了该课程"
  />
</template>

<script>
import inject from '@/common/inject-h5-components';

const [TradeCarousel] = inject({ pureComponents: ['trade-carousel'] });

export default {
  components: {
    TradeCarousel,
  },

  rootState: ['goodsData', 'shopMetaInfo', 'offlineData'],

  computed: {
    show() {
      if (this.goodsData.courseBoughtDisplay) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.trade-carousel-block {
  z-index: 100;

  &.has-top {
    top: 48px;
  }
}
</style>
