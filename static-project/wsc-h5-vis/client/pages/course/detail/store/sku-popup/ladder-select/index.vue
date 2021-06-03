<template>
  <div v-if="show" class="ladder-select">
    <div class="van-sku-row van-hairline--bottom">
      <div class="van-sku-row__title">
        拼团类型
      </div>
      <span
        v-for="ladder in ladders"
        :key="ladder.scale"
        :class="{ 'van-sku-row__item--active': ladder.scale === selectedGrouponLadder }"
        class="van-sku-row__item"
        @click="selectLadder(ladder.scale)"
      >
        <span class="van-sku-row__item-name">{{ ladder.text }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash';
import format from '@youzan/utils/money/format';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import store from '../../index';

export default {
  props: {
    activityType: {
      type: Number,
      default: 0,
    },
    // eslint-disable-next-line vue/require-prop-types
    payload: {
      default: null,
    },
  },

  computed: {
    show() {
      return this.activityType === ACTIVITY_TYPE.LADDER_GROUPON && !this.payload;
    },

    selectedGrouponLadder() {
      return store.state.selectedGrouponLadder;
    },

    activityData() {
      return get(store, `state.activityDataMap.${this.activityType}`, {});
    },

    activitySkuMap() {
      return get(this.activityData, `sku.map`, {});
    },

    ladders() {
      const { selectedSku } = store.state;
      if (selectedSku) {
        const { ladderPriceMap } = this.activitySkuMap[selectedSku.id];
        return Object.keys(ladderPriceMap).map(scale => ({
          scale,
          text: `￥${format(ladderPriceMap[scale], true, false)}/${scale}人团`,
        }));
      }
      return Object.keys(this.activityData.ladder).map(scale => {
        const maxPrice = this.activityData.ladder[scale].maxPrice;
        const minPrice = this.activityData.ladder[scale].minPrice;
        return {
          scale,
          text: `￥${maxPrice === minPrice ? format(minPrice, true, false) : `${format(minPrice, true, false)}-${format(maxPrice, true, false)}`}/${scale}人团`,
        };
      });
    },
  },

  methods: {
    selectLadder(scale) {
      if (this.selectedGrouponLadder === scale) {
        store.commit('selectedGrouponLadder', null);
        return;
      }
      store.commit('selectedGrouponLadder', scale);
    },
  },
};
</script>

<style lang="scss" scoped>
.ladder-select {
  margin-top: 12px;
}
</style>
