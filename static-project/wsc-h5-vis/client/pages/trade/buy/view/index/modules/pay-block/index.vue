<template>
  <cap-pay
    :value="cashier.isShowPayView"
    :loading-pay-way="loadingPayWay"
    :show-password="cashier.isShowPassword"
    :pay-ways="cashier.payWays"
    :on-pay-way-selected="onSelectPayWay"
    @input="onChangePay"
    @update:show-password="onChangeShowPassword"
  />
</template>

<script>
import { Pay } from 'captain-ui';
import { getBillManage } from '../../../../saas';
export default {
  name: 'pay-block',

  state: ['cashier'],

  components: {
    'cap-pay': Pay,
  },

  computed: {
    loadingPayWay() {
      return this.cashier.selectedPayWayData.payWay || {};
    },
  },

  methods: {
    onChangeShowPassword(isShow) {
      this.$commit('SET_CASHIER_SHOW_PASSWORD', isShow);
    },

    onSelectPayWay(data) {
      const billManage = getBillManage();
      billManage.selectPayWay(data);
    },

    onChangePay(value) {
      this.$commit('SET_CASHIER_SHOW_PAY_VIEW', value);
    },
  },
};
</script>
