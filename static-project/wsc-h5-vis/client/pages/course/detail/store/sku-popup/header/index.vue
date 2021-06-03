<template>
  <div class="sku-header">
    <img-wrap
      class="picture"
      :src="picture"
      :cover="false"
      fullfill="!100x0.jpg"
      width="114px"
      height="64px"
    />
    <div
      v-if="showPoints"
      class="content"
    >
      <div
        v-theme:color.main
        class="points-price"
      >
        {{ pointsAndStock.points }}
      </div>
      <p class="left-stock">
        剩余{{ pointsAndStock.stockNum }}个名额
        <span v-theme:color.main>
          （每人限兑{{ activityData.quota }}件）
        </span>
      </p>
    </div>
    <div
      v-else
      class="content"
    >
      <div>
        <current-price
          class="current-price"
          :price="priceAndStock.currentPrice"
          :active-color="mainColor"
          :turn-free="true"
          :mini-symbol="false"
          :mini-decimals="false"
          bold
          no-split
        />
        <mini-font-tag
          v-if="priceTag && !isCouponActivity"
          class="mini-price-tag"
          height="16px"
          :text="priceTag"
          :background-color="tagBg"
          :color="mainColor"
        />
      </div>

      <self-price-label
        v-if="priceTag && isCouponActivity"
        class="price-tag"
        :prefix="priceTag"
        :suffix="showSkuMorePrice ? '起': ''"
        :back-color="mainColor"
        :price="minCouponPrice"
        font-color="#fff"
        price-font-size="14"
        text-font-size="12"
      />
      <div
        v-if="priceAndStock.oldPrice"
        class="old-price-box"
      >
        <span class="old-prev">原价</span>
        <old-price
          class="old-price"
          :price="priceAndStock.oldPrice"
        />
      </div>
      <p
        v-if="!goodsData.hideStock"
        class="left-stock"
      >
        剩余{{ priceAndStock.stockNum }}个名额
      </p>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash';
import { ImgWrap, PriceLabel } from '@youzan/vis-ui';
import { fns } from '@youzan/vue-theme-plugin';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import MiniFontTag from '@/components/mini-font-tag';
import SelfPriceLabel from '@/pages/course/detail/components/price-label';

import store from '../../index';

const { CurrentPrice, OldPrice } = PriceLabel;

export default {
  components: {
    ImgWrap,
    CurrentPrice,
    OldPrice,
    MiniFontTag,
    'self-price-label': SelfPriceLabel,
  },

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
    goodsData() {
      return store.state.goodsData;
    },

    isCouponActivity() {
      return this.activityType === ACTIVITY_TYPE.COUPON;
    },

    activityData() {
      return get(store, `state.activityDataMap.${this.activityType}`, {});
    },

    activitySkuMap() {
      return get(this.activityData, `sku.map`, {});
    },

    picture() {
      return this.goodsData.pictures[0].url;
    },

    showPoints() {
      return this.activityType === ACTIVITY_TYPE.POINTS_EXCHANGE;
    },

    pointsAndStock() {
      const { selectedSku } = store.state;
      if (selectedSku) {
        const sku = this.activitySkuMap[selectedSku.id];
        if (sku) {
          return {
            points: this.getPointsStr(sku),
            stockNum: sku.stockNum,
          };
        }
      }
      const { minPoint, maxPoint, stockNum } = this.activityData.sku;
      if (
        minPoint.price === maxPoint.price &&
        minPoint.points === maxPoint.points
      ) {
        return {
          points: this.getPointsStr(minPoint),
          stockNum,
        };
      }
      return {
        points: `${this.getPointsStr(minPoint)} ~ ${this.getPointsStr(
          maxPoint,
        )}`,
        stockNum,
      };
    },

    isRangePrice() {
      let skuOptimalCoupons = get(
        this.activityData,
        'coupon.skuPreferenceList',
        [],
      );
      if (skuOptimalCoupons.length <= 1) {
        return false;
      }
      const totalPreferentialPrice = skuOptimalCoupons.map(
        (item) => item.preferentialPrice || 0,
      );
      const uniqPrices = Array.from(new Set(totalPreferentialPrice));
      if (uniqPrices.length <= 1) return false;
      return true;
    },
    showSkuMorePrice() {
      const { selectedSku } = store.state;
      if (selectedSku) return false;
      return this.isRangePrice;
    },
    minPrice() {
      const { currentPrice } = this.priceAndStock;
      if (Array.isArray(currentPrice)) {
        return currentPrice[0];
      }
      return currentPrice;
    },
    skuCouponPrices() {
      return Object.keys(this.activitySkuMap).reduce((total, key) => {
        const cur = this.activitySkuMap[key];
        total.push(cur.couponPrice);
        return total;
      }, []);
    },
    minSkuCoupnPrice() {
      return Math.min(...this.skuCouponPrices);
    },
    minCouponPrice() {
      const { selectedSku } = store.state;
      if (this.activityType !== ACTIVITY_TYPE.COUPON) return this.minPrice;
      if (!selectedSku) {
        return this.minSkuCoupnPrice;
      }
      const curSku = this.activitySkuMap[selectedSku.id];
      return curSku.couponPrice;
    },

    priceAndStock() {
      const { selectedSku } = store.state;
      if (selectedSku) {
        if (this.activityData.status === ACTIVITY_STATUS.GOING) {
          if (
            this.activityType === ACTIVITY_TYPE.LADDER_GROUPON &&
            this.activitySkuMap[selectedSku.id]
          ) {
            let { selectedGrouponLadder } = store.state;
            if (this.payload) {
              selectedGrouponLadder = this.payload.scale;
            }
            if (selectedGrouponLadder) {
              return {
                currentPrice: this.activitySkuMap[selectedSku.id]
                  .ladderPriceMap[selectedGrouponLadder],
                oldPrice: selectedSku.price,
                stockNum: selectedSku.stockNum,
              };
            }
            return {
              currentPrice: [
                this.activitySkuMap[selectedSku.id].minPrice,
                this.activitySkuMap[selectedSku.id].maxPrice,
              ],
              oldPrice: selectedSku.price,
              stockNum: selectedSku.stockNum,
            };
          }
          if (
            this.activitySkuMap[selectedSku.id] &&
            Number.isInteger(this.activitySkuMap[selectedSku.id].price)
          ) {
            let res = {
              currentPrice: this.activitySkuMap[selectedSku.id].price,
              oldPrice: selectedSku.price,
              stockNum: Number.isInteger(
                this.activitySkuMap[selectedSku.id].stockNum,
              )
                ? this.activitySkuMap[selectedSku.id].stockNum
                : selectedSku.stockNum,
            };

            // 有券后价，但是没活动价，原价不需要划线展示
            if (
              this.activityType === ACTIVITY_TYPE.COUPON &&
              !Number.isInteger(
                this.activitySkuMap[selectedSku.id].preActivityPrice,
              )
            ) {
              Object.assign(res, { oldPrice: '' });
            }
            return res;
          }
        }
        return {
          currentPrice: selectedSku.price,
          oldPrice: '',
          stockNum: selectedSku.stockNum,
        };
      }
      if (this.activityData.status === ACTIVITY_STATUS.GOING) {
        if (
          this.activityData.sku &&
          this.activityData.sku.minPrice &&
          this.activityData.sku.maxPrice
        ) {
          const oldPriceList = [];
          Object.keys(this.activitySkuMap).forEach((skuId) => {
            this.goodsData.sku.list.forEach((sku) => {
              if (+skuId === sku.id) {
                oldPriceList.push(sku.price);
              }
            });
          });
          let currentPrice = [
            this.activityData.sku.minPrice,
            this.activityData.sku.maxPrice,
          ];
          if (
            this.activityType === ACTIVITY_TYPE.LADDER_GROUPON &&
            this.payload
          ) {
            const ladderPrice = this.activityData.ladder[this.payload.scale];
            currentPrice = [ladderPrice.minPrice, ladderPrice.maxPrice];
          }
          return {
            currentPrice,
            oldPrice: [Math.min(...oldPriceList), Math.max(...oldPriceList)],
            stockNum: Number.isInteger(this.activityData.sku.stockNum)
              ? this.activityData.sku.stockNum
              : this.goodsData.sku.stockNum,
          };
        }
      }
      return {
        currentPrice: [
          this.goodsData.sku.minPrice,
          this.goodsData.sku.maxPrice,
        ],
        oldPrice: '',
        stockNum: this.goodsData.sku.stockNum,
      };
    },

    priceTag() {
      // TODO 多人拼团券后， ”多人“待接入
      if (this.activityData.status === ACTIVITY_STATUS.GOING) {
        if (this.activityType === ACTIVITY_TYPE.TUITION) {
          return this.activityData.priceTag;
        }
        const { selectedSku } = store.state;
        if (!selectedSku) {
          return this.activityData.priceTag;
        }
        if (Object.keys(this.activitySkuMap).includes(String(selectedSku.id))) {
          return this.activityData.priceTag;
        }
      }
      return '';
    },

    mainColor() {
      return this.$theme.colors.main;
    },

    tagBg() {
      return fns.hexToRgba(this.mainColor, 0.1);
    },
  },

  methods: {
    getPointsStr(points) {
      const { pointsName } = store.state.shopConfig;
      let str = `${points.points}${pointsName}`;
      if (points.price) {
        str += `+${points.price / 100}元`;
      }
      return str;
    },
  },
  // watch: {
  //   priceAndStock(val) {
  //     console.log('watch===priceAndStock', val);
  //   },
  // },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.sku-header {
  @include clearfix;

  position: relative;
  padding: 12px 0 12px 122px;
  margin: 0 16px;

  .picture {
    float: left;
    margin-left: -122px;
    border-radius: 4px;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 64px;
    padding-right: 20px;

    .points-price {
      margin-bottom: 8px;
      font-size: 16px;
    }

    .current-price {
      font-size: 16px;
      ::v-deep .pl-int-number-1 {
        font-family: Avenir;
      }

      ::v-deep .vis-price-label__item {
        line-height: 20px;
      }

      ::v-deep .vis-price-symbol {
        font-size: 16px;
      }
    }

    .mini-price-tag {
      padding: 0 2px;
      margin-left: 4px;
      vertical-align: text-top;
    }

    .price-tag {
      margin-top: 4px;
      align-self: flex-start;
      box-sizing: border-box;
      padding: 4px 8px;
      border-radius: 11px;
      height: 22px;
      line-height: 18px;
    }

    .old-prev {
      font-size: 12px;
      // color: $gray-icon-color;
      color: $disabled-color;
    }

    .old-price {
      display: inline;
      font-size: 12px;
      color: $gray-icon-color;
      ::v-deep .pl-int-number-1 {
        font-family: Avenir;
      }
    }

    .old-price-box {
      line-height: 14px;
      margin-top: 8px;
    }

    .price {
      margin-top: 4px;
    }

    .left-stock {
      margin-top: 8px;
      font-size: 12px;
      line-height: 14px;
      color: $disabled-color;
    }
  }

  // after 被 clearfix 用了
  &::before {
    @include border-retina(bottom, $light-border-color);
  }
}
</style>
