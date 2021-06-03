<template>
  <vis-popup-confirm
    :value="value"
    :is-show-cancel-btn="false"
    :title="detailTitle"
    confirm-btn-text="我知道了"
    class="student-status-container"
    v-on="proxyListeners"
  >
    <div class="student-status-detail">
      <div
        v-for="(item, index) in detailList"
        :key="index"
        class="student-status-detail__item"
      >
        <p class="student-status-detail__item-name">
          {{ item.name }}
        </p>
        <vis-tool-tip
          v-if="item.extraReason"
          container-selector=".student-status-container .vis-standard-popup__content"
        >
          <div class="student-status-detail__item-reason">
            <p class="item-reason__title">
              原因：
            </p>
            <p class="item-reason__detail">
              {{ item.reason }}
            </p>
            <van-icon
              name="question"
              class="item-reason__detail-icon"
            />
          </div>
          <div
            slot="content"
            class="student-status-detail__item-extra"
          >
            {{ item.extraReason }}
          </div>
        </vis-tool-tip>

        <div
          v-if="!item.extraReason"
          class="student-status-detail__item-reason"
        >
          <p class="item-reason__title">
            原因：
          </p>
          <p class="item-reason__detail">
            {{ item.reason }}
          </p>
        </div>
      </div>
    </div>
  </vis-popup-confirm>
</template>

<script>
import { Icon } from 'vant';
import { PopupConfirm } from '@youzan/vis-ui';
import Tooltip from '../../tooltip';

export default {
  components: {
    'vis-popup-confirm': PopupConfirm,
    'vis-tool-tip': Tooltip,
    'van-icon': Icon,
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

    },
  },
};
</script>

<style lang="scss">
  .student-status-detail {
    &__item {
      display: flex;
      align-items: center;
      position: relative;
      height: 44px;
      font-size: 14px;
      line-height: 20px;
      color: #323233;
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
        border: 0 solid #d8d8d8;
        border-bottom-width: 1px;
      }

      &-name {
        font-weight: bold;
      }

      &-reason {
        display: flex;
        align-items: center;

        .item-reason {
          &__title {
            color: #a0a1a3;
            word-break: keep-all;
          }

          &__detail {
            &-icon {
              margin-left: 8px;
              font-size: 13px;
              color: #a9a9a9;
            }
          }
        }
      }

      &-extra {
        color: #fff;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }

  .student-status-container {
    .vis-standard-popup__content {
      position: relative;
    }
  }
</style>
