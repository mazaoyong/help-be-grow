<template>
  <div>
    <card-cell
      v-log:click="{
        ei: 'edu_click_btn',
        en: '教育下单点击页面按钮',
        pt: 'trade',
        params: {
          btn_name: 'edu_prepare_card_cell',
        },
      }"
      title="余额/卡"
      tip="暂无可用"
      :value="value"
      :is-editable="!isOrderCreated"
      @click="onClickCell"
    >
      <div slot="title" class="prepay-card-cell">
        <span class="prepay-card-cell__title">余额/卡</span>
        <span
          v-if="prepayCard.payAssetActivityTagDesc"
          class="prepay-card-cell__tag"
        >
          {{ prepayCard.payAssetActivityTagDesc }}
        </span>
      </div>
    </card-cell>

    <prepaid-recommend
      v-theme="theme"
      :show="isShowPrepaidRecommend"
      :gift-card="giftCard"
      :value-card="valueCard"
      :amount="pay.realPay"
      :recommend-desc="prepayCard.payAssetActivityTagDesc"
      :value-card-recommend="parsedRecommendDetaid"
      :on-close="onClosePrepaid"
      :on-cancel="onClosePrepaid"
      :exist-discount="true"
      @onCheck="onCheckPrepaid"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import formatMoney from '@youzan/utils/money/format';

import { Icon } from 'vant';
import PrepaidRecommend from '@youzan/prepaid-recommend';
import { CardCell } from '@/pages/trade/buy/components/card';

import '@youzan/prepaid-recommend/lib/index.css';

Vue.use(Icon);

const theme = {
  main: {
    '.van-tabs__line': 'background',
    '.van-submit-bar__button': 'background',
    '.sheet__footer .recharge__btn': 'background',
    '.sheet__card--title .check-icon .van-icon': 'border-color',
    '.sheet__card--title .check-icon .checked': 'background',
    '.prepay-card-radio--checked-nocover': 'color',
  },
};

export default {
  name: 'prepay-card-cell',

  components: {
    CardCell,
    PrepaidRecommend,
  },

  state: ['pay', 'price', 'giftCard', 'valueCard', 'prepayCard'],

  getters: [
    'prepayCardDecrease',
    'prepayCardAvailableAmount',
    'isOrderCreated',
  ],

  data() {
    return {
      isShowPrepaidRecommend: false,
    };
  },

  computed: {
    theme() {
      return theme;
    },

    cardTheme() {
      if (this.prepayCardDecrease) {
        return {
          main: {
            '.vis-biz-card-cell__value': 'color',
          },
        };
      }

      return undefined;
    },

    parsedRecommendDetaid() {
      return JSON.parse(
        this.prepayCard.recommendDetaid || '{ "productInfos": []}',
      );
    },

    value() {
      if (this.prepayCardDecrease) {
        return `-￥${formatMoney(this.prepayCardDecrease)}`;
      }

      // 用户未选择卡的情况，显示可用余额
      if (this.prepayCardAvailableAmount) {
        return `${formatMoney(this.prepayCardAvailableAmount)}元可用`;
      }

      return '';
    },
  },

  methods: {
    onClickCell() {
      this.isShowPrepaidRecommend = true;
    },

    onClosePrepaid() {
      this.isShowPrepaidRecommend = false;
    },

    onCheckPrepaid({ card, cardType, isRefresh }) {
      this.$commit('SWITCH_PREPAY_CARD_CHECK_STATUS', {
        card,
        cardType,
      });

      if (isRefresh) {
        this.$dispatch('FETCH_POST_CONFIRM_ORDER');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.prepay-card-cell {
  display: flex;
  align-items: center;

  &__title {
    padding-right: 8px;
    vertical-align: middle;
  }

  &__tag {
    display: inline-block;
    padding: 1.2px 4.8px;
    line-height: 18px;
    color: #f7f8fa;
    vertical-align: middle;
    background-image: linear-gradient(45deg, #ff405c 0%, #ff8518 100%);
    border-radius: 2px;
    transform-origin: left;

    @include mini-font;
  }
}
</style>

<style lang="scss">
.prepaid-recommend-pop {
  &.van-popup--bottom {
    padding-bottom: 0;
  }

  .van-submit-bar {
    padding-bottom: 34px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
  // @todo
  .prepay-balance-item__giftpack {
    background-image: url(//img01.yzcdn.cn/upload_files/2020/01/22/Fs0Cj1XsLhhnIL4bRmDibTOAxjpV.png);
  }
}
</style>
