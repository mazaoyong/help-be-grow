<template>
  <div
    class="moments-pe-actions-c"
    @click="onClick"
  >
    <div class="moments-pe-actions-c__left">
      <div
        class="moments-pe-actions-c__left-icon"
      >
        <vis-icon
          :name="icon"
          size="22px"
          :color="iconColor"
        />
      </div>
      <p
        class="moments-pe-actions-c__left-title"
        :style="{
          color: textColor
        }"
      >
        {{ title }}
      </p>
    </div>
    <div class="moments-pe-actions-c__right">
      <div
        class="moments-pe-actions-c__right-value"
        :style="{
          color: textColor
        }"
      >
        <slot name="right">
          {{ value }}
        </slot>
      </div>
      <vis-icon
        name="arrow"
        size="16px"
        :color="disabled ? '#c8c9cc' : '#969799'"
      />
    </div>
  </div>
</template>

<script>
import { Field } from 'vant';
import { Icon } from '@youzan/vis-ui';

export default {
  name: 'post-action',

  components: {
    [Field.name]: Field,
    'vis-icon': Icon,
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'address',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
    };
  },

  computed: {
    iconColor() {
      if (this.disabled) {
        return '#c8c9cc';
      } else if (this.value || this.active) {
        return '#00b389';
      } else {
        return '#323233';
      }
    },
    textColor() {
      if (this.disabled) {
        return '#c8c9cc';
      } else if (this.value || this.active) {
        return '#00b389';
      } else {
        return '#323233';
      }
    },
  },

  methods: {
    onClick() {
      if (!this.disabled) {
        this.$emit('click');
      }
    },
  },
};
</script>

<style lang="scss">
  .moments-pe-actions-c {
    height: 57px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      transform: scale(.5);
      transform-origin: 0 0;
      pointer-events: none;
      box-sizing: border-box;
      border-top: 1px solid #ebedf0;
    }

    &__left {
      display: flex;
      align-items: center;
      min-width: 100px;

      &-title {
        font-size: 16px;
        line-height: 16px;
        margin-left: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &-icon {
        width: 19px;
      }
    }

    &__right-value {
      margin-right: 4px;
    }

    &__right {
      display: flex;
      align-items: center;

      &-title {
        font-size: 16px;
      }
    }
  }
</style>
