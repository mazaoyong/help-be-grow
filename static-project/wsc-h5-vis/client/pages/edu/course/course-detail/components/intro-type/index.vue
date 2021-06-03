<template>
  <div
    class="intro-type"
  >
    <vis-icon
      :name="typeName"
      size="12px"
      class="type__icon"
    />
    <span class="type__text">
      {{ typeDesc }}
    </span>
    <vis-icon
      v-if="typeArrow"
      name="arrow"
      size="14px"
      color="#7d7e80"
      class="type__icon type__arrow"
    />

    <slot name="after" />
  </div>
</template>
<script>
import { Icon } from '@youzan/vis-ui';

export default {
  name: 'intro-type',

  components: {
    'vis-icon': Icon,
  },

  props: {
    typeName: {
      type: String,
      default: '',
    },
    typeDesc: {
      type: String,
      default: '',
    },
    typeArrow: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss">
.intro-type {
  margin-top: 8px;

  .type__icon {
    vertical-align: middle;
  }

  .type__arrow {
    float: right;
    margin-top: 3px;
    color: #7d7e80;
  }

  .type__text {
    font-size: 13px;
    color: #7d7e80;
    line-height: 18px;
    vertical-align: -1px;
  }
}
</style>
