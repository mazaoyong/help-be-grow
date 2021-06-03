<template>
  <div class="label">
    <span class="left">{{ leftText }}</span>
    <span
      class="right"
      :class="rightText.indexOf('必填') === -1 ? '' : 'right_gray'"
      @click="onClick"
    >
      {{ rightText }}
    </span>
    <icon
      class="arrow-right"
      name="arrow"
      size="14px"
      color="#c8c9cc"
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
  flex-wrap: wrap;
  height: 46px;
  line-height: 46px;
  border-bottom: 1px solid #f2f2f2;
  &:last-child {
    border: none;
  }
  .left {
    display: block;
    margin-right: 20px;
    width: 66px;
    height: 46px;
    line-height: 46px;
    font-size: 14px;
    color: #646566;
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
    right: 0;
  }
}
</style>
