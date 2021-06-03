<template>
  <div class="label">
    <span class="left">{{ leftText }}</span>
    <span
      class="right"
      :class="isTextGray ? 'right_gray' : ''"
      @click="onClick"
    >
      {{ rightText }}
    </span>
    <icon
      class="arrow-right"
      name="arrow"
      size="14px"
      color="#d4d4d4"
    />
  </div>
</template>

<script>
import { Icon } from '@youzan/vis-ui';

export default {
  name: 'vis-label',
  components: {
    'icon': Icon,
  },
  props: {
    leftText: {
      type: String,
      default: '',
    },
    rightText: {
      type: String,
      default: '',
    },
  },
  computed: {
    isTextGray() {
      return this.rightText.indexOf('选择') > -1;
    },
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  position: relative;
  display: flex;
  padding: 0 15px;
  flex-wrap: wrap;
  height: 46px;
  line-height: 46px;
  .left {
    display: block;
    margin-right: 10px;
    width: 66px;
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    color: #323233;
  }
  .right {
    display: block;
    flex: 1;
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    color: #323233;
    &_gray {
      color: #ccc;
    }
  }
  .arrow-right {
    position: absolute;
    top: 18px;
    right: 15px;
  }
}
</style>
