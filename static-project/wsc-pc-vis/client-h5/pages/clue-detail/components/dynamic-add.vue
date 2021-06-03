<template>
  <dynamic-item-container class="dynamic-add">
    <div class="intro">
      <span class="name">
        {{ operatorName ? operatorName : channel }}
        {{ parsedOperatorSchoolName }}
      </span>
      <span class="action">添加线索</span>
      <span class="time">{{ operateTime | formatTime }}</span>
    </div>
    <div class="content">
      <div class="attribute-item">
        <span class="key">添加方式：</span>
        <span class="value">{{ channel }}</span>
      </div>
      <div class="attribute-item">
        <span class="key">线索来源：</span>
        <span class="value">
          {{ source }}
          <a
            v-if="recordType === 7 || recordType === 12"
            class="watch-detail"
            href="javascript: void(0);"
            @click="onWatchDetail"
          >
            查看{{ recordType === 7 ? '报名' : '表单' }}详情
          </a>
          <span
            v-if="recordType === 8"
          >
            <span class="source-ext-info">意向体验时间：{{ attendTime | formatDay }}</span>
            <span class="source-ext-info">意向体验地点：{{ attendAddress }}</span>
          </span>
          <span
            v-if="recordType === 9 || recordType === 10"
          >
            <span class="source-ext-info">报名线下课：{{ courseName }}</span>
          </span>
        </span>
      </div>
      <div v-if="introduceName" class="attribute-item">
        <span class="key">介绍人：</span>
        <span class="value">{{ introduceName || '-' }}</span>
      </div>
      <div class="attribute-item">
        <span class="key">课程顾问：</span>
        <span class="value">{{ ownersText }}</span>
      </div>
    </div>
  </dynamic-item-container>
</template>

<script>
import { format } from 'date-fns';
import { isEduSingleStore } from '@youzan/utils-shop';
import dynamicItemContainer from './dynamic-item-container.vue';
import router from '../router.js';

export default {
  name: 'dynamic-add',
  components: {
    'dynamic-item-container': dynamicItemContainer,
  },
  filters: {
    formatTime(time) {
      return format(time, 'HH:mm:ss');
    },
    formatDay(time) {
      if (time) {
        return format(time, 'YYYY-MM-DD HH:mm');
      }
      return '-';
    },
  },
  props: {
    clueId: {
      type: Number,
      default: 0,
    },
    recordType: {
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
    channel: {
      type: String,
      default: '-',
    },
    source: {
      type: String,
      default: '-',
    },
    owners: {
      type: Array,
      default: () => {
        return [];
      },
    },
    regInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
    attendTime: {
      type: [String, Number],
      default: '',
    },
    attendAddress: {
      type: String,
      default: '-',
    },
    courseName: {
      type: String,
      default: '-',
    },
    introduceName: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      isEduSingleStore,
    };
  },
  computed: {
    ownersText() {
      let ownersText = '';
      if (this.owners.length > 0) {
        const len = this.owners.length;
        this.owners.map((owner, index) => {
          if (index === len - 1) {
            ownersText += owner.ownerName;
          } else {
            ownersText += `${owner.ownerName}、`;
          }
        });
      } else {
        ownersText = '-';
      }
      return ownersText;
    },
    parsedOperatorSchoolName() {
      if (this.operatorSchoolName && !this.isEduSingleStore) {
        return `(${this.operatorSchoolName})`;
      }
      return '';
    },
  },
  methods: {
    onWatchDetail() {
      this.$store.dispatch('clueDetailModule/setSignupDetailData', {
        regInfo: this.regInfo,
      });
      router.push({ name: 'signup-detail', query: { clueId: this.clueId } });
    },
  },
};
</script>

<style lang="scss" scoped>
.dynamic-add {
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
      .watch-detail {
        display: block;
        margin-left: 65px;
        line-height: 25px;
        font-size: 13px;
        color: #00b389;
      }
      .source-ext-info {
        display: block;
        margin-left: 65px;
        line-height: 25px;
        color: #969799;
      }
    }
  }
}
</style>
