<template>
  <div class="buy-tips">
    <p v-if="isContent" class="buy-tips__content">
      你当前购买的是单篇内容，订单付款后（送好友订单，好友领取后）资金立即结算给商家。
    </p>
    <p class="buy-tips__content">
      <span>请仔细阅读</span>
      <a
        v-log:click="{
          ei: 'edu_click_btn',
          en: '教育下单点击页面按钮',
          pt: 'trade',
          params: {
            btn_name: 'edu_buy_tips'
          }
        }"
        class="buy-tips__link"
        :href="tipsUrl"
      >购买须知</a>
      <span>，点击提交订单即代表你已阅读并同意条款内容。</span>
    </p>
  </div>
</template>

<script>
import buildUrl from '@youzan/utils/url/buildUrl';

export default {
  name: 'buy-tips-block',

  getters: ['isContent'],

  computed: {
    tipsUrl() {
      const kdtId = window._global.kdt_id;
      return buildUrl('/wscvis/edu/attentions-in-purchase', 'h5', kdtId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.buy-tips {
  padding: 12px 12px 0;
  color: $disabled-color;

  &__content {
    padding-left: 4px;
    margin-bottom: 4px;
    font-size: 12px;
    line-height: 16px;
  }

  &__link {
    color: #576b95;
  }
}
</style>
