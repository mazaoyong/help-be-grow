<template>
  <vis-popup-confirm
    :value="value"
    :is-show-cancel-btn="false"
    :title="summaryTitle"
    confirm-btn-text="我知道了"
    v-on="proxyListeners"
    @confirm="onConfirm"
  >
    <div class="student-status-summary">
      <div
        class="student-status-summary__item"
        @click="onCheckFailReason"
      >
        <div class="student-status-summary__item-circle" />
        <p class="student-status-summary__item-text">
          查看失败原因
        </p>
      </div>
    </div>
  </vis-popup-confirm>
</template>

<script>
import { PopupConfirm } from '@youzan/vis-ui';
import openDetail from '../detail';

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
    summaryTitle: {
      type: String,
      default: '',
    },
    detailTitle: {
      type: String,
      default: '',
    },
    detailList: {
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
    onCheckFailReason() {
      // 入参
      openDetail({
        props: {
          detailTitle: this.detailTitle,
          detailList: this.detailList,
        },
      });
    },
    onConfirm() {
      this.$emit('resolve');
    },
  },
};
</script>

<style lang="scss">
  .student-status-summary {
    &__item {
      display: flex;
      align-items: center;
      color: #323233;
      margin-bottom: 16px;
      padding-left: 16px;
      flex-wrap: wrap;

      &-circle {
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background-color: #00b389;
        margin-right: 8px;
        margin-left: -16px;
      }

      &-text {
        font-size: 16px;
        line-height: 22px;
        color: #00b389;
      }
    }
  }
</style>
