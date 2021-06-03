<template>
  <vis-popup-confirm
    :value="value"
    :is-show-cancel-btn="false"
    title="以下学员签到后生效"
    confirm-btn-text="我知道了"
    v-on="proxyListeners"
  >
    <div class="check-v-student-list">
      <div
        v-for="(item, index) in studentNames"
        :key="index"
        class="check-v-student-list__item"
      >
        {{ index + 1 }}. {{ item }}
      </div>
    </div>
  </vis-popup-confirm>
</template>

<script>
import { PopupConfirm } from '@youzan/vis-ui';

export default {
  components: {
    'vis-popup-confirm': PopupConfirm,
  },

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    proxyListeners: {
      type: Object,
      default: () => ({}),
    },
    studentNames: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
    };
  },

  computed: {
  },

  methods: {
  },
};
</script>

<style lang="scss">
  .check-v-student-list {
    &__item {
      height: 44px;
      line-height: 44px;
      font-weight: bold;
      position: relative;

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
        border: 0 solid #f2f3f5;
        border-bottom-width: 1px;
      }
    }
  }
</style>
