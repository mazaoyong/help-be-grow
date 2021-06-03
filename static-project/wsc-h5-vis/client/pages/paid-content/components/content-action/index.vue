<template>
  <div class="goods-action">
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
        icon="chat-o"
        :text="web_im_text"
        class="js-im-icon"
      />
      <van-goods-action-mini-btn
        v-if="showShopBtn"
        class="shop-btn"
        icon="shop-o"
        text="店铺"
        @click="onNavigateToHome"
      />
      <van-goods-action-mini-btn
        v-if="showColumnBtn"
        icon="records"
        text="查看专栏"
        @click.native="onColumnBtnClick"
      />

      <template v-if="isInStock">
        <points-button
          v-if="showPoints"
          :is-column="isColumn"
          :data="pointsInfo"
          @onClickToBuy="onClickToBuy"
        />

        <groupon-button
          v-else-if="showGroupon"
          :price="price"
          :promotion-button-info="promotionButtonInfo"
          :is-joined="isJoined"
          @onClickToBuy="onClickToBuy"
        />

        <collect-button
          v-else-if="collectPraiseNum"
          :price="price"
          :origin-price="originPrice"
          :is-vip-discount="isVipDiscount"
          :collect-praise-num="collectPraiseNum"
          :is-column="isColumn"
          :prize-channel="prizeChannel"
          @onClickToBuy="onClickToBuy"
          @onCreatePraise="onCreatePraise"
        />

        <refferal-button
          v-else-if="showRefferal"
          :price="price"
          :newer-subsidy-price="referralInfo.newerSubsidyPrice"
          :show-buy-btn="showBuyBtn"
          :is-free-try="isFreeTry"
          :column-url="columnUrl"
          :seller-type="sellerType"
          @onClickToBuy="onClickToBuy"
        />

        <seckill-button
          v-else-if="showSeckill"
          :data="seckillInfo"
          @onClickToBuy="onClickToBuy"
        />

        <normal-button
          v-else
          :price="price"
          :origin-price="originPrice"
          :origin="origin"
          :column-price="columnPrice"
          :is-vip-discount="isVipDiscount"
          :seller-type="sellerType"
          :show-buy-btn="showBuyBtn"
          :is-free-try="isFreeTry"
          :is-column="isColumn"
          :column-url="columnUrl"
          :timelimited-discount-info="timelimitedDiscountInfo"
          @onClickToBuy="onClickToBuy"
        />
      </template>

      <van-goods-action-big-btn
        v-else-if="isTimeInStock"
        class="vice-btn"
        @click="onNavigateToHome"
      >
        查看其他课程
      </van-goods-action-big-btn>

      <van-goods-action-big-btn
        v-else
        class="goods-action__notstock"
        disabled
      >
        已下架
      </van-goods-action-big-btn>
    </van-goods-action>
  </div>
</template>

<script>
import { GoodsAction, GoodsActionButton, GoodsActionIcon } from 'vant';
import GrouponButton from './components/GrouponButton';
import CollectButton from './components/CollectButton';
import NormalButton from './components/NormalButton';
import RefferalButton from './components/RefferalButton';
import SeckillButton from './components/SeckillButton';
import PointsButton from './components/PointsButton';
import BottomMessage from '../goods-action/components/BottomMessage';
import PublishCountdown from '../PublishCountdown';
import { USER_JOIN_GROUPON_STATUS, GROUPON_LABEL, SELLER_TYPE } from 'pct/constants';
import * as SafeLink from '@youzan/safe-link';
import { navigateEnv } from 'common/utils/env';

const {
  shop_config: shareConfig = {},
} = window._global;
const {
  web_im_in_goods_config: webImGoodsConfig,
} = shareConfig;

export default {
  name: 'content-action',

  components: {
    'van-goods-action': GoodsAction,
    'van-goods-action-big-btn': GoodsActionButton,
    'van-goods-action-mini-btn': GoodsActionIcon,
    GrouponButton,
    CollectButton,
    NormalButton,
    RefferalButton,
    SeckillButton,
    PointsButton,
    PublishCountdown,
    [BottomMessage.name]: BottomMessage,
  },

  props: {
    // 是否为专栏
    isColumn: Boolean,
    // 是否有参加活动
    showGroupon: Boolean,
    // 是否为免费试读
    isFreeTry: Boolean,
    // 会员折扣
    isVipDiscount: Boolean,

    isInStock: Boolean,
    // 用户参团状态 0->未参团，1->参团 2->团成功
    // userStatus: Number,
    // 是否显示购买按钮
    showBuyBtn: Boolean,
    // 原价
    price: [Number, String],
    // 商品原价
    originPrice: [Number, String],
    // 划线价
    origin: [Number, String],
    // 内容所属专栏价格
    columnPrice: [Number, String],
    // 专栏url
    columnUrl: String,
    // 出售类型
    sellerType: Number,
    promotionButtonInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    // 是否参加集赞活动
    collectPraiseNum: {
      type: Number,
      default: 0,
    },
    // 推荐有礼活动信息
    referralInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    showRefferal: Boolean,
    showSeckill: Boolean,
    seckillInfo: {
      type: Object,
      default: null,
    },
    // 好友助力类型 0：免费听课，1：领取优惠券
    prizeChannel: {
      type: Number,
      default: 0,
    },

    // 限时折扣活动信息
    timelimitedDiscountInfo: {
      type: Object,
      default() {
        return {};
      },
    },

    publishAt: [String, Number],
    isTimeInStock: Boolean,
    // 是否显示积分活动
    showPoints: {
      type: Boolean,
      default: false,
    },
    pointsInfo: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      web_im_text: '客服',
    };
  },

  computed: {
    showImBtn() {
      return window._global.shop_config.is_web_im_in_goods === '1';
    },
    showShopBtn() {
      return window._global.shop_config.show_shop_btn === '1';
    },
    showColumnBtn() {
      return this.sellerType === SELLER_TYPE.BOTH &&
        !this.isFreeTry &&
        (
          this.showGroupon ||
          this.collectPraiseNum ||
          this.showRefferal ||
          this.isVipDiscount
        );
    },
    // 是否已参团
    isJoined() {
      return (
        this.promotionButtonInfo.userStatus &&
        this.promotionButtonInfo.userStatus.status === USER_JOIN_GROUPON_STATUS.JOINED
      );
    },
    // 原价购买时文案，方便后面拓展; 4->多人拼团
    originLabel() {
      if (this.promotionButtonInfo.promotionType === 4) {
        return GROUPON_LABEL.ORIGIN;
      }
      return '';
    },
    // 活动价购买时文案，方便后面拓展
    promotionLabel() {
      if (this.promotionButtonInfo.promotionType === 4) {
        return GROUPON_LABEL.GROUPON;
      }
      return '';
    },

    bottomMessage() {
      if (this.showSeckill) {
        const { beginAt, endAt, isCheckRight, currentStock, isUserBooking, isUserRemind } = this.seckillInfo;
        const now = new Date();
        // 未开始
        if (now < new Date(beginAt) && now < new Date(endAt)) {
          // 开启秒杀预约
          if (isCheckRight) {
            // 已预约
            if (isUserBooking) {
              return '你已成功预约，活动暂未开始，但也可以原价购买';
            }
          } else {
            // 已提醒
            if (isUserRemind) {
              return '你已设置提醒，活动暂未开始，但也可以原价购买';
            }
          }
        }
        // 已开始
        if (new Date(beginAt) < now && now < new Date(endAt)) {
          if (currentStock) {
            // 开启秒杀预约
            if (isCheckRight) {
              // 已预约
              if (isUserBooking) {} else {
                return '你未预约此活动，无法参与秒杀，下次记得预约哦';
              }
            }
          } else {
            return '秒杀价课程已售磬，你可以原价购买';
          }
        }
        // 已结束
        if (new Date(endAt) < now) {
          return '秒杀活动已结束，你还可以原价进行购买';
        }
      }
      return '';
    },
  },

  mounted() {
    this.getWebImText();
  },

  methods: {
    onClick(type) {
      event.preventDefault();
      switch (type) {
        case 0:
        case 1:
          this.$emit('pay', type);
          break;
        case 2:
          this.$emit('createPraise');
          break;
        case 'groupLink':
          this.$router.push({
            name: 'GrouponInvitation',
            query: {
              alias: this.promotionButtonInfo.userGroupAlias,
            },
          });
          break;
        case 'columnLink':
          SafeLink.redirect({
            url: this.columnUrl,
          });
          break;
      }
    },

    // 回店铺首页统一收敛
    onNavigateToHome() {
      navigateEnv();
    },

    onClickToCheck(event) {
      event.preventDefault();
    },
    onClickToBuy(type, event, payload) {
      event && event.preventDefault();
      this.$emit('pay', type, payload);
    },
    onClickToHome() {
      window.location.url =
        window._global.wap_url.wap +
        '/showcase/homepage?kdt_id=' +
        window._global.kdt_id;
    },
    // 创建点赞活动
    onCreatePraise() {
      event.preventDefault();
      this.$emit('create-praise');
    },
    onColumnBtnClick() {
      window.location.hash = this.columnUrl;
      window.location.reload();
    },
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
  },
};
</script>

<style lang="scss">
@import "var";

.buy-btn {
  display: flex;
  width: 100%;

  .van-goods-action-big-btn {
    border: none;
  }
}

.goods-action {
  z-index: 999;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  box-shadow: 0 -2px 10px 0 rgba(125,126,128,0.16);

  .vis-price-label__item__active {
    vertical-align: middle;
    font-size: initial !important;

    .vis-price-label__item {
      font-size: 16px;

      .vis-price-symbol,
      .vis-price-decimal {
        font-size: 16px;
      }

      .vis-price-symbol {
        font-weight: 400;
      }

      .vis-price-content,
      .vis-price-decimal {
        font-weight: bold;
      }
    }
  }

  &__promotion {
    &-price {
      display: block;
      height: 22px;
      line-height: 22px;
      font-size: 16px;
      margin-top: 1px;

      .vis-price-label__item {
        line-height: 22px;
      }
    }

    &-label {
      display: block;
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

  .van-goods-action {
    z-index: 999;
    position: static;
  }

  &__notstock {
    color: $c-gray-dark;
    background-color: $c-gray-light;
  }
}

.pc-mode {
  .goods-action {
    margin: 0 auto;
    width: 375px;
  }
}
</style>
