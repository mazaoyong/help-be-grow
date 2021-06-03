<template>
  <div class="paid-content__pay-container">
    <van-button
      class="paid-content__pay-button"
      block
      type="primary"
      @click="onPayClicked">
      去支付
    </van-button>
  </div>
</template>

<script>
import { Button } from 'vant';
import 'captain-pay/lib/index.css';

export default {

  name: 'action',

  components: {
    'van-button': Button,
  },

  methods: {
    onPayClicked() {
      this.$emit('pay');
    },
  },
};
</script>

<style lang="css">
.paid-content__pay-container {
  margin: 0 15px;
  z-index: 999;
}
</style>
