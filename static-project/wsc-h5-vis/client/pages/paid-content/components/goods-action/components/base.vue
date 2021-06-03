<template>
  <div class="base-action">
    <publish-countdown
      v-if="isTimeInStock"
      :publish-at="publishAt"
    />
    <bottom-message
      v-if="bottomMessage"
      :message="bottomMessage"
    />
    <van-goods-action>
      <van-goods-action-mini-btn
        v-if="showImBtn"
        icon="chat"
        :text="web_im_text"
        class="js-im-icon"
      />
      <van-goods-action-mini-btn
        v-if="showShopBtn"
        icon="shop"
        text="店铺"
        @click="onNavigateToHome"
      />
      <van-goods-action-mini-btn
        v-if="showColumnBtn"
        icon="records"
        text="专栏"
        :url="columnUrl"
      />
      <van-goods-action-big-btn
        v-if="isTimeInStock"
        class="base-action__main main-btn"
        :url="homeUrl"
      >
        查看其他课程
      </van-goods-action-big-btn>
      <template v-else>
        <van-goods-action-big-btn
          v-if="showPointsBtn"
          :class="pointsBuyLimit ? 'main-btn' : 'vice-btn'"
          @click="$emit('custom-action', { type: 'points' })"
        >
          {{ pointsName }}兑换
        </van-goods-action-big-btn>
        <van-goods-action-big-btn
          v-if="!pointsBuyLimit"
          :class="`base-action__main ${ customClass } main-btn ${showOriginPrice ? 'goods-action__price' :''}`"
          @click="$emit('custom-action')"
        >
          <div>{{ customText }}</div>
        </van-goods-action-big-btn>
      </template>
    </van-goods-action>
  </div>
</template>

<script>
import { GoodsAction, GoodsActionButton, GoodsActionIcon } from 'vant';
import { navigateEnv } from 'common/utils/env';
import PublishCountdown from '../../PublishCountdown';
import BottomMessage from './BottomMessage';

const {
  shop_config: shareConfig = {},
} = window._global;
const {
  web_im_in_goods_config: webImGoodsConfig,
} = shareConfig;
const global = window._global;

export default {
  name: 'base-action',

  components: {
    'van-goods-action': GoodsAction,
    'van-goods-action-big-btn': GoodsActionButton,
    'van-goods-action-mini-btn': GoodsActionIcon,
    PublishCountdown,
    BottomMessage,
  },

  props: {
    isFree: {
      type: [Boolean, Number],
      default: false,
    },
    isPaid: {
      type: [Boolean, Number],
      default: false,
    },
    customText: {
      type: String,
      required: true,
    },
    customClass: String,
    currentPrice: {
      type: Number,
      default: 0,
    },
    originPrice: {
      type: [Number, String],
      default: 0,
    },
    isVipDiscount: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: false,
    },
    // 划线价
    origin: String,
    showOriginPrice: Boolean,
    showImBtn: {
      type: Boolean,
      default: true,
    },
    showShopBtn: {
      type: Boolean,
      default: true,
    },
    showPointsBtn: {
      type: Boolean,
      default: false,
    },
    pointsInfo: {
      type: Object,
      default: null,
    },
    showColumnBtn: {
      type: Boolean,
      default: true,
    },
    showSeckill: {
      type: Boolean,
      default: false,
    },
    columnUrl: String,
    homeUrl: {
      type: String,
      required: true,
    },
    publishAt: Number,
    isTimeInStock: {
      type: Boolean,
      default: false,
    },

    bottomMessage: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      web_im_text: '客服',
      pointsName: global.visPointsName || '积分',
    };
  },

  computed: {
    pointsBuyLimit() {
      if (this.showPointsBtn && this.pointsInfo) {
        return !!this.pointsInfo.buyLimit;
      } else {
        return false;
      }
    },
  },

  mounted() {
    this.getWebImText();
  },

  methods: {
    // 获取客服自定义按钮文字
    getWebImText() {
      if (webImGoodsConfig) {
        const config = JSON.parse(webImGoodsConfig);
        if (config.hasOwnProperty('default')) {
          if (config.default === 1) {
            this.web_im_text = config.label || '客服';
          };
        };
      };
    },

    onNavigateToHome() {
      navigateEnv();
    },
  },
};
</script>

<style lang="scss">
@import "var";

.base-action {
  .van-goods-action {
    z-index: 1;
  }

  .van-button--primary {
    background-color: #00B389;
  }
}
.goods-action__price {
  line-height: 1;
}
.goods-action__origin {
  line-height: 1;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  transform: scale(0.833333);
  text-decoration: line-through;
}
.goods-action {
    &__promotion {
      padding: 5px 0 !important;

      &-price {
        display: block;
        height: 22px;
        line-height: 22px;
        font-size: 16px;

        .vis-price-label__item {
          line-height: 22px;
        }
      }

      &-label {
        display: block;
        margin-top: 2px;
        height: 18px;
        line-height: 16px;
        font-size: 12px;

        &--opacity {
          opacity: 0.6;

          & * {
            line-height: 10px;
            font-size: 10px;
          }
        }
      }
  }
}
</style>
