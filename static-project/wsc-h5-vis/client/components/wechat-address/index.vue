<template>
  <van-cell
    center
    is-link
    :border="false"
    title="获取微信收货地址"
    class="wechat-address"
    @click="callWechatAddress"
  >
    <img
      slot="icon"
      class="wechat-address__icon"
      src="https://img01.yzcdn.cn/public_files/2018/08/16/38cc96772021404c9254b499438abae2.png"
    >
  </van-cell>
</template>

<script>
import { callWxAddress } from './wx-address';

export default {
  name: 'wechat-address',

  methods: {
    callWechatAddress() {
      callWxAddress().then(address => {
        this.$emit('save', address);
      });
    },
  },
};
</script>

<style lang="scss">
.wechat-address {
  padding: 10px 15px;

  &__icon {
    width: 20px;
    height: 17px;
    margin-right: 6px;
  }
}
</style>
