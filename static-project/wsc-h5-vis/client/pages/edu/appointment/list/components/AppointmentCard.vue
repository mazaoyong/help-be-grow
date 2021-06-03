<template>
  <div class="appointment-card">
    <div class="appointment-card__title">
      {{ title }}
    </div>
    <div class="appointment-card__list">
      <div class="list-item">
        <span class="list-item__name">
          课时
        </span>
        剩余{{ remain / 100 }}/共{{ total / 100 }}
      </div>
      <div class="list-item">
        <span class="list-item__name">
          有效期
        </span>
        {{ validDate }}
      </div>
      <div class="list-item">
        <span class="list-item__name">
          学员
        </span>
        {{ studentName }}
      </div>
    </div>

    <div
      v-if="isValid"
      @click="onAppointmentMake"
      class="appointment-card__action"
    >
      预约
    </div>
    <div
      v-else
      class="appointment-card__invalid-status"
    >
      尚未生效，无法预约
    </div>
  </div>
</template>

<script>
export default {
  name: 'appointment-card',

  props: {
    isValid: Boolean,
    title: String,
    total: Number,
    remain: Number,
    validDate: String,
    studentName: String,
  },

  methods: {
    onAppointmentMake() {
      this.$emit('make-appointment');
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';

.appointment-card {
  margin-top: 10px;
  padding: 16px 15px;
  border-radius: 4px;

  &__title {
    line-height: 22px;
    font-size: 16px;
    color: #323233;

    @include multi-ellipsis(2);
  }

  &__list {
    margin-top: 8px;
  }

  .list-item {
    margin-top: 8px;
    line-height: 18px;
    font-size: 13px;
    color: #323233;

    &__name {
      color: #969799;
    }
  }

  &__action,
  &__invalid-status {
    position: absolute;
    right: 15px;
    bottom: 16px;
  }

  &__action {
    padding: 7px 20px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #fff;
    background: #00b389;
    border-radius: 22px;
  }
}
</style>
