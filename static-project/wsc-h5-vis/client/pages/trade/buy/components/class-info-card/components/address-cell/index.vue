<template>
  <card-cell
    title="地点"
    tip="选择上课地点"
    :value="value"
    :is-editable="isEditable"
    border
    @click="onClickCell"
  />
</template>

<script>
import { Toast } from 'vant';
import { CardCell } from '@/pages/trade/buy/components/card';
import { openAddressListPopup } from '../address-list-popup';

export default {
  name: 'address-cell',

  components: {
    CardCell,
  },

  props: {
    getAddressList: {
      type: Function,
      default: () => Promise.resolve([]),
    },
    chosenAddress: {
      type: Object,
      default: () => ({}),
    },
    chosenAppointment: {
      type: Object,
      default: () => ({}),
    },
    isNeedAppointment: {
      type: Boolean,
      default: false,
    },
    isEditable: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    value() {
      return this.chosenAddress.name;
    },
  },

  methods: {
    onClickCell() {
      if (this.isNeedAppointment && this.chosenAppointment.addressId) {
        return Toast('预约的课程中已包含地址，不可选择');
      }

      this.getAddressList()
        .then(addressList =>
          openAddressListPopup({
            props: {
              chosenAddressId: this.chosenAddress.id,
              addressList,
            },
          })
        )
        .then(chosenAddress => {
          this.$emit('change', chosenAddress);
        });
    },
  },
};
</script>
