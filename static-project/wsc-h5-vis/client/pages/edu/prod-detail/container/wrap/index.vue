<template>
  <div
    :class="[noneBottomClass, extendClass]"
    :style="extendStyle"
    @click="onClick"
    class="vis-wrap"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'wrap',

  props: {
    extendStyle: {
      type: String,
      default: '',
    },
    extendClass: {
      type: String,
      default: '',
    },
    noneBottom: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      noneBottomClass: this.noneBottom ? 'vis-wrap-none-bottom' : '',
    };
  },

  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss">
.vis-wrap {
  box-sizing: border-box;
  width: 100%;
  background-color: #fff;
  border-bottom: 10px solid #f7f8fa;
  padding: 16px;
}
.vis-wrap-none-bottom {
  border-bottom: none;
}
</style>
