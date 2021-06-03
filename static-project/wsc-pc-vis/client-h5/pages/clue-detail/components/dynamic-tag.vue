<template>
  <dynamic-item-container class="dynamic-tag">
    <div class="intro">
      <span class="name">
        {{ operatorName }}
        {{ parsedOperatorSchoolName }}
      </span>
      <span class="action">更新标签</span>
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
      <div
        v-if="addTags.length > 0"
        class="tag-box tag-box_add"
      >
        <div class="text">新增标签：</div>
        <van-tag
          v-for="(tag, index) in addTags"
          :key="index"
          color="#323233"
          plain
        >
          {{ tag.name }}
        </van-tag>
      </div>
      <div
        v-if="delTags.length > 0"
        class="tag-box tag-box_delete"
      >
        <div class="text">删除标签：</div>
        <van-tag
          v-for="(tag, index) in delTags"
          :key="index"
          plain
        >
          {{ tag.name }}
        </van-tag>
      </div>
    </div>
  </dynamic-item-container>
</template>

<script>
import { format } from 'date-fns';
import { Tag } from 'vant';
import { isEduSingleStore } from '@youzan/utils-shop';
import dynamicItemContainer from './dynamic-item-container.vue';
import router from '../router.js';

export default {
  name: 'dynamic-tag',
  components: {
    'van-tag': Tag,
    'dynamic-item-container': dynamicItemContainer,
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
    beforeTags: {
      type: Array,
      default: () => {
        return [];
      },
    },
    afterTags: {
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
      addTags: this.parseAddTags(),
      delTags: this.parseDelTags(),
      isEduSingleStore,
    };
  },
  methods: {
    parseAddTags() {
      let arr = [];
      const afterTags = this.afterTags;
      const beforeTags = this.beforeTags;
      afterTags.map(tag => {
        if (beforeTags.indexOf(tag) === -1) {
          arr.push(tag);
        }
      });

      return arr;
    },
    parseDelTags() {
      let arr = [];
      const afterTags = this.afterTags;
      const beforeTags = this.beforeTags;
      beforeTags.map(tag => {
        if (afterTags.indexOf(tag) === -1) {
          arr.push(tag);
        }
      });

      return arr;
    },
    onWatchMore() {
      this.$store.dispatch('clueDetailModule/updateDynamicTagData', {
        operatorName: this.operatorName,
        operateTime: this.operateTime,
        operatorSchoolName: this.operatorSchoolName,
        addTags: this.addTags,
        delTags: this.delTags,
      });
      router.push({ name: 'clue-tag', query: { clueId: this.clueId } });
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
.dynamic-tag{
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
    .tag-box {
      margin-bottom: 15px;
      max-height: 75px;
      overflow: hidden;
      .text {
        margin-bottom: 5px;
        line-height: 18px;
        font-size: 13px;
      }
      .van-tag {
        margin:  0 8px 8px 0;
        height: 18px;
        line-height: 18px;
        padding: 0 4px;
        font-size: 12px;
        color: #646566 !important;
      }
      &_add {
        .text {
          color: #323233;
        }
      }
      &_delete {
        .text {
          color: #646566;
        }
      }
    }
  }
}
</style>
