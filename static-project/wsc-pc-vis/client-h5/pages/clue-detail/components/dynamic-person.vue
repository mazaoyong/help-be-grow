<template>
  <dynamic-item-container class="dynamic-person">
    <div class="intro">
      <span class="name">
        {{ operatorName }}
        {{ parsedOperatorSchoolName }}
      </span>
      <span class="action">变更课程顾问</span>
      <span class="time">{{ operateTime | formatTime }}</span>
    </div>
    <div class="content">
      <div
        v-if="afterOwner[0]"
        class="attribute-item"
      >
        <span class="key">变更后：</span>
        <span class="value">{{ afterOwner[0].name }} {{ afterOwner[0].telephone }}</span>
      </div>
      <div
        v-if="beforeOwner[0]"
        class="attribute-item attribute-item_gray"
      >
        <span class="key">变更前：</span>
        <span class="value">{{ beforeOwner[0].name }} {{ beforeOwner[0].telephone }}</span>
      </div>
      <div
        v-if="reason"
        class="attribute-item"
      >
        <span class="key">变更原因：</span>
        <span class="value">{{ reason }}</span>
      </div>
    </div>
  </dynamic-item-container>
</template>

<script>
import { format } from 'date-fns';
import { isEduSingleStore } from '@youzan/utils-shop';
import dynamicItemContainer from './dynamic-item-container.vue';

export default {
  name: 'dynamic-person',
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
    beforeOwner: {
      type: Array,
      default: () => {
        return [];
      },
    },
    afterOwner: {
      type: Array,
      default: () => {
        return [];
      },
    },
    reason: {
      type: String,
      default: '',
    },
  },
  computed: {
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
.dynamic-person {
  .intro {
    // height: 18px;
    line-height: 25px;
    font-size: 13px;
    color: #646566;
    .name, .action {
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
    }
  }
}
</style>
