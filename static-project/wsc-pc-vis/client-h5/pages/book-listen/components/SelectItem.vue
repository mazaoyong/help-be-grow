<template>
  <div class="select-item-wrap" @click="onSelected">
    <span :class="['select-item-wrap__name', isChecked ? 'checked' : '']">
      {{ name }}
    </span>
    <van-icon
      v-if="isChecked"
      name="success"
      size="14px"
      color="#00b987"
    />
  </div>
</template>

<script>
import { Icon } from 'vant';

export default {
  name: 'select-item',

  components: {
    'van-icon': Icon,
  },

  props: {
    name: {
      type: String,
      default: '',
    },

    id: {
      type: Number,
      default: 0,
    },

    selectedId: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    isChecked() {
      return this.id === this.selectedId;
    },
  },

  methods: {
    onSelected() {
      this.$emit('selected', this.id);
    },
  },
};
</script>

<style lang="postcss">
  .select-item-wrap {
    display: flex;
    justify-content: space-between;
    height: 38px;
    line-height: 38px;
    padding: 0 15px;

    &__name {
      padding-right: 15px;
      font-size: 13px;
      color: #323233;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.checked {
        color: #00b987;
      }
    }

    .van-icon {
      line-height: 38px;
    }
  }
</style>
