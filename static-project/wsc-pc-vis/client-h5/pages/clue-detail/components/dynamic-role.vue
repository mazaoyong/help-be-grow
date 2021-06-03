<template>
  <dynamic-item-container class="dynamic-source">
    <div class="intro">
      <span class="name">
        {{ operatorName }}
        {{ parsedOperatorSchoolName }}
      </span>
      <span class="action">变更角色</span>
      <span class="time">{{ operateTime | formatTime }}</span>
    </div>
    <div class="content">
      <div
        v-if="afterRole"
        class="attribute-item"
      >
        <span class="key">变更后：</span>
        <span class="value">{{ afterRole | formatRole }}</span>
      </div>
      <div
        v-if="beforeRole"
        class="attribute-item attribute-item_gray"
      >
        <span class="key">变更前：</span>
        <span class="value">{{ beforeRole | formatRole }}</span>
      </div>
      <div
        v-if="scene"
        class="attribute-item"
      >
        <span class="key">变更原因：</span>
        <span class="value">{{ scene | formatScene }}</span>
      </div>
    </div>
  </dynamic-item-container>
</template>

<script>
import { format } from 'date-fns';
import { isEduSingleStore } from '@youzan/utils-shop';
import dynamicItemContainer from './dynamic-item-container.vue';

export default {
  name: 'dynamic-role',
  components: {
    'dynamic-item-container': dynamicItemContainer,
  },
  filters: {
    formatTime(time) {
      return format(time, 'HH:mm:ss');
    },
    formatRole(role) {
      const ROLE_MAP = {
        1: '学员',
        2: '教师',
        3: '管理员',
        // 线索使用
        4: '线索',
        5: '潜在客户',
      };
      return ROLE_MAP[role] || '-';
    },
    formatScene(scene) {
      const SCENE_MAP = {
        manualChange: '手动转化',
        offlineSign: '员工办理报名',
        signFormal: '用户报名正式课',
        collectZan: '好友助力',
        poster: '公众号海报',
        gift: '通用赠品活动',
      };
      return SCENE_MAP[scene] || '-';
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
    beforeRole: {
      type: Number,
      default: 0,
    },
    afterRole: {
      type: Number,
      default: 0,
    },
    scene: {
      type: String,
      default: '',
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
