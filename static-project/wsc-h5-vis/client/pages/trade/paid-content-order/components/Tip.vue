<template>
  <div>
    <div
      v-if="isSecuredTransactions && isYZGuarantee"
      class="paid-order__tip-cover">
      本订单由&nbsp;
      <img
        class="paid-order__tip-img"
        :src="yzGuaranteeLogo">
      &nbsp;|&nbsp;
      <img
        class="paid-order__tip-img"
        :src="securedTransactionsLogo">
      &nbsp;全程保障
    </div>

    <div
      v-else-if="isSecuredTransactions"
      class="paid-order__tip-cover">
      本订单享受&nbsp;
      <img
        class="paid-order__tip-img"
        :src="securedTransactionsLogo">
      &nbsp;保险保障
    </div>

    <div v-else class="paid-order__tip-cover">
      付款后钱款立即到达商家账户，售后需联系商家处理
    </div>
  </div>
</template>

<script>
import UrlHelper from 'zan-utils/url/helper';

export default {
  name: 'tip',

  props: {
    isSecuredTransactions: Boolean,
    isYZGuarantee: Boolean,
  },

  computed: {
    yzGuaranteeLogo() {
      return UrlHelper.site('v2/image/yzguarantee/logo-green-new@2x.png', 'imgqn');
    },
    securedTransactionsLogo() {
      return UrlHelper.site('public_files/2016/01/05/f32fc608cf4173bffa3c23b0ad682bf9.png', 'imgqn');
    },
  },

  mounted() {
    // console.log(this.isSecuredTransactions, this.isYZGuarantee);
  },
};
</script>

<style lang="css">
$c-tip-color: #bfbfc3;

.paid-order {

  &__tip-cover {
    margin-top: 30px;
    margin-bottom: 30px;
    font-size: 12px;
    color: $c-tip-color;
    text-align: center;
  }

  &__tip-img {
    height: 14px;
    vertical-align: middle;
  }
}
</style>
