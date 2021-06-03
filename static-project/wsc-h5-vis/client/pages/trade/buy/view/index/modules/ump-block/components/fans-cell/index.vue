<template>
  <div>
    <card-cell
      :title="fansBenefit.name"
      :value="fansBenefitValue"
      @click="onCLickCell"
    />
  </div>
</template>

<script>
import { CardCell } from '@/pages/trade/buy/components/card';
import { openDiscountDetailPopup } from '../discount-detail';

export default {
  name: 'fans-cell',

  components: {
    CardCell,
  },

  state: ['fansBenefit'],

  computed: {
    fansBenefitValue() {
      return `-￥${this.fansBenefit.value / 100}`;
    },
  },

  methods: {
    onCLickCell() {
      openDiscountDetailPopup({
        props: {
          title: this.fansBenefit.name,
          discountDetail: [ this.fansBenefit ],
        },
      });
    },
  },
};
</script>
