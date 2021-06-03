<template>
  <van-action-sheet
    v-model="displayValue"
    :actions="actions"
    cancel-text="取消"
  />
</template>

<script>
import { ActionSheet } from 'vant';
import popupMixins from '../mixins/popup';

export default {
  name: 'mute-action',

  components: {
    'van-action-sheet': ActionSheet,
  },

  mixins: [popupMixins],

  props: {
    isMuted: {
      type: Boolean,
      default: false,
    },
    isLecturer: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
    };
  },

  computed: {
    actions() {
      if (this.isMuted) {
        return [
          {
            name: '该学员已禁言',
          },
          {
            name: '删除消息',
            callback: this.callback.bind(this, 1),
          },
        ];
      }

      if (this.isLecturer) {
        return [
          {
            name: '删除消息',
            callback: this.callback.bind(this, 1),
          },
        ];
      } else {
        return [
          {
            name: '仅删除消息',
            callback: this.callback.bind(this, 1),
          },
          {
            name: '删除消息并禁言',
            className: 'mute-action__mute',
            callback: this.callback.bind(this, 2),
          },
        ];
      }
    },
  },

  methods: {
    callback(type) {
      this.$emit('click', type);
      this.closePopup();
    },
  },
};
</script>

<style lang="scss">
  .mute-action {
    &__mute {
      color: red;
    }
  }
</style>
