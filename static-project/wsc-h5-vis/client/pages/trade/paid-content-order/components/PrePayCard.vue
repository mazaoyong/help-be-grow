<template>
  <div>
    <van-cell
      :border="false"
      :value="prepayCardDecreaseText"
      is-link
      center
      @click="onShowPrePayModal()"
    >
      <div slot="title">
        余额/卡
      </div>
    </van-cell>
    <!-- 余额 / 卡 结束 -->

    <!-- 提示 开始 -->
    <transition name="slide-fade">
      <van-cell
        v-show="isShowPrePayTip"
        class="pre-pay-card-tip-cell"
        title="储值余额已支持与微信支付等一起使用"
        :border="false"
      >
        <van-button
          class="pre-pay-card-tip-cell__btn"
          round
          size="small"
          @click="onClickTip"
        >
          我知道了
        </van-button>
      </van-cell>
    </transition>
    <!-- 提示 结束 -->

    <!-- 储值卡弹窗 开始 -->
    <prepaid-recommend
      v-theme="precardTheme"
      :show="isShowPrePayModal"
      :gift-card="giftCard"
      :value-card="valueCard"
      :amount="Number(price)"
      :on-close="onActionSheetClose"
      :on-cancel="onActionSheetCancel"
      @onCheck="onCardCheck"
    />
    <!-- 储值卡弹窗 结束 -->
  </div>
</template>

<script>
import YZLocalStorage from 'zan-utils/browser/local_storage';
import PrepaidRecommend from '@youzan/prepaid-recommend';
import { Cell, Button, Icon } from 'vant';
import Vue from 'vue';

import '@youzan/prepaid-recommend/lib/index.css';

Vue.use(Icon);

export default {
  name: 'pre-pay-card',
  components: {
    'van-cell': Cell,
    'van-button': Button,
    'prepaid-recommend': PrepaidRecommend,
  },
  props: {
    giftCard: { // 礼品卡
      type: Object,
      default: () => {
        return {
          list: [],
          disabled: [],
          checked: [],
        };
      },
    },
    valueCard: { // 储值卡
      type: Object,
      default: () => {
        return {
          list: [],
          disabled: [],
          checked: [],
        };
      },
    },
    price: {
      type: [Number, String],
      default: 0,
    },
    count: {
      type: [Number, String],
      default: 1,
    },
  },
  data() {
    return {
      isShowPrePayModal: false,
      isShowPrePayTip: false,
    };
  },
  computed: {
    precardTheme() {
      return {
        main: {
          '.van-tabs__line': 'background',
          '.van-submit-bar__button': 'background,border-color',
          '.prepay-card-radio--checked-nocover': 'color',
        },
      };
    },
    prepayCardDecreasePrice() {
      return this.$store.getters['usedPrePayCardPrice'] || 0;
    },
    prepayCardDecreaseText() {
      const availableCount = this.valueCard.list.length + this.giftCard.list.length;
      if (this.prepayCardDecreasePrice) {
        return `-￥${(this.prepayCardDecreasePrice / 100).toFixed(2)}`;
      }
      if (availableCount > 0) {
        return `${availableCount}张可用`;
      }
      return '暂无可用';
    },
  },
  mounted() {
    const isShowPrePayTip = !YZLocalStorage.getItem('pre_pay_tip');
    if (isShowPrePayTip) {
      this.isShowPrePayTip = true;
    }
  },
  methods: {
    onShowPrePayModal() {
      this.isShowPrePayModal = true;
    },

    onActionSheetClose() {
      this.isShowPrePayModal = false;
    },

    onActionSheetCancel() {
      this.isShowPrePayModal = false;
    },

    onCardCheck({ card, cardType }) {
      // 更新卡片是否选中信息
      this.$emit('updateSelectedPrePayCard', { card, cardType });
    },
    onClickTip() {
      YZLocalStorage.setItem('pre_pay_tip', true);
      this.isShowPrePayTip = false;
    },
  },
};
</script>

<style lang="scss">
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-40px);
  opacity: 0;
}

.pre-pay-card {
  margin: 10px 0;

  &__tag {
    background-image: linear-gradient(45deg, #ff405c 0%, #ff8518 100%);
    border-radius: 2px;
    font-size: 10px;
    color: #f7f8fa;
    padding: 0 4px;
    line-height: 18px;
    display: inline-block;
  }

  &__cell {
    z-index: 1;

    &__value {
      color: #111;
      flex: none;
      padding-right: 15px;
    }
  }
}

.pre-pay-card-tip-cell {
  position: relative;
  padding: 8px 15px;
  background: #fff7e8;
  overflow: visible !important;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;

  &::after {
    content: '';
    display: block;
    position: absolute;
    z-index: 1;
    top: -6px;
    right: 38px;
    width: 0;
    height: 0;
    border-width: 0 6px 6px;
    border-style: solid;
    border-color: transparent transparent #fff7e8;
  }

  .van-cell__title {
    display: flex;
    align-items: center;
    color: #ed6a0c;
    font-size: 13px;
  }

  .van-cell__value {
    flex: none;
  }

  &__btn {
    background: #ed6a0c;
    color: rgb(253, 241, 232);
    border: none;
    height: 28px;
    line-height: 26px;
  }
}
</style>
