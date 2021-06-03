<template>
  <div
    class="spread"
  >
    <slot />
    <div
      v-if="isShowArrow"
      class="mask"
      @click="onToggle"
    >
      <icon
        :name="isSpread ? 'arrow-down' : 'arrow-up'"
        size="18px"
        color="#d4d4d4"
      />
    </div>
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';

export default {
  name: 'spread',
  components: {
    'icon': Icon,
  },
  props: {
    maxHeight: {
      type: Number,
      default: 200,
    },
    isShowArrow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isSpread: true,
    };
  },
  methods: {
    onToggle() {
      this.isSpread = !this.isSpread;
      this.$emit('toggle', this.isSpread);
    },
  },
};
</script>

<style lang="scss" scoped>
.spread {
  margin: 10px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
  .mask {
    height: 25px;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
  }
}
</style>
