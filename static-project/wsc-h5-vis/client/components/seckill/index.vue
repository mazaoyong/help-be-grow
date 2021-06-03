<template>
  <activity-bar
    :min-price="minPrice"
    :max-price="maxPrice"
    :min-origin="minOrigin"
    :max-origin="maxOrigin"
    :total-stock="value.activityStock"
    :left-stock="value.currentStock"
    :tag="value.tag"
    :start-time="startTime"
    :end-time="endTime"
  />
</template>

<script>
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import get from 'lodash/get';
import ActivityBar from 'components/activity-bar';

export default {
  name: 'seckill',

  components: {
    [ActivityBar.name]: ActivityBar,
  },

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  computed: {
    minPrice() {
      const min = minBy(this.value.skuInfos, item => item.seckillPrice);
      return get(min, 'seckillPrice');
    },

    maxPrice() {
      const max = maxBy(this.value.skuInfos, item => item.seckillPrice);
      return get(max, 'seckillPrice');
    },

    minOrigin() {
      const min = minBy(this.value.skuInfos, item => item.price);
      return get(min, 'price');
    },

    maxOrigin() {
      const max = maxBy(this.value.skuInfos, item => item.price);
      return get(max, 'price');
    },

    startTime() {
      return new Date(this.value.beginAt);
    },

    endTime() {
      return new Date(this.value.endAt);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
