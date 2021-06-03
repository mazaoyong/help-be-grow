<template>
  <dynamic-item-container class="dynamic-stage">
    <div class="intro">
      <span class="name">
        {{ operatorName }}
        {{ parsedOperatorSchoolName }}
      </span>
      <span class="action">更新阶段</span>
      <span class="time">{{ operateTime | formatTime }}</span>
    </div>
    <div class="content">
      <div class="attribute-item">
        <span class="key">变更后：</span>
        <span class="value">{{ phaseAfterText }}</span>
      </div>
      <div class="attribute-item attribute-item_gray">
        <span class="key">变更前：</span>
        <span class="value">{{ phaseBeforeText }}</span>
      </div>
      <div class="attribute-item attribute-item_order-no" v-if="!!relatedOrderNo">
        <span class="key">成交订单：</span>
        <span class="value">{{ relatedOrderNo }}</span>
      </div>
    </div>
  </dynamic-item-container>
</template>

<script>
import { format } from 'date-fns';
import { isEduSingleStore } from '@youzan/utils-shop';
import dynamicItemContainer from './dynamic-item-container.vue';

// 2.待跟进 3.待邀约 4待试听 5 已试听 6 已成交 7 已放弃 8 已删除
const statusArr = ['', '', '待跟进', '待邀约', '待试听', '已试听', '已成交', '已放弃', '已删除'];

export default {
  name: 'dynamic-stage',
  components: {
    'dynamic-item-container': dynamicItemContainer,
  },
  props: {
    operatorName: {
      type: String,
      default: '',
    },
    operateTime: {
      type: Number,
      default: 0,
    },
    operatorSchoolName: {
      type: String,
      default: '',
    },
    phaseBefore: {
      type: Number,
      default: 0,
    },
    phaseAfter: {
      type: Number,
      default: 0,
    },
    relatedOrderNo: {
      type: String,
      default: null,
    },
  },
  computed: {
    phaseBeforeText() {
      return statusArr[this.phaseBefore];
    },
    phaseAfterText() {
      return statusArr[this.phaseAfter];
    },
    parsedOperatorSchoolName() {
      if (this.operatorSchoolName && !this.isEduSingleStore) {
        return `(${this.operatorSchoolName})`;
      }
      return '';
    },
  },
  data() {
    return {
      isEduSingleStore,
    };
  },
  filters: {
    formatTime(time) {
      return format(time, 'HH:mm:ss');
    },
  },
};
</script>

<style lang="scss" scoped>
.dynamic-stage {
  .intro {
    // height: 18px;
    line-height: 25px;
    font-size: 13px;
    color: #646566;
    .name,
    .action {
      margin-right: 10px;
    }
    .name {
      display: block;
    }
  }
  .content {
    padding: 15px 0 20px;
    .attribute-item {
      margin-bottom: 10px;
      line-height: 18px;
      font-size: 13px;
      color: #323233;
      &_gray {
        color: #646566;
      }
      &_order-no {
        color: #969799;
      }
    }
  }
}
</style>
