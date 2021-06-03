<template>
  <van-popup
    v-model="show"
    class="total-commission-dialog"
  >
    <p class="total-commission-dialog__title">
      我的收益
    </p>

    <div class="total-commission-dialog__content">
      <p>我的收益包含所有参加过的好友下单有礼活动收益。</p>
    </div>

    <div class="total-commission-dialog__footer">
      <div
        class="footer__button"
        @click="show = false"
      >
        知道了
      </div>
    </div>
  </van-popup>
</template>

<script>
import { Popup } from 'vant';
export default {
  components: {
    'van-popup': Popup,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
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
