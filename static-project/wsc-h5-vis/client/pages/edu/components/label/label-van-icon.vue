<template>
  <div class="label-van-label">
    <div
      :style="extendLeftStyle"
      class="label-van-label-left"
    >
      <slot name="left-content">
        {{ leftContent }}
      </slot>
    </div>
    <div
      :style="extendRightStyle"
      class="label-van-label-right"
      @click="onClick"
    >
      <slot name="right-content">
        {{ rightContent }}
      </slot>
      <van-icon
        v-if="showArrow"
        name="arrow"
        class="label-van-label-icon van-cell__right-icon"
        color="#c8c9cc"
      />
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'label-van-label',
  components: {
    'van-icon': Icon,
  },
  props: {
    leftContent: {
      type: String,
      default: '',
    },
    rightContent: {
      type: String,
      default: '',
    },
    showArrow: {
      type: Boolean,
      default: false,
    },
    extendLeftStyle: {
      type: String,
      default: '',
    },
    extendRightStyle: {
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

<style lang="scss">
.label-van-label {
  display: flex;
  width: 100%;
  height: 44px;
  line-height: 44px;
  background-color: #fff;
  &-left {
    display: flex;
    width: 46px;
    height: 44px;
    line-height: 44px;
    text-align: left;
    font-size: 13px;
    color: #969799;
  }
  &-right {
    position: relative;
    display: flex;
    flex: 1;
    text-align: left;
    font-size: 13px;
    color: #323233;
    overflow: hidden;
  }
  &-icon {
    position: absolute;
    top: 50%;
    right: 16px;
    margin-top: -12px;
  }
}
</style>
