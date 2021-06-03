<template>
  <div class="appointment-footer fixed-btn">
    <div
      class="appointment-footer__no"
      @click="onClose"
    >
      暂不选择
    </div>
    <div
      class="appointment-footer__ok"
      :class="{
        'appointment-footer__ok--disabled': disableConfirm,
      }"
      @click="onConfirm"
    >
      确定
    </div>
  </div>
</template>

<script>
export default {
  name: 'appointment-footer',
  props: {
    appointmentList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
    };
  },
  computed: {
    disableConfirm() {
      return this.appointmentList.filter(item => item.checked).length === 0;
    },
  },

  methods: {
    onConfirm() {
      const value = this.appointmentList.filter(item => item.checked)[0] || {};

      this.$emit('confirm', value);
    },

    onClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
  .appointment-footer {
    display: flex;
    width: 100%;
    height: 50px;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 9999;

    &__no {
      text-align: center;
      flex: 1;
      font-size: 16px;
      color: #969799;
      line-height: 50px;
      background-color: #fff;
    }

    &__ok {
      width: 50%;
      text-align: center;
      background-color: #00b389;
      font-size: 16px;
      color: #fff;
      line-height: 50px;

      &--disabled {
        pointer-events: none;
        opacity: 0.5;
      }
    }
  }
</style>
