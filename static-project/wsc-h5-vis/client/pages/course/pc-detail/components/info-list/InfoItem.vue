<template>
  <div class="info-item" :style="{ color }">
    <div v-if="label" class="info-item__label">
      {{ label }}<span v-if="showColon">：</span>
    </div>
    <div v-if="value" class="info-item__value">
      {{ value }}
    </div>

    <div
      v-if="tag && tag.text"
      class="info-item__tag"
      :style="{
        color: tag.color,
        backgroundColor: tag.backgroundColor,
      }"
    >
      {{ tag.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'info-item',

  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    tag: {
      type: Object,
      default: () => ({}),
    },
    color: {
      type: String,
      default: '#646566',
    },
    showColon: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss">
.info-item {
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 14px;
  line-height: 20px;
  color: #646566;

  &__tag {
    display: inline-block;
    height: 18px;
    padding: 0 4px;
    margin-left: 8px;
    font-size: 12px;
    line-height: 18px;
    color: #646566;
    background: #f2f3f5;
    border-radius: 9px;
  }
}
</style>
