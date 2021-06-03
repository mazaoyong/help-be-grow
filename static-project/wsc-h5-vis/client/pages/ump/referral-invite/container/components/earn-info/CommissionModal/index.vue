<template>
  <van-popup
    v-model="value"
    class="total-commission-dialog"
  >
    <p class="total-commission-dialog__title">
      累计佣金
    </p>

    <div class="total-commission-dialog__content">
      <p>1.累计佣金中包含待结算金额：￥{{ settleAmount }} ；</p>
      <p>2.推广订单过了冻结期(最长7天)，对应的佣金可提现。</p>
    </div>

    <div class="total-commission-dialog__footer">
      <div
        class="footer__button"
        @click="onClick"
      >
        知道了
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Popup } from 'vant';
export default {
  name: 'total-commission-dialog',

  components: {
    'van-popup': Popup,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    settleAmount: {
      type: Number,
      default: 0,
    },
  },

  methods: {
    onClick() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.total-commission-dialog {
  border-radius: 16px;
  width: 311px;

  &__title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    line-height: 44px;
  }

  &__content {
    padding: 20px;
    color: #323233;
    font-size: 14px;
    line-height: 20px;
  }

  &__footer {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    .footer__button {
      width: 280px;
      height: 36px;
      border-radius: 18px;
      color: #fff;
      line-height: 36px;
      text-align: center;
      margin-bottom: 12px;
      background-image: linear-gradient(90deg, #FF6034 0%, #EE0A24 100%);
    }
  }
}
</style>
