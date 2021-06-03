<template>
  <dynamic-item-container class="dynamic-student">
    <div class="intro">
      <span class="name">
        {{ operatorName }}
        {{ parsedOperatorSchoolName }}
      </span>
      <span class="action">更新基本资料</span>
      <span class="time">{{ operateTime | formatTime }}</span>
      <a
        class="more"
        href="javascript: void(0);"
        @click="onWatchMore"
      >
        更多
      </a>
    </div>
    <div class="content">
      <div class="status">变更后</div>
      <dynamic-student-attribute-item
        v-for="(attribute, index) in stuAfter"
        :key="index"
        :attributeKey="attribute.attributeKey"
        :attributeTitle="attribute.attributeTitle"
        :attributeValue="attribute.attributeValue"
      />
    </div>
  </dynamic-item-container>
</template>

<script>
import { format } from 'date-fns';
import { isEduSingleStore } from '@youzan/utils-shop';
import dynamicItemContainer from './dynamic-item-container.vue';
import dynamicStudentAttributeItem from './dynamic-student-attribute-item';
import router from '../router.js';

export default {
  name: 'dynamic-student',
  components: {
    'dynamic-item-container': dynamicItemContainer,
    'dynamic-student-attribute-item': dynamicStudentAttributeItem,
  },
  props: {
    clueId: {
      type: Number,
      default: 0,
    },
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
    stuBefore: {
      type: Array,
      default: () => {
        return [];
      },
    },
    stuAfter: {
      type: Array,
      default: () => {
        return [];
      },
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
  methods: {
    onWatchMore() {
      this.$store.dispatch('clueDetailModule/updateDynamicStudentData', {
        operatorName: this.operatorName,
        operateTime: this.operateTime,
        operatorSchoolName: this.operatorSchoolName,
        stuBefore: this.stuBefore,
        stuAfter: this.stuAfter,
      });
      router.push({ name: 'student-info', query: { clueId: this.clueId } });
    },
  },
  filters: {
    formatTime(time) {
      return format(time, 'HH:mm:ss');
    },
  },
};
</script>

<style lang="scss" scoped>
.dynamic-student {
  .intro {
    position: relative;
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
    .more {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .content {
    padding: 15px 0 20px;
    .status, .attribute-item {
      margin-bottom: 10px;
      line-height: 18px;
      font-size: 13px;
      color: #323233;
    }
    .watch-avatar {
      color: #00b389;
    }
  }
}
</style>
