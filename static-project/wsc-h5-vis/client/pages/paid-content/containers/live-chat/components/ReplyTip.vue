<template>
  <div
    v-if="value"
    class="reply-tip">
    <p class="reply-tip__text">
      <span class="reply-tip__reply">
        回复：
      </span>
      <span>{{ content }}</span>
    </p>
    <div
      class="reply-tip__close-icon"
      @click="close"
    />
  </div>
</template>

<script>
import get from 'lodash/get';

export default {
  name: 'reply-tip',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    item: Object,
  },

  data() {
    return {

    };
  },

  computed: {
    content() {
      return get(this, 'item.fromMsg.content');
    },
  },

  methods: {
    close() {
      this.$emit('input', false);
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
  .reply-tip {
    position: fixed;
    width: 144px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .12);
    box-sizing: border-box;
    padding-left: 9px;
    bottom: 87px;
    font-size: 12px;
    left: 15px;
    z-index: 3000;
    background-color: #fff;

    &__text {
      width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__reply {
      color: #4b0;
    }

    &__close-icon {
      width: 20px;
      height: 20px;
      position: absolute;
      right: 5px;
      top: 5px;
      background-image: url(data:image/png;base64,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);
      background-size: cover;
    }
  }
</style>
