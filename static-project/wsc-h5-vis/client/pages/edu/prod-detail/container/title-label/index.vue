<template>
  <div
    :class="extendClass"
    class="vis-title-label"
  >
    <span class="left-content">
      {{ leftContent }}
    </span>
    <span
      v-if="rightContent"
      @click="onClick"
      class="right-content"
    >
      {{ rightContent }}
    </span>
    <van-icon
      v-if="arrow"
      class="icon"
      name="arrow"
      color="#c8c9cc"
      @click="onClick"
    />
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'title-label',

  components: {
    'van-icon': Icon,
  },

  props: {
    extendClass: {
      type: String,
      default: '',
    },
    leftContent: {
      type: String,
      default: '',
    },
    rightContent: {
      type: String,
      default: '',
    },
    arrow: {
      type: Boolean,
      default: false,
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
.vis-title-label {
  position: relative;
  display: flex;
  width: 100%;
  height: 44px;
  line-height: 46px;
  .left-content {
    position: relative;
    width: 70%;
    height: 44px;
    line-height: 44px;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
    color: #323233;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .right-content {
    position: absolute;
    right: 36px;
    top: 0;
    height: 46px;
    line-height: 46px;
    font-size: 12px;
    color: #999;
  }
  .icon {
    position: absolute;
    right: 16px;
    top: 50%;
    margin-top: -8px;
  }
}
</style>
