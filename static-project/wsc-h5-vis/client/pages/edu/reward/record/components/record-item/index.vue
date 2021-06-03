<template>
  <div class="record-item">
    <div class="record-item__left">
      <span class="record-item__label">{{ label }}</span>
      <span class="record-item__date">{{ date }}</span>
    </div>
    <div class="record-item__right">
      <span class="record-item__symbol">+</span>
      <span class="record-item__number">{{ number }}</span>
      <span class="record-item__unit">{{ unit }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'record-item',
  props: {
    label: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
    },
    number: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  box-sizing: border-box;
  padding: 10px 16px;
  &__left {
    display: flex;
    flex-direction: column;
  }
  &__right {
    color: #9B9B9B;
    font-size: 16px;
    line-height: 20px;
  }
  &__label {
    font-size: 16px;
    line-height: 20px;
    color: #333;
  }
  &__date {
    font-size: 13px;
    line-height: 18px;
    color: #888;
  }
}
</style>
