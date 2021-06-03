<template>
  <class-info-card
    :is-editable="!isOrderCreated"
    :is-need-time="isNeedTime"
    :is-need-address="isNeedAddress"
    :is-need-appointment="isNeedAppointment"
    :chosen-time="classTime.chosenTime"
    :chosen-student="chosenStudent"
    :chosen-appointment="appointment"
    :chosen-address="chosenClassAddress"
    :get-address-list="getAddressList"
    v-bind="couseInfoProps"
    @change="onChange"
  />
</template>

<script>
import { pick } from 'lodash';
import YZSessionStorage from '@youzan/utils/browser/session_storage';
import { ClassInfoCard } from '@/pages/trade/buy/components/class-info-card';

export default {
  name: 'class-block',

  state: ['classTime', 'appointment'],

  getters: [
    'singleGoods',
    'isNeedTime',
    'isNeedAddress',
    'isNeedAppointment',
    'isOrderCreated',
    'chosenClassAddress',
    'chosenStudent',
  ],

  components: {
    ClassInfoCard,
  },

  computed: {
    couseInfoProps() {
      const { orderCourseDTO } = this.singleGoods;
      return Object.assign(
        pick(this.singleGoods, ['alias', 'skuId']),
        pick(orderCourseDTO, [
          'courseStartAt',
          'courseEndAt',
          'applyCourseType',
        ])
      );
    },
  },

  mounted() {
    if (this.isNeedAddress) {
      this.$dispatch('GET_ADDRESS_LIST')
        .then((addressList = []) => {
          if (addressList.length === 1) {
            this.$commit('SET_CHOSEN_CLASS_ADDRESS', addressList[0]);
          }
        })
        .catch(() => {
          this.$commit('SET_CLASS_ADDRESS_DOWN', true);
        });
    }
  },

  methods: {
    onChange(action = {}) {
      switch (action.type) {
        case 'time':
          this.$commit('SET_CHOSEN_CLASS_TIME', action.payload);
          YZSessionStorage.setItem('selectedDate', action.payload);
          break;
        case 'address':
          this.$commit('SET_CHOSEN_CLASS_ADDRESS', action.payload);
          YZSessionStorage.setItem(
            'selectedAddressItem',
            JSON.stringify(action.payload)
          );
          break;
        case 'appointment':
          this.$commit('SET_CHOSEN_APPOINTMENT', action.payload);
          break;
      }
    },

    getAddressList() {
      return this.$dispatch('GET_ADDRESS_LIST', { usePosition: true });
    },
  },
};
</script>
