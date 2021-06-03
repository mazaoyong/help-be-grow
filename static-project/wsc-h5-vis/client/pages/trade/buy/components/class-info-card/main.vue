<template>
  <card v-if="isShowCard" class="class-info-card" title="上课信息">
    <time-cell
      v-if="isNeedTime"
      :start-at="courseStartAt"
      :end-at="courseEndAt"
      :chosen-time="chosenTime"
      :is-editable="isEditable"
      @change="onChange('time', $event)"
    />

    <appointment-cell
      v-if="isNeedAppointment"
      :chosen-student="chosenStudent"
      :chosen-appointment="chosenAppointment"
      :is-editable="isEditable"
      :alias="alias"
      :sku-id="skuId"
      :apply-course-type="applyCourseType"
      @change="onChange('appointment', $event)"
    />

    <address-cell
      v-if="isShowAddressCell"
      :is-editable="isEditable"
      :is-need-appointment="isNeedAppointment"
      :chosen-appointment="chosenAppointment"
      :chosen-address="chosenAddress"
      :get-address-list="getAddressList"
      @change="onChange('address', $event)"
    />
  </card>
</template>

<script>
import { Card } from '@/pages/trade/buy/components/card';
import TimeCell from './components/time-cell';
import AppointmentCell from './components/appointment-cell';
import AddressCell from './components/address-cell';

export default {
  name: 'class-block',

  components: {
    Card,
    TimeCell,
    AppointmentCell,
    AddressCell,
  },

  state: ['appointment'],

  props: {
    isNeedTime: {
      type: Boolean,
      default: false,
    },

    isNeedAddress: {
      type: Boolean,
      default: false,
    },

    isNeedAppointment: {
      type: Boolean,
      default: false,
    },

    courseStartAt: {
      type: Number,
      default: undefined,
    },

    courseEndAt: {
      type: Number,
      default: undefined,
    },

    alias: {
      type: String,
      default: '',
    },

    skuId: {
      type: Number,
      default: 0,
    },

    applyCourseType: {
      type: Number,
      default: undefined,
    },

    isEditable: {
      type: Boolean,
      default: true,
    },

    chosenStudent: {
      type: Object,
      default: () => ({}),
    },

    chosenTime: {
      type: Date,
      default: undefined,
    },

    chosenAppointment: {
      type: Object,
      default: () => ({}),
    },

    chosenAddress: {
      type: Object,
      default: () => ({}),
    },

    getAddressList: {
      type: Function,
      default: () => Promise.resolve([]),
    },
  },

  computed: {
    isShowCard() {
      return this.isNeedTime || this.isNeedAddress || this.isNeedAppointment;
    },

    isShowAddressCell() {
      if (!this.isNeedAddress) {
        return false;
      }

      // 预约的情况，当未选择预约信息的情况，不显示地址选择
      if (this.isNeedAppointment && !this.chosenAppointment.lesson) {
        return false;
      }

      return true;
    },
  },

  methods: {
    onChange(type, payload) {
      this.$emit('change', {
        type,
        payload,
      });
    },
  },
};
</script>

<style lang="scss">
.lass-info-card {
  .vis-biz-card-cell__value {
    font-weight: normal;
  }
}
</style>
