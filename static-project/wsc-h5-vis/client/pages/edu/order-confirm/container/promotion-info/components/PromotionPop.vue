<template>
  <van-popup
    v-model="show"
    class="order-promotion-pop__container"
    position="bottom"
  >
    <div
      v-for="promotion in promotionInfo"
      :key="promotion.skuId"
      class="order-promotion-pop__container-item"
    >
      <div class="order-promotion-pop__container-item-tag theme-tag">
        {{ promotion.tags }}
      </div>
      <div class="order-promotion-pop__container-item-detail">
        <p class="order-promotion-pop__container-item-detail-desc">
          {{ promotion.descriptions }}
        </p>
        <div
          v-if="promotion.presentGoodsList.length > 0"
          class="order-promotion-pop__container-item-detail-present"
        >
          <div
            v-for="(present, index) in promotion.presentGoodsList"
            :key="index"
            class="order-promotion-pop__container-item-detail-present-wrap"
          >
            <div class="present-item">
              <img-wrap
                :width="'112px'"
                :height="'64px'"
                :src="present.imageUrl"
                :fullfill="'!220x220.jpg'"
                :cover="false"
              />
              <p class="present-item__title">
                {{ present.title }}
              </p>
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
        </div>
      </div>
    </div>

    <div class="order-promotion-pop__container-action">
      <van-button
        class="main-btn"
        round
        @click="onClose"
      >
        完成
      </van-button>
    </div>
  </van-popup>
</template>

<script>
import { Button, Popup } from 'vant';
import { ImgWrap, PriceLabel } from '@youzan/vis-ui';
import { themeColor, themeTypeMap } from 'common/constants';

const themeType = window._global.themeType || 0;

const { CurrentPrice } = PriceLabel;

export default {
  name: 'promotion-pop',

  components: {
    ImgWrap,
    'vis-price-current': CurrentPrice,
    'van-button': Button,
    'van-popup': Popup,
  },

  props: {
    promotionInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },

    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      theme: themeColor[themeTypeMap[themeType]],
      show: this.value,
    };
  },

  watch: {
    value(newValue) {
      this.show = newValue;
    },
    show(newValue) {
      this.$emit('input', newValue);
    },
  },

  methods: {
    onClose() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.order-promotion-pop__container {
  height: 450px;
  padding: 16px 0;

  &-item {
    padding-left: 16px;

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
      margin-left: 36px;

      &-desc {
        line-height: 18px;
        color: #323233;
        font-size: 12px;
      }

      &-present {
        display: flex;
        height: 110px;
        margin-top: 8px;
        padding: 8px 0;
        overflow-x: auto;

        &-wrap {
          display: flex;

          .present-item {
            width: 112px;
            margin-right: 8px;

            .imgWrap {
              border-radius: 4px;
            }

            &__title {
              margin-top: 8px;
              font-size: 12px;
              color: #323233;

              @include ellipsis;
            }

            &__detail {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 2px;
              font-size: 12px;

              &-price {
                flex: 2;
              }

              &-sku {
                flex: 1;
                color: #646566;

               @include ellipsis;
              }
            }
          }
        }
        .present-more {
          margin-top: 17px;
          text-align: center;

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
