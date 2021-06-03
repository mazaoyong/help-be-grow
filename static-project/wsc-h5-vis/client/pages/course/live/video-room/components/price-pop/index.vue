<template>
  <div class="price-pop">
    <div v-theme.main="'border-color'" class="price-pop__title">
      感谢老师
    </div>
    <div class="price-pop__content">
      <div v-if="isShowConstantPrice" class="block-list-wrap">
        <div class="constant-price">
          <div
            v-for="(price, index) in priceArray"
            :key="index"
            v-theme.main="'border-color'"
            :style="{ '--borderColor': mainColor }"
            class="constant-price__item van-hairline--surround"
            @click="handleSubmit(price, 'constant')"
          >
            <vis-price-current
              :price="[price]"
              :active-color="mainColor"
              font-size="24"
              bold
            />
          </div>
        </div>
        <p class="custom-price-entry van-hairline--top" @click="handleCustomPrice">
          其他金额
        </p>
      </div>

      <div v-else class="custom-price-wrap" :style="{ marginBottom: marginBottom }">
        <p class="custom-price-wrap__title">
          其他金额
        </p>
        <van-field
          class="custom-price-wrap__input"
          :value="customPrice"
          readonly
          clickable
          label="￥"
          @touchstart.native.stop="handleShowBoard"
        />
        <div class="custom-price-wrap__btn">
          <van-button
            class="submit-btn"
            :color="dynamicBgColor"
            round
            @click="handleSubmit(customPrice, 'custom')"
          >
            确认支付
          </van-button>
        </div>
        <van-number-keyboard
          v-model="customPrice"
          theme="custom"
          extra-key="."
          close-button-text="完成"
          :show="showBoard"
          :maxlength="7"
          :style="{ '--mainColor': mainColor }"
          @close="handleHideBoard"
          @hide="handleHideBoard"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { PriceLabel } from '@youzan/vis-ui';
import { NumberKeyboard, Field, Button, Toast } from 'vant';
import { fns } from '@youzan/vue-theme-plugin';
import accMul from '@youzan/utils/number/accMul';
import number from '@youzan/utils/validate/number';
import SessionStorage from '@youzan/utils/browser/session_storage';
import Args from '@youzan/utils/url/args';

import * as CunstomSafeLink from '@/common/utils/custom-safe-link';
import { createReward } from '../../api';
import { logRewardPrice } from '../../track';

const { CurrentPrice } = PriceLabel;
const priceArray = [188, 666, 1880, 2880, 6660, 10000];
const kdtId = window._global.kdt_id;

export default {
  name: 'price-pop',

  components: {
    'vis-price-current': CurrentPrice,
    'van-number-keyboard': NumberKeyboard,
    'van-field': Field,
    'van-button': Button,
  },

  props: {
    alias: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      priceArray,
      customPrice: '',
      showBoard: false,
      isShowConstantPrice: true,
      marginBottom: '0px',
      isLoading: false,
    };
  },

  computed: {
    mainColor() {
      return this.$theme.colors.main;
    },

    dynamicBgColor() {
      if (!this.customPrice || +this.customPrice <= 0) {
        return fns.hexToRgba(this.mainColor, 0.3);
      } else if (this.isLoading) {
        return fns.hexToRgba(this.mainColor, 0.85);
      }
      return this.mainColor;
    },
  },

  methods: {
    handleCustomPrice() {
      this.isShowConstantPrice = false;
    },

    handleShowBoard() {
      this.showBoard = true;
      this.marginBottom = '220px';
    },

    handleHideBoard() {
      this.marginBottom = '0px';
      this.showBoard = false;
    },

    handleSubmit(price, type) {
      if (this.isLoading || !price || +price <= 0) return;

      const submitPrice = type === 'custom' ? accMul(+price, 100) : +price;

      // 如果有小数点，提示输入有误，原因是小数点后最最多保留两位
      if (!number(submitPrice) || submitPrice > 999999) {
        const errMsg = !number(submitPrice) ? '打赏金额小数点后最多为两位' : '请输入0～9999.99范围内的数字';
        Toast(errMsg);
        return;
      };

      this.isLoading = true;

      const title = Args.get('title') || '推荐你来看这场直播';
      const cover = Args.get('cover');
      const summary = Args.get('summary');

      const cbUrl = CunstomSafeLink.getSafeUrl({
        url: `/wscvis/course/live/video/room?alias=${this.alias}&kdt_id=${kdtId}&title=${title}&cover=${cover}&summary=${summary}`,
      });
      SessionStorage.setItem('submitPrice', submitPrice);
      logRewardPrice(this.alias, submitPrice, type);
      createReward({
        realPay: submitPrice,
        callbackUrl: cbUrl,
        alias: this.alias,
      })
        .then(res => {
          const { code, data, msg } = res;
          if (code === 0) {
            const { cashierUrl, realPay } = data;
            const localSubmitPrice = SessionStorage.getItem('submitPrice') || 0;
            if (+localSubmitPrice && +localSubmitPrice === realPay) {
              SessionStorage.removeItem('submitPrice');
              CunstomSafeLink.redirect({
                url: cashierUrl,
              });
            } else {
              Toast('网络错误,请重试');
            }
          } else if (code === 320300001) {
            Toast(msg || '网络错误,请重试');
            this.$emit('resolve');
          } else {
            Toast(msg || '网络错误,请重试');
          }
        })
        .catch((err) => {
          Toast(err.msg || '网络错误,请重试');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.price-pop {
  background-color: #fff;

  &__title {
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    color: #323233;
    font-weight: 500;
    text-align: center;
  }

  &__content {
    .block-list-wrap {
      padding: 24px 24px 0;

      .constant-price {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        &__item {
          width: 98px;
          height: 48px;
          line-height: 48px;
          margin-bottom: 16px;
          text-align: center;

          &:after {
            border-color: var(--borderColor);
            border-radius: 4px;
          }

          ::v-deep .pl-float-number {
            font-size: 24px;
          }
        }
      }

      .custom-price-entry {
        height: 44px;
        line-height: 44px;
        margin-top: 8px;
        font-size: 14px;
        color: #576b95;
        text-align: center;
      }
    }

    .custom-price-wrap {
      padding: 24px 16px 16px;
      transition: margin-bottom .2s ease-in-out;

      &__title {
        line-height: 18px;
        font-size: 14px;
        color: #323233;
        padding-left: 24px;
      }

      &__input {
        padding-left: 24px;
        padding-bottom: 0;
        align-items: center;

        ::v-deep .van-field__label {
          // padding-bottom: 12px;
          font-size: 40px;
          line-height: 60px;
          font-weight: 500;
          width: auto;
        }

        ::v-deep .van-field__control {
          font-size: 60px;
          font-weight: 500;
          color: #323233;
        }
      }

      &__btn {
        width: 100%;
        margin-top: 16px;

        .submit-btn {
          width: 100%;
          color: #fff;
          border: none;
        }
      }

      ::v-deep .van-key--blue {
        background-color: var(--mainColor) !important;

        &:after {
          border-color: var(--mainColor) !important;
        }
      }
    }
  }
}
</style>
