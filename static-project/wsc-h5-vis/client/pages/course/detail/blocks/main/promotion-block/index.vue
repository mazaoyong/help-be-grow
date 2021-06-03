<template>
  <info-cell-group
    v-if="show"
    v-tab="tab"
    class="promotion-block"
  >
    <info-cell
      title="促销"
      is-link
      @click="handleClick"
    >
      <div class="promotion-box">
        <div
          v-if="isValidArray(firstTwoCoupons)"
          class="info coupon-info"
        >
          <mini-font-tag
            :color="mainColor"
            :background-color="backgroundColor"
            class="tag"
            text="领券"
          />
          <template>
            <template v-for="coupon in firstTwoCoupons">
              <mini-font-tag
                :key="coupon.id"
                :color="mainColor"
                :background-color="backgroundColor"
                :text="coupon.useThresholdAndValueCopywriting"
                class="tag coupon-tag"
              />
            </template>
          </template>
        </div>
        <div
          v-if="!!meetReduceDescription"
          class="info info-present"
        >
          <mini-font-tag
            :color="mainColor"
            :background-color="backgroundColor"
            class="tag"
            text="买赠"
          />
          <span>{{ meetReduceDescription }}</span>
        </div>
      </div>
    </info-cell>
    <promotion-popup v-model="showPromotionPopup" />
  </info-cell-group>
</template>

<script>
import { fns } from '@youzan/vue-theme-plugin';
import MiniFontTag from '@/components/mini-font-tag';
import {
  InfoCell,
  InfoCellGroup,
} from '@/pages/course/detail/components/info-cell';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import PromotionPopup from './components/promotion-popup';
import { get, uniqBy } from 'lodash';
import { mapActions } from 'vuex';

export default {
  components: {
    MiniFontTag,
    InfoCell,
    InfoCellGroup,
    PromotionPopup,
  },

  data() {
    return {
      showPromotionPopup: false,
    };
  },

  rootState: [
    'goodsData',
    'activityTypes',
    'activityData',
    'env',
    'goodsCoupons',
  ],
  rootGetters: ['isColumn', 'isOnlineCourse', 'meetReduceDescription'],

  computed: {
    firstTwoCoupons() {
      if (!(Array.isArray(this.goodsCoupons) && this.goodsCoupons.length)) {
        return [];
      }
      const couponsMap = this.goodsCoupons.reduce((total, cur, idx) => {
        const { id } = cur;
        return Object.assign(total, { [id]: { ...cur, order: idx } });
      }, {});

      let skuOptimalCoupons = get(
        this.activityData,
        'coupon.skuPreferenceList',
        [],
      ).map((item) => ({ id: item.activityId, ...item }));

      // 没有sku最佳券列表
      if (!skuOptimalCoupons.length) {
        return this.goodsCoupons.slice(0, 2);
      }

      const skuCache = {};
      skuOptimalCoupons = uniqBy(skuOptimalCoupons, 'id').map((item) => {
        const { id } = item;
        skuCache[id] = true;
        return { ...item, order: couponsMap[id].order };
      });

      if (skuOptimalCoupons.length >= 2) {
        return skuOptimalCoupons.sort((a, b) => a.order - b.order).slice(0, 2);
      }

      // sku list not enough
      const otherCoupons = this.goodsCoupons.filter(
        (item) => !skuCache[item.id],
      );

      const composeCoupons = skuOptimalCoupons.concat(otherCoupons);
      if (composeCoupons.length >= 2) {
        return composeCoupons.slice(0, 2);
      }
      return composeCoupons;
    },
    show() {
      if (this.isOnlineCourse && this.env.isIOSWeapp) {
        return false;
      }
      if (this.isOnlineCourse && this.goodsData.isOwnAsset) {
        return false;
      }
      const hasMeetReduce =
        this.activityTypes.includes(ACTIVITY_TYPE.KNOWLEDGE_MEET_REDUCE) &&
        this.activityData.meetReduce;
      const hasCoupon = this.isValidArray(this.firstTwoCoupons);
      return hasMeetReduce || hasCoupon;
    },

    tab() {
      if (this.isColumn) {
        return {
          index: 1,
          title: '专栏介绍',
        };
      }
      return null;
    },

    mainColor() {
      return this.$theme.colors.main;
    },

    backgroundColor() {
      return fns.hexToRgba(this.mainColor, 0.1);
    },
  },

  mounted() {
    this.fetchCouponList();
  },

  methods: {
    ...mapActions(['fetchCouponList']),
    handleClick() {
      this.showPromotionPopup = true;
    },
    isValidArray(val) {
      return Array.isArray(val) && val.length;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.promotion-block {
  margin-bottom: 8px;

  ::v-deep .van-cell__right-icon {
    align-self: flex-start;
  }

  .info:not(:first-child) {
    margin-top: 12px;
  }

  .promotion-box {
    @include ellipsis;

    .info-cell {
      padding: 0;
    }
  }

  .coupon-tag {
    border-radius: 0.2em;
  }

  .tag {
    @include mini-tag;
    padding: 0 2px;
    margin-right: 8px;
  }

  ::v-deep .tag {
    @include mini-tag;
  }

  .info-present {
    @include ellipsis;
  }

  .info {
    .tag {
      padding: 0 2px;
      margin-right: 8px;
    }
  }
}
</style>
