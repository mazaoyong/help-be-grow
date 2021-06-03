<template>
  <div :class="getContainerClasses" :style="getPreservePadding">
    <template v-if="!task.empty">
      <rich-text :task-content="taskContent" />
      <div
        v-if="overView"
        class="punch-list__content over-view-button"
        @click="$emit('change-expand')"
      >
        <span>{{ overViewButtonText }}</span>
        <van-icon :name="overViewIconName" size="14" />
      </div>
    </template>
    <div v-else class="punch-list__content-empty">
      <img :src="NO_PUNCH" alt="没有设置打卡内容">
      暂未设置打卡内容
    </div>
  </div>
</template>
<script>
import getFullfillImage from '@youzan/utils/fullfillImage';
import { Icon } from 'vant';
import { get } from 'lodash';

import TaskContent from 'supv/punch/components/task-content';

const NO_PUNCH = getFullfillImage(
  'https://b.yzcdn.cn/cdn/no-punch.png',
  '!100x100.png'
);

export default {
  name: 'task-content',
  components: {
    'van-icon': Icon,
    'rich-text': TaskContent,
  },

  props: {
    task: {
      type: Object,
      default: () => ({}),
    },
    taskContent: {
      type: Array,
      default: () => ([]),
    },
    overView: {
      type: Boolean,
      default: false,
    },
    expand: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      NO_PUNCH,
    };
  },

  computed: {
    getContainerClasses() {
      return {
        'punch-list__content-container': true,
        'punch-list__content-collapse': this.overView && !this.expand,
      };
    },
    richText() {
      return get(this.task, 'richText.content', '');
    },
    audio() {
      return get(this.task, 'audio', {});
    },
    overViewButtonText() {
      return this.expand ? '收起' : '查看全文';
    },
    overViewIconName() {
      return this.expand ? 'arrow-up' : 'arrow-down';
    },
    // 设置预留高度
    getPreservePadding() {
      if (this.overView && this.expand) {
        return {
          paddingBottom: '89px',
        };
      }
      return undefined;
    },
  },
};
</script>
<style lang="scss">
.punch-list__content {
  &-container {
    min-height: 529px;
    padding: 20px;
    padding-top: 38px;
    box-sizing: border-box;
  }

  &.over-view-button {
    position: relative;
    margin: 10px auto 0;
    font-size: 14px;
    color: #00b389;
    text-align: center;

    .van-icon {
      font-weight: bold;
      vertical-align: middle;
    }
  }

  &-collapse {
    height: 529px;
    min-height: unset;
    overflow-y: hidden;
    box-sizing: border-box;

    .punch-list__content.over-view-button {
      position: absolute;
      bottom: 127px;
      left: 0;
      z-index: 1003;
      width: 100%;
    }
  }

  &-empty {
    display: flex;

    /* 这个高度是529 - 38 - 20 */
    min-height: 471px;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #999;

    img {
      width: 100px;
      height: 100px;
    }
  }
}
</style>
