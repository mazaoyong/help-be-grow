<template>
  <van-action-sheet
    v-model="show"
    title="请选择优惠券"
    class="coupon-list-popup"
    close-icon="cross"
    get-container="body"
  >
    <van-coupon-list
      v-theme="theme"
      class="coupon-list"
      empty-image="https://b.yzcdn.cn/public_files/2cdd348c0564e510a967e6a383bfd763.png"
      :exchange-button-text="exchangeButtonText"
      :show-count="false"
      :show-close-button="false"
      :coupons="coupon.list"
      :disabled-coupons="coupon.disabledList"
      :chosen-coupon="chosenIndex"
      @change="onChange"
      @exchange="onExchange"
    />
    <van-goods-action class="coupon-list__button-group">
      <van-goods-action-button
        :color="$theme.colors.vice"
        type="warning"
        text="不使用优惠券"
        @click="onChange(-1, true)"
      />
      <van-goods-action-button
        :color="$theme.colors.main"
        type="danger"
        text="完成"
        @click="show = false"
      />
    </van-goods-action>
  </van-action-sheet>
</template>

<script>
import {
  ActionSheet,
  CouponList,
  GoodsAction,
  GoodsActionButton,
  Toast,
} from 'vant';
import { findIndex } from 'lodash';

const theme = {
  main: {
    '.van-tabs__line': 'background',
    '.van-coupon-list__exchange': 'color',
    '.van-coupon__head': 'color',
    '.van-checkbox__icon--checked .van-icon-success':
      'background-color!important, border-color!important',
  },
};

export default {
  name: 'coupon-list',

  components: {
    'van-action-sheet': ActionSheet,
    'van-coupon-list': CouponList,
    'van-goods-action': GoodsAction,
    'van-goods-action-button': GoodsActionButton,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  state: ['coupon', 'shop'],

  getters: ['chosenCoupon'],

  data() {
    return {
      // 兑换优惠码状态
      exchangLoading: false,
    };
  },

  computed: {
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },

    theme() {
      return theme;
    },

    exchangeButtonText() {
      return this.exchangLoading ? '验证中...' : '兑换';
    },

    chosenIndex() {
      return findIndex(
        this.coupon.list,
        (coupon) => this.coupon.chosenId === coupon.id,
      );
    },
  },

  methods: {
    onChange(index, shouldClose) {
      const nextChosenCoupon = this.coupon.list[index] || {};
      const chosenCoupon = this.chosenCoupon;

      if (nextChosenCoupon.id !== chosenCoupon.id) {
        this.$commit('SET_CHOSEN_COUPON_ID', nextChosenCoupon.id);

        this.$dispatch('FETCH_POST_CONFIRM_ORDER').catch(() => {
          this.$commit('SET_CHOSEN_COUPON_ID', chosenCoupon.id);
        });
      }

      if (shouldClose) {
        this.show = false;
      }
    },

    onExchange(code) {
      this.exchangLoading = true;
      this.$dispatch('EXCHANGE_COUPON', code).then((coupon) => {
        this.exchangLoading = false;
        if (coupon) {
          const isExisted = this.coupon.list.some(
            (item) => item.id === coupon.id,
          );

          if (isExisted) {
            Toast('该优惠码你已经拥有，已为你自动选中');
          } else {
            this.$commit('ADD_COUPON', coupon);
            Toast('兑换成功');
          }

          this.coupon.list.forEach((item, index) => {
            if (item.id === coupon.id) {
              this.$commit('SET_CHOSEN_COUPON_INDEX', index);
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.coupon-list {
  padding-bottom: 50px;

  &__button-group {
    padding: 5px 12px;
  }
}

.is-iphonex {
  .coupon-list__button-group {
    padding-bottom: 39px;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 5px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 5px);
  }
}

::v-deep {
  .van-action-sheet__header {
    &::after {
      border: 0;
    }
  }

  .van-coupon-list__list {
    padding-bottom: 12px 0 24px;
    height: 400px !important;
  }

  .van-tabs__line {
    width: 40px !important;
  }

  .van-coupon-list__bottom {
    display: none;
  }

  .van-coupon {
    margin: 0 12px 12px;
    box-shadow: none;
  }

  .van-coupon__content {
    padding: 16px 0;
  }

  .van-coupon-list__empty img {
    width: 150px;
    height: 150px;
  }

  .van-field__button {
    padding: 0;
  }

  .van-coupon-list__exchange {
    padding: 0 16px;
  }

  .van-coupon--disabled {
    .van-coupon__head {
      color: $main-text-color;
    }
  }
}
</style>
