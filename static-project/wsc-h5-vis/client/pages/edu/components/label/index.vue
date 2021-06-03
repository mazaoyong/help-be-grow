<template>
  <div class="vis-label">
    <div
      :style="extendLeftStyle"
      class="vis-label-left"
    >
      <slot name="left-content">
        {{ leftContent }}
      </slot>
    </div>
    <div
      :style="extendRightStyle"
      class="vis-label-right"
      @click="onClick"
    >
      <slot name="right-content">
        {{ rightContent }}
      </slot>
      <span
        v-if="showArrow"
        :class="noRight ? 'vis-icon-arrow-right-2': ''"
        class="vis-icon vis-icon-arrow-right"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'vis-label',
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
    noRight: {
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
.vis-label {
  display: flex;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-bottom: 1px solid #f2f2f2;
  background-color: #fff;
  &-left {
    display: flex;
    width: 72px;
    height: 46px;
    line-height: 46px;
    text-align: left;
    font-size: 13px;
    color: #666;
  }
  &-right {
    position: relative;
    display: flex;
    flex: 1;
    text-align: left;
    font-size: 13px;
    color: #111;
    overflow: hidden;
  }
  .vis-icon {
    position: absolute;
    width: 16px;
    height: 16px;
    background-position: center center;
    background-size: 16px 16px;
    background-repeat: no-repeat;
    &-arrow-right {
      top: 15px;
      right: 12px;
      background-image: url('https://b.yzcdn.cn/public_files/2018/10/16/0cdbdc2e12a1113eec5fb3efaf9b4b5d.png');
      &-2 {
        right: 0;
      }
    }
  }
}
</style>
