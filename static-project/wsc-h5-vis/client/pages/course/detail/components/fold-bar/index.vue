<template>
  <div class="fold-bar" :class="{ shadow }" @click="click">
    <span>{{ text }}</span>
    <van-icon class="fold-icon" name="arrow-down" />
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  components: {
    'van-icon': Icon,
  },

  props: {
    text: {
      type: String,
      default: '查看全部',
    },
    shadow: Boolean,
  },

  methods: {
    click() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.fold-bar {
  width: 100%;
  height: 44px;
  line-height: 44px;
  text-align: center;
  background-color: $white;
  font-size: 14px;
  color: $main-text-color;

  &.shadow {
    box-shadow: 0px -20px 20px 0px $white;
  }

  .fold-icon {
    position: relative;
    top: 2px;
    margin-left: 2px;
    color: $vice-text-color;
  }
}
</style>
