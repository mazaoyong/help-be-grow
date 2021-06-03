<template>
  <div v-if="show" class="meet-reduce">
    <p>赠品</p>
    <p class="info">
      <span class="desc">{{ meetReduceDescription }}</span>
      <span v-if="goodsList.length" class="more" @click="handleClick">
        查看赠品
        <van-icon name="arrow" class="arrow" />
      </span>
    </p>
  </div>
</template>

<script>
import { get } from 'lodash';
import { Icon } from 'vant';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import openPresentGoods from '@/pages/course/detail/components/present-goods';
import store from '../../index';

export default {
  components: {
    'van-icon': Icon,
  },

  computed: {
    activityTypes() {
      return store.state.activityTypes;
    },

    activityData() {
      return store.state.activityData;
    },

    selectedSku() {
      return store.state.selectedSku;
    },

    meetReduceDescription() {
      return store.getters.meetReduceDescription;
    },

    hasActivitySkuIds() {
      const presentInfoList = get(this.activityData, 'meetReduce.presentInfoList', []);
      return presentInfoList.map(item => item.skuId);
    },

    goodsList() {
      return get(this.activityData, 'meetReduce.presentInfoList[0].presentGoodsList', []);
    },

    show() {
      if (this.activityTypes.includes(ACTIVITY_TYPE.KNOWLEDGE_MEET_REDUCE)) {
        if (this.selectedSku) {
          return this.hasActivitySkuIds.includes(this.selectedSku.id);
        } else { // 未选中 sku 时，展示买赠信息
          return true;
        }
      }
      return false;
    },
  },

  methods: {
    handleClick() {
      openPresentGoods({
        props: {
          list: this.goodsList,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.meet-reduce {
  padding: 12px 0;

  .info {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    font-size: 12px;

    .desc {
      @include ellipsis;
    }

    .more {
      flex-shrink: 0;
      color: $vice-text-color;

      .arrow {
        vertical-align: bottom;
      }
    }
  }
}
</style>
