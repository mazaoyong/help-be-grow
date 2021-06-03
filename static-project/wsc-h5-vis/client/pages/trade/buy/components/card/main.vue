<template functional>
  <div class="vis-biz-card" :class="data.staticClass">
    <div class="vis-biz-card__content">
      <div
        v-if="$slots.head || props.title"
        class="vis-biz-card__head van-hairline--bottom"
      >
        <slot name="head">
          <span>{{ props.title }}</span>
        </slot>
      </div>
      <div class="vis-biz-card__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',

  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
@import 'mixins/index.scss';
.vis-biz-card {
  padding: 12px 12px 0;

  &__content {
    border-radius: 8px;
    background: $white;
    overflow: hidden;
  }

  &__head {
    position: relative;
    margin: 0 12px;
    line-height: 44px;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
