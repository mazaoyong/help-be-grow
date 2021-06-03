<template>
  <div
    class="selectable-item"
    :class="{
      'selectable-item--checked': selected,
    }"
    @click="onSelected"
  >
    <div class="selectable-item__label">
      {{ label }}
    </div>
    <div class="selectable-item__status" :class="[statusClass]">
      {{ statusText }}
    </div>
    <div class="selectable-item__check">
      <van-icon
        :class="{
          'hidden': !selected,
        }"
        name="success"
        color="#00b389"
        :size="13"
      />
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'selectable-item',

  components: {
    'van-icon': Icon,
  },

  props: {
    selected: Boolean,
    label: {
      type: String,
      default: '',
    },
    statusText: {
      type: String,
      default: 'danger-text',
    },
    statusClass: {
      type: String,
      default: '',
    },
  },

  methods: {
    onSelected() {
      this.$emit('selected');
    },
  },
};
</script>

<style lang="postcss">
.selectable-item {
  display: flex;
  padding: 10px 22px 10px 15px;
  font-size: 13px;
  line-height: 18px;
  color: #323233;
  background: #fff;

  &--checked {
    color: #00b389;

    .van-icon {
      vertical-align: -2px;
    }
  }

  &__label {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__status {
    flex: 0 0 auto;
    color: #d40;
  }

  &__check {
    margin-left: 12px;

    .hidden {
      visibility: hidden;
    }
  }
}
</style>
