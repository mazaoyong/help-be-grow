<template>
  <card-cell :is-link="false" class="tuition-cell" title="学费兑换">
    <span class="tuition-cell__value">
      {{ text }}
    </span>
    <van-checkbox
      v-model="isUseTuition"
      icon-size="16px"
      :checked-color="mainColor"
      class="tuition-cell__radio"
    />
  </card-cell>
</template>

<script>
import { Checkbox as VanCheckbox } from 'vant';
import { CardCell } from '@/pages/trade/buy/components/card';
import format from '@youzan/utils/money/format';
let lock = false;

export default {
  name: 'tuition-cell',

  components: {
    CardCell,
    VanCheckbox,
  },

  state: ['useTuition', 'tuition', 'mainColor'],

  getters: [
    // 'isUseTuition',
    'isOrderCreated',
  ],

  computed: {
    isUseTuition: {
      get() {
        return this.useTuition;
      },
      set(value) {
        if (lock) {
          return;
        }
        lock = true;
        this.$commit('SET_IS_USE_TUITION', value);
        this.$dispatch('FETCH_POST_CONFIRM_ORDER')
          .catch(() => {
            this.$commit('SET_IS_USE_TUITION', !value);
          })
          .finally(() => {
            lock = false;
          });
      },
    },
    text() {
      const {
        userEnableDeduction,
        realEnableDeduction,
      } = this.tuition.tuitionDeduction;
      return `共 ${format(
        userEnableDeduction,
        true,
        false,
      )} 元学费可抵 ${format(realEnableDeduction, true, false)} 元`;
    },
  },
};
</script>

<style lang="scss" scoped>
.tuition-cell__value {
  display: inline-block;
}

.tuition-cell__radio {
  display: inline-block;
  margin-left: 4px;
  vertical-align: text-bottom;
}
</style>
