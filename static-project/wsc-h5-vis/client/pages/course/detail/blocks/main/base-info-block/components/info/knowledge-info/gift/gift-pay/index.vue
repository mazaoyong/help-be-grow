<template>
  <div class="gift-pay">
    <div class="line info">
      <img-wrap
        class="cover"
        width="100px"
        height="56px"
        :src="cover"
        :fullfill="'!small.jpg'"
        :cover="false"
      />
      <p>{{ title }}</p>
    </div>
    <div class="line">
      <span>购买数量：</span>
      <van-stepper
        v-model="count"
        min="1"
        max="1000"
        integer
      />
    </div>
    <div v-if="price" class="line">
      <span>总金额：</span>
      <span v-theme:color.main>￥{{ price }}</span>
    </div>
  </div>
</template>

<script>
import { Stepper, Toast } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import format from '@youzan/utils/money/format';
import { SELLER_TYPE } from '@/constants/course/seller-type';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';

export default {
  components: {
    'van-stepper': Stepper,
    ImgWrap,
  },

  props: {
    goodsData: {
      type: Object,
      default: () => ({}),
    },
    activityTypes: {
      type: Array,
      default: () => [],
    },
    activityData: {
      type: Object,
      default: () => ({}),
    },
    activityDataMap: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      count: 1,
    };
  },

  computed: {
    cover() {
      if (this.goodsData.sellerType === SELLER_TYPE.COLUMN) {
        return this.goodsData.column.cover;
      }
      return this.goodsData.pictures[0].url;
    },

    title() {
      if (this.goodsData.sellerType === SELLER_TYPE.COLUMN) {
        return this.goodsData.column.title;
      }
      return this.goodsData.title;
    },

    price() {
      if (this.goodsData.sellerType === SELLER_TYPE.COLUMN) {
        return format(this.goodsData.column.price * this.count);
      }
      if (this.activityTypes.includes(ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT) &&
        this.activityDataMap[ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT].status === ACTIVITY_STATUS.GOING) {
        return 0;
      }
      if (this.activityTypes.includes(ACTIVITY_TYPE.CUSTOMER_DISCOUNT)) {
        return format(this.activityDataMap[ACTIVITY_TYPE.CUSTOMER_DISCOUNT].sku.minPrice * this.count);
      }
      return format(this.goodsData.sku.minPrice * this.count);
    },
  },

  methods: {
    // 在 ./index.js 中调用
    handleBuy() {
      const { quota = 0, quotaUsed = 0, isAllowContinueBuy = 1 } = this.activityData;
      if (quota > 0 && isAllowContinueBuy === 0 && this.count > quota - quotaUsed) {
        Toast(`该课程活动期间每人限购${quota}件，你之前已经购买了${quotaUsed}件`);
        return;
      }
      if (this.count < 1) {
        this.count = 1;
      } else if (this.count > 1000) {
        this.count = 1000;
      }
      this.$emit('resolve', this.count);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.gift-pay {
  .line {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    font-size: 14px;
    line-height: 28px;

    &::after {
      @include border-retina(bottom, $light-border-color);
    }

    &:last-child::after {
      @include border-retina(bottom, transparent);
    }
  }

  .info {
    justify-content: start;

    .cover {
      margin-right: 12px;
      border-radius: 2px;
    }
  }
}
</style>
