<template>
  <div class="promotion-pop__container">
    <div
      v-for="(promotion, $index) in promotionFormatInfo"
      :key="promotion.skuId"
      class="promotion-pop__container-item"
      @click="onPresentList($index)"
    >
      <div class="promotion-pop__container-item-tag theme-tag">
        {{ promotion.tags }}
      </div>
      <div class="promotion-pop__container-item-detail">
        <p class="promotion-pop__container-item-detail-desc">
          {{ promotion.descriptions }}
        </p>
        <div
          v-if="promotion.presentGoodsList.length > 0"
          class="promotion-pop__container-item-detail-mask"
          :style="{ backgroundColor: theme }"
        />
        <div
          v-if="promotion.presentGoodsList.length > 0"
          class="promotion-pop__container-item-detail-present"
        >
          <template v-for="(present, index) in promotion.presentGoodsList">
            <div
              v-if="index < 2"
              :key="index"
              class="promotion-pop__container-item-detail-present-wrap"
            >
              <div
                class="present-item"
              >
                <img-wrap
                  :width="'112px'"
                  :height="'64px'"
                  :src="present.imageUrl"
                  :fullfill="'!220x220.jpg'"
                  :cover="false"
                />
                <p
                  class="present-item__detail"
                >
                  <vis-price-current
                    :price="present.presentPrice"
                    :mini-symbol="false"
                    :mini-decimals="false"
                    :active-color="theme"
                    font-size="12"
                    class="present-item__detail-price"
                  />
                  <span class="present-item__detail-sku">
                    {{ present.presentSkuDesc }}
                  </span>
                </p>
              </div>
            </div>
          </template>

          <div
            v-if="isShowMore[$index]"
            class="present-more"
          >
            <vis-icon name="arrow" size="10px" color="#fff" />
            <p class="present-more__tip">
              查看更多
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="promotion-pop__container-action bottomcart">
      <van-button
        class="main-btn"
        round
        @click="onClose"
      >
        完成
      </van-button>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant';
import { ImgWrap, PriceLabel, Icon } from '@youzan/vis-ui';
import { themeColor, themeTypeMap } from 'common/constants';

const { CurrentPrice } = PriceLabel;

const themeType = window._global.themeType || 0;

export default {
  name: 'promotion-pop',

  components: {
    'van-button': Button,
    ImgWrap,
    'vis-price-current': CurrentPrice,
    'vis-icon': Icon,
  },

  props: {
    promotionFormatInfo: {
      type: Array,
      default: () => {
        return [];
      },
      showPromotion: {
        type: Boolean,
        default: false,
      },
    },
  },

  data() {
    return {
      isShowMore: [],
      theme: themeColor[themeTypeMap[themeType]],
    };
  },

  created() {
    this.promotionFormatInfo.forEach((promotion, index) => {
      if (promotion.presentGoodsList.length > 2) {
        this.isShowMore[index] = true;
      }
    });
  },

  methods: {
    onPresentList(index) {
      this.$emit('showPresentList', index);
    },

    onClose() {
      this.$emit('closePromotionPop');
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.promotion-pop__container {
  height: 450px;
  padding: 16px;

  &-item {

    &-tag {
      position: absolute;
      display: inline-block;
      line-height: 14px;
      padding: 2px 4px;
      border-radius: 9px;
      font-size: 10px;
      color: #00b389;
      background-color: #e5f7f3;
    }

    &-detail {
      position: relative;
      margin-left: 36px;

      &-desc {
        color: #323233;
        font-size: 12px;

        @include multi-ellipsis(1);
      }

      &-mask {
        background-color: #00B389;
        opacity: 0.04;
        height: 108px;
        max-width: 375px;
        position: absolute;
        bottom: 0;
        width: 100%;
        border-radius: 6px;
      }

      &-present {
        display: flex;
        height: 92px;
        max-width: 375px;
        /* justify-content: space-between; */
        margin-top: 8px;
        padding: 8px;
        background-repeat: no-repeat;

        &-wrap {
          display: flex;

          .present-item {
            width: 112px;
            margin-right: 8px;

            .imgWrap {
              border-radius: 4px;
            }

            &__detail {
              display: flex;
              justify-content: space-between;
              margin-top: 8px;
              font-size: 12px;

              &-price {
                flex: 1;
                padding-right: 3px;
              }

              &-sku {
                flex: 1;
                color: #646566;
                text-align: right;

                @include multi-ellipsis(1);
              }
            }
          }
        }
        .present-more {
          width: 112px;
          margin-top: 11px;
          text-align: center;

          .vis-icon {
            padding: 4px;
            background-color: #c8c9cc;
            border-radius: 100%;
          }

          &__tip {
            margin-top: 3px;
            font-size: 10px;
            color: #969799;
          }
        }
      }
    }
  }

  &-action {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;

    .van-button {
      width: 90%;
      height: 36px;
      line-height: 36px;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
