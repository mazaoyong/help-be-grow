<template>
  <base-action
    class="goods-action"

    :is-free="isFree"
    :is-paid="isPaid"
    :custom-class="mainClass"
    :custom-text="mainText"
    :current-price="currentPrice"
    :origin-price="originPrice"
    :is-vip-discount="isVipDiscount"
    :in-stock="inStock"

    :show-im-btn="showImBtn"
    :show-shop-btn="showShopBtn"
    :show-column-btn="showColumnBtn"
    :show-origin-price="showOriginPrice"
    :show-seckill="showSeckill"
    :show-points-btn="!isPaid && showPoints"
    :points-info="pointsInfo"

    :publish-at="publishAt"
    :is-time-in-stock="isTimeInStock"

    :column-url="columnUrl"
    :home-url="homeUrl"
    :origin="origin"
    :bottom-message="bottomMessage"
    @custom-action="handleCustomAction"
  />
</template>

<script>
import BaseAction from './components/base';

const shopConfig = window._global.shop_config;

export default {
  name: 'goods-action',

  components: {
    BaseAction,
  },

  props: {
    price: [Number, String],
    // 划线价
    origin: [String],
    isOwned: Boolean,
    inStock: {
      type: Boolean,
      required: true,
    },
    isFree: {
      type: Boolean,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
    },
    currentPrice: {
      type: Number,
      default: 0,
    },
    isVipDiscount: {
      type: Boolean,
      default: false,
    },
    allowSingleBuy: {
      type: Boolean,
      required: true,
    },
    showColumn: {
      type: [Boolean, String],
      default: '',
    },
    columnUrl: String,
    originPrice: [Number, String],
    activityStarted: Boolean,
    activityQuota: {
      type: Object,
      default: () => {
        return {};
      },
    },
    publishAt: Number,
    isTimeInStock: Boolean,
    showSeckill: Boolean,
    seckillInfo: {
      type: Object,
      default: null,
    },
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

  computed: {
    /**
     * 0：已下架
     * 1：默认已购买
     * 2：不允许单独购买
     * 3：默认未购买
     *
     * @return {number}
     */
    state() {
      if (this.inStock) {
        if (this.isPaid || this.isFree) {
          return 1;
        } else {
          if (this.activityStarted) {
            return this.promotionState;
          } else if (this.allowSingleBuy) {
            return 2;
          } else {
            return 3;
          }
        }
      } else {
        return 0;
      }
    },

    showOriginPrice() {
      return !this.isOwned && !this.showSeckill && this.state !== 0; // 新增下架状态不展示originPrice
    },

    /** 默认界面状态 **/
    mainText() {
      return [
        '已下架',
        this.defaultPaidText,
        this.defaultUnPaidText,
        '查看专栏',
      ][this.state];
    },
    mainClass() {
      return [
        'goods-action__main--notstock',
        '',
        '',
        '',
      ][this.state];
    },
    mainActionType() {
      return [
        '',
        'default-paid',
        'default-unpaid',
        'enter-column',
      ][this.state];
    },
    defaultPaidText() {
      return '您已购买';
    },
    defaultUnPaidText() {
      return '购买内容';
    },

    /** 控制按钮的显示 **/
    showImBtn() {
      return +shopConfig.is_web_im_in_goods === 1;
    },
    showShopBtn() {
      return +shopConfig.show_shop_btn === 1;
    },
    showColumnBtn() {
      if (typeof this.showColumn === 'boolean') {
        return this.showColumn;
      } else {
        return this.allowSingleBuy && this.columnUrl;
      }
    },

    /** 默认状态 **/
    homeUrl() {
      return `${window._global.wap_url.wap}/showcase/homepage?kdt_id=${
        window._global.kdt_id
      }`;
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

  methods: {
    handleCustomAction(data) {
      this.$emit(this.mainActionType, data);
    },
  },
};
</script>

<style lang="scss">
@import 'var';

.goods-action {
  z-index: 999;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;

  .van-goods-action {
    position: static;
  }

  .goods-action__main--notstock {
    color: $c-gray-dark;
    background-color: $c-gray-light;
  }
}
</style>
