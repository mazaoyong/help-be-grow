<template>
  <card
    v-if="Object.keys(dynamicStudentData).length > 0"
    class="student-info"
  >
    <div class="header">
      <div class="header-container">
        <div class="date">
          {{ date }} {{ week }}
        </div>
        <div class="detail">
          <span>
            {{ dynamicStudentData.operatorName }}
            {{ parsedOperatorSchoolName }}
          </span>
          <span>更新基本资料</span>
          <span>{{ dynamicStudentData.operateTime | formatTime }}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="after">
        <div class="text">更新后</div>
        <div class="attribute-box">
          <attribute-item
            v-for="(attribute, index) in dynamicStudentData.stuAfter"
            :key="index"
            :attributeKey="attribute.attributeKey"
            :attributeTitle="attribute.attributeTitle"
            :attributeValue="attribute.attributeValue"
          />
        </div>
      </div>
      <div class="before">
        <div class="text">更新前</div>
        <div class="attribute-box">
          <attribute-item
            v-for="(attribute, index) in dynamicStudentData.stuBefore"
            :key="index"
            type="before"
            :attributeKey="attribute.attributeKey"
            :attributeTitle="attribute.attributeTitle"
            :attributeValue="attribute.attributeValue"
          />
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import { format, getDay } from 'date-fns';
import { isEduSingleStore } from '@youzan/utils-shop';
import Card from 'components/card/index.vue';
import AttributeItem from './components/attribute-item.vue';

const weekArr = ['日', '一', '二', '三', '四', '五', '六'];

export default {
  name: 'student-info',
  components: {
    'card': Card,
    'attribute-item': AttributeItem,
  },
  computed: {
    parsedOperatorSchoolName() {
      if (this.dynamicStudentData.operatorSchoolName && !this.isEduSingleStore) {
        return `(${this.dynamicStudentData.operatorSchoolName})`;
      }
      return '';
    },
  },
  data() {
    return {
      dynamicStudentData: {},
      date: '',
      week: '',
      isEduSingleStore,
    };
  },
  created() {
    this.dynamicStudentData = this.$store.getters['clueDetailModule/dynamicStudentData'] || {};
    this.date = format(this.dynamicStudentData.operateTime, 'YYYY-MM-DD');
    this.week = `星期${weekArr[getDay(this.dynamicStudentData.operateTime)]}`;
  },
  filters: {
    formatTime(time) {
      return format(time, 'HH:mm');
    },
  },
};
</script>

<style lang="scss" scoped>
.student-info {
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
     padding: 15px 15px 0;
      .after, .before {
        padding: 20px 0;
        border-bottom: 1px solid #f2f2f2;
        .text {
          margin-bottom: 20px;
          padding-left: 7px;
          border-left: 1px solid #00b389;
        }
      }
      .before {
        .text {
          color: #646566;
          border-left: 1px solid #969799;
        }
      }
  }
}
</style>
