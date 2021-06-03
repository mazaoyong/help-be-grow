<template>
  <card
    v-if="Object.keys(dynamicTagData).length > 0"
    class="clue-tag"
  >
    <div class="header">
      <div class="header-container">
        <div class="date">
          {{ date }} {{ week }}
        </div>
        <div class="detail">
          <span>
            {{ dynamicTagData.operatorName }}
            {{ parsedOperatorSchoolName }}
          </span>
          <span>添加跟进记录</span>
          <span>{{ dynamicTagData.operateTime | formatTime }}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div
        v-if="dynamicTagData.addTags.length > 0"
        class="tag-box tag-box_add"
      >
        <div class="text">新增标签：</div>
        <van-tag
          v-for="(tag, index) in dynamicTagData.addTags"
          :key="index"
          color="#323233"
          plain
        >
          {{ tag.name }}
        </van-tag>
      </div>
      <div
        v-if="dynamicTagData.delTags.length > 0"
        class="tag-box tag-box_delete"
      >
        <div class="text">删除标签：</div>
        <van-tag
          v-for="(tag, index) in dynamicTagData.delTags"
          :key="index"
          plain
        >
          {{ tag.name }}
        </van-tag>
      </div>
    </div>
  </card>
</template>

<script>
import { Tag } from 'vant';
import { isEduSingleStore } from '@youzan/utils-shop';
import { format, getDay } from 'date-fns';
import Card from 'components/card/index.vue';

const weekArr = ['日', '一', '二', '三', '四', '五', '六'];

export default {
  name: 'clue-tag',
  components: {
    'card': Card,
    'van-tag': Tag,
  },
  computed: {
    parsedOperatorSchoolName() {
      if (this.dynamicTagData.operatorSchoolName && !this.isEduSingleStore) {
        return `(${this.dynamicTagData.operatorSchoolName})`;
      }
      return '';
    },
  },
  data() {
    return {
      dynamicTagData: {},
      date: '',
      week: '',
      isEduSingleStore,
    };
  },
  created() {
    this.dynamicTagData = this.$store.getters['clueDetailModule/dynamicTagData'] || {};
    this.date = format(this.dynamicTagData.operateTime, 'YYYY-MM-DD');
    this.week = `星期${weekArr[getDay(this.dynamicTagData.operateTime)]}`;
  },
  filters: {
    formatTime(time) {
      return format(time, 'HH:mm');
    },
  },
};
</script>

<style lang="scss" scoped>
.clue-tag {
  .header {
    padding-top: 15px;
    height: 72px;
    border-bottom: 1px solid #f2f2f2;
    &-container {
      padding: 0 15px;
    }
    .date {
      margin: 0 0 5px;
      line-height: 20px;
      font-size: 14px;
      color: #323233;
    }
    .detail {
      line-height: 20px;
      font-size: 12px;
      color: #646566;
      &>span {
        margin-right: 5px;
      }
    }
  }
  .content {
    padding: 15px 15px 5px;
    .tag-box {
      margin-bottom: 15px;
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
