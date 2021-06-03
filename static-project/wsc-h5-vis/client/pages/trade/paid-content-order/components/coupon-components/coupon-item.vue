<template>
  <div class="order-coupon-item" :class="{ 'order-coupon-item--disabled': disabled }">
    <div class="order-coupon-item__info">
      <div class="order-coupon-item__info-head">
        <div class="order-coupon-item__info-gradient">
          <h2 class="order-coupon-item__info-gradient-title" v-html="getItemPrice(data)" />
          <p class="order-coupon-item__info-gradient-condition">
            {{ conditionMessage }}
          </p>
        </div>
      </div>
      <div class="order-coupon-item__info-body">
        <h2 class="order-coupon-item__info-body-name">
          {{ data.name }}
        </h2>
        <span class="order-coupon-item__info-body-expiry">
          {{ validPeriod }}
        </span>
        <div v-if="chosen" class="order-coupon-item__info-body-corner">
          <icon name="success" />
        </div>
      </div>
    </div>
    <div class="order-coupon-item__footer">
      <p v-if="!disabled" class="order-coupon-item__footer-tips">
        {{ data.tips }}
      </p>
      <p v-else class="order-coupon-item__footer-tips">
        {{ data.reason }}
      </p>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'van-coupon-item',

  components: {
    Icon,
  },

  props: {
    data: Object,
    chosen: Boolean,
    disabled: Boolean,
  },

  data() {
    return {
      isMultyLine: false,
    };
  },

  computed: {
    validPeriod() {
      return `${this.getDate(this.data.start_at)}-${this.getDate(this.data.end_at)}`;
    },

    conditionMessage() {
      let condition = this.data.origin_condition;
      condition = condition % 100 === 0 ? Math.round(condition / 100) : (condition / 100).toFixed(2);
      return this.data.origin_condition === 0 ? '无使用门槛' : '满' + condition + '元可用';
    },
  },

  methods: {
    getItemPrice(item) {
      const texts = ['', '', ''];
      if (item.denominations) {
        texts[0] = '￥';
        texts[1] = Math.floor(item.denominations / 100);
        if (item.denominations % 100 !== 0) {
          texts[2] = '.' + this.padZero(item.denominations % 100);
        } else {
          texts[2] = '.00';
        }
      } else if (item.discount) {
        texts[1] = item.discount / 10;
        texts[2] = ' 折';
        if (item.discount % 10 !== 0) {
          texts[1] = texts[1].toFixed(1);
        }
      }
      return `<span class='font-small'>${
        texts[0]
      }</span><span class='font-big'>${
        texts[1]
      }</span><span class='font-small'>${texts[2]}</span>`;
    },

    getDate(timeStamp) {
      const time = Number(timeStamp);
      const date = new Date(time * 1000);
      return `${date.getFullYear()}.${this.padZero(date.getMonth() + 1)}.${this.padZero(date.getDate())}`;
    },
    padZero(num) {
      return (num < 10 ? '0' : '') + num;
    },
    formatDiscount(discount) {
      return `${(discount / 10).toFixed(discount % 10 === 0 ? 0 : 1)}折`;
    },
    formatAmount(amount) {
      return (amount / 100).toFixed(amount % 100 === 0 ? 0 : amount % 10 === 0 ? 1 : 2);
    },
  },
};
</script>

<style lang="scss">
  @import 'var';
  @import 'mixins/index.scss';

  .order-coupon-item {
    margin-bottom: 10px;

    /* 优惠券不可用 */
    &.order-coupon-item--disabled {
      .order-coupon-item__info {
        background: linear-gradient(49deg, #d2d5d8 0%, #c7c9cc 100%);
      }
    }

    &__info {
      width: 100%;
      overflow: hidden;
      display: block;
      position: relative;
      min-width: 320px;
      background: linear-gradient(49deg, #ff8b8b 0%, #ff6565 100%);
      color: $c-white;

      &:after {
        content: " ";
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 10px;
        background:
          -webkit-linear-gradient(transparent 0%, transparent 0%),
          -webkit-linear-gradient(135deg, #fff 55%, transparent 55%) 0 0%,
          transparent -webkit-linear-gradient(45deg, #fff 55%, transparent 55%) 0 0%;
        background-repeat: repeat-x;
        background-size: 0 100%, 9px 27px, 9px 27px;
      }

      &-head {
        position: relative;
        float: left;
        width: 25%;
        height: 80px;
        margin-right: 2%;
        box-sizing: border-box;

        &:after {
          content: '';
          position: absolute;
          right: 0;
          top: 10%;
          width: 1px;
          height: 80%;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAC0CAYAAAC3zl02AAAABGdBTUEAALGPC/xhBQAAAI9JREFUWAntlEEKwCAMBJvSX3i3n+lz+5l69x22QsRDWMhBCJQVJJrNxVmTbQNLer7Wen4ha01JKT27XnJr7ep7FAxB9Rl+Lxz61iIi9zjP9wed6KABD38iHfSzghBDBTpIBw2BBQlOUQMR9jl70M8KQgwV6CAdNAQWJDhFDUTY5+xBPysIMVSgg3TQEPAnXtdWj+l4tqdAAAAAAElFTkSuQmCC);
          background-size: cover;
        }
      }

      &-gradient {
        &-title {
          height: 40px;
          line-height: 60px;
          text-align: center;
          margin-top: 5px;
        }

        .font-small {
          font-size: 14px;
        }

        .font-big {
          font-size: 22px;
        }

        &-condition {
          line-height: 20px;
          font-size: 12px;
          text-align: center;
        }
      }

      &-body {
        float: left;
        width: 71%;
        height: 80px;
        padding: 0 90px 0 15px;
        box-sizing: border-box;

        &-name {
          height: 16px;
          line-height: 16px;
          margin-top: 17px;
          font-size: 14px;
        }

        &-expiry {
          display: block;
          line-height: 12px;
          margin-top: 15px;
          font-size: 12px;
        }

        &-corner {
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 18px 19px;
          border-radius: 0 4px 0 0;
          border-color: #ff8b8b #ff8b8b transparent transparent;

          .van-icon {
            position: absolute;
            top: -13px;
            right: -13px;
            color: #ff5c5c;
            font-size: 12px;
          }
        }
      }
    }
    &__footer {
      width: 100%;
      min-width: 320px;
      min-height: 34px;
      background-color: $c-white;
      font-size: 12px;
      color: $c-gray;
       p {
        height: 34px;
        line-height: 34px;
        padding-left: 15px;

        @include multi-ellipsis(1);
       }
    }
  }
</style>
