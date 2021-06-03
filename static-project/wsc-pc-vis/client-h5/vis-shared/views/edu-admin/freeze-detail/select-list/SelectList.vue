<template>
  <component
    :is="currentTabComponent"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div slot="icon">
      <slot name="icon" />
    </div>
    <div
      slot-scope="{item, index}"
    >
      <slot
        :item="item"
        :index="index"
      />
    </div>
  </component>
</template>

<script>
import Single from './Radio';
import Multi from './Checkbox';

export default {
  components: {
    'vis-select-single': Single,
    'vis-select-multi': Multi,
  },
  inheritAttrs: false,
  props: {
    type: {
      validator(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['single', 'multi'].indexOf(value) !== -1;
      },
      default: 'single',
    },
  },

  computed: {
    currentTabComponent() {
      return this.type === 'single' ? 'vis-select-single' : 'vis-select-multi';
    },
  },
};
</script>

<style lang="scss">

</style>
