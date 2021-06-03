<template>
  <dynamic-item-container class="dynamic-source">
    <div class="intro">
      <span class="name">
        {{ operatorName }}
        {{ parsedOperatorSchoolName }}
      </span>
      <span class="action">更新来源</span>
      <span class="time">{{ operateTime | formatTime }}</span>
    </div>
    <div class="content">
      <div
        v-if="afterSource"
        class="attribute-item"
      >
        <span class="key">变更后：</span>
        <span class="value">{{ afterSource.groupName }}-{{ afterSource.name }}</span>
      </div>
      <div
        v-if="beforeSource"
        class="attribute-item attribute-item_gray"
      >
        <span class="key">变更前：</span>
        <span class="value">{{ beforeSource.groupName }}-{{ beforeSource.name }}</span>
      </div>
    </div>
  </dynamic-item-container>
</template>

<script>
import { format } from 'date-fns';
import { isEduSingleStore } from '@youzan/utils-shop';
import dynamicItemContainer from './dynamic-item-container.vue';

export default {
  name: 'dynamic-source',
  components: {
    'dynamic-item-container': dynamicItemContainer,
  },
  filters: {
    formatTime(time) {
      return format(time, 'HH:mm:ss');
    },
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
    beforeSource: {
      type: Object,
      default: () => {
        return {};
      },
    },
    afterSource: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isEduSingleStore,
    };
  },
  computed: {
    parsedOperatorSchoolName() {
      if (this.operatorSchoolName && !this.isEduSingleStore) {
        return `(${this.operatorSchoolName})`;
      }
      return '';
    },
  },
};
</script>

<style lang="scss" scoped>
.dynamic-source {
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
