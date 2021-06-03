<template>
  <div class="groupon-section">
    <!-- 拼团活动头部信息 -->
    <!-- <groupon-title
      class="groupon-section__margin"
      :condition-num="promotionData.promotionDetail.conditionNum"
      :promotion-price="promotionPrice"
      :origin-price="originPrice"
      :start-time="promotionData.startAt"
      :end-time="promotionData.endAt"
    /> -->

    <!-- 分割块占位 -->
    <div class="groupon-section__going-block" />

    <!-- 凑团列表 -->
    <groupon-going-list
      v-if="showPromotionList"
      class="groupon-section__margin"
      :groupon-list="grouponList"
      :product-id="productId"
      @select="handleSelect"
    />

    <!-- 拼团玩法介绍 -->
    <groupon-intro
      :activity-num="promotionData.promotionDetail.conditionNum"
      :group-type="promotionData.promotionDetail.groupType"
      :ladder-price="promotionData.promotionDetail.ladderPrice"
      :is-going="Boolean(grouponList.length)"
    />
  </div>
</template>

<script>
// import GrouponTitle from './groupon-components/GrouponTitle';
import GrouponGoingList from './groupon-components/GrouponGoingList';
import GrouponIntro from './groupon-components/GrouponIntro';

export default {
  name: 'groupon-section',

  components: {
    // 'groupon-title': GrouponTitle,
    'groupon-going-list': GrouponGoingList,
    'groupon-intro': GrouponIntro,
  },

  props: {
    promotionData: Object,
    originPrice: [String, Number, Array],
    productId: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    grouponList() {
      return this.promotionData.promotionDetail.groupList || [];
    },
    promotionPrice() {
      return this.promotionData.promotionPrice || '';
    },

    showPromotionList() {
      return this.promotionData &&
          this.promotionData.promotionDetail &&
          this.promotionData.promotionDetail.isShowJoinGroup &&
          this.grouponList.length > 0 &&
          !this.promotionData.userStatus.status;
    },
  },

  methods: {
    handleSelect(alias) {
      this.$emit('select', alias);
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.groupon-section {
  background-color: $c-white;
  padding-top: 3px;

  /* padding: 0 15px; */

  &__margin {
    margin: 0 16px;
  }

  &__going-block {
    height: 10px;
    background-color: #f8f8f8;
  }

  &__going-line {
    height: 1px;
    background-color: #f2f2f2;
    margin-left: 15px;
  }
}
</style>
