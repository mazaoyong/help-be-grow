<template>
  <div :class="['main-button', type]" @click="handleClick">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'main-button',
  data() {
    return {};
  },
  props: {
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'default',
    },
  },
  methods: {
    handleClick() {
      this.$emit('handle-click');
    },
  },
};
</script>

<style lang="scss" scoped>
.main-button {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  background: linear-gradient(45deg, #ff7b17 0%, #ff2b00 100%);
  border-radius: 32px;

  &.large {
    height: 64px;
    line-height: 64px;
    font-weight: 500;
    font-size: 24px;
  }
}
</style>
