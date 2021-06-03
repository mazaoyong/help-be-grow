<template>
  <div class="change-detail">
    <detail-top
      :change-unit="getUnit"
      :change-data="getChangeData"
      :change-content="getChangeContent"
    />
    <detail-bottom
      :validity="validity"
      :old-class="oldClassName"
      :remark="getRemark"
      :change-time="getChangeTime"
      :course-detail="courseChange"
      :operator="getOperator"
      :new-class-validity="newClassValidity"
      :old-class-validity="oldClassValidity"
    />
  </div>
</template>

<script>
import get from 'lodash/get';
import DetailTop from './components/detail-top';
import DetailBottom from './components/detail-bottom';
import formatDate from '@youzan/utils/date/formatDate';
import { OPERATION_TYPE } from '@/constants/course/operation-type';

export default {
  name: 'change-detail',

  components: {
    DetailTop,
    DetailBottom,
  },

  data() {
    return {
      index: parseInt(this.$route.params.index),
      operationType: parseInt(this.$route.params.operationType),
    };
  },

  computed: {
    // 获取数据
    detailData() {
      return this.$store.state.list[this.index];
    },
    operationValueInfo() {
      return get(this.detailData, 'operationValueInfo', {});
    },
    operationClassInfo() {
      return get(this.detailData, 'operationClassInfo', {});
    },
    operationValidityInfo() {
      return get(this.detailData, 'operationValidityInfo', {});
    },
    // 变更内容
    getChangeContent() {
      return get(this.detailData, 'changeContent', '');
    },
    // 备注
    getRemark() {
      return get(this.detailData, 'remark', []);
    },
    // 操作人
    getOperator() {
      return get(this.detailData, 'operator', []);
    },

    getUnit() {
      if (this.operationType === OPERATION_TYPE.COURSE) {
        return '课时';
      }
      if (this.operationType === OPERATION_TYPE.VALIDITY) {
        const unit = get(this.operationValidityInfo, 'unit', 0);
        if (unit === 1) return '天';
        else if (unit === 2) return '周';
        else if (unit === 3) return '月';
        else if (unit === 4) return '年';
        else return '';
      }
      return '';
    },
    getChangeTime() {
      const eventTime = get(this.detailData, 'eventTime', 0);
      return formatDate(eventTime, 'YYYY-MM-DD HH:mm:ss');
    },
    getChangeType() {
      const changeType = get(this.detailData, 'changeType', 0);
      if (changeType === 1) {
        return '+';
      }
      if (changeType === 2) {
        return '-';
      } else return '';
    },
    getChangeData() {
      if (this.operationType === OPERATION_TYPE.CLASS) {
        return `${get(this.operationClassInfo.newClassInfo, 'className', '')}`;
      }
      if (this.operationType === OPERATION_TYPE.COURSE) {
        const rewardAssetChangeAmount = get(this.operationValueInfo, 'rewardAssetChangeAmount', 0);
        const mainAssetChangeAmount = get(this.operationValueInfo, 'mainAssetChangeAmount', 0);
        const changeAmount = (mainAssetChangeAmount + rewardAssetChangeAmount) / 100;
        return changeAmount ? `${this.getChangeType + changeAmount}` : '';
      }
      if (this.operationType === OPERATION_TYPE.VALIDITY) {
        const quantity = get(this.operationValidityInfo, 'quantity', 0);
        return quantity ? `${this.getChangeType + quantity}` : '';
      }
      return '';
    },

    newClassValidity() {
      if (this.operationType === OPERATION_TYPE.CLASS) {
        const validity = get(this.operationClassInfo.newClassInfo, 'validity', '');
        return validity || '';
      }
      return '';
    },
    oldClassName() {
      if (this.operationType === OPERATION_TYPE.CLASS) {
        const className = get(this.operationClassInfo, 'oldClassInfo.className', '');
        return className || '-';
      }
      return '';
    },
    oldClassValidity() {
      if (this.operationType === OPERATION_TYPE.CLASS) {
        const validity = get(this.operationClassInfo.oldClassInfo, 'validity', '');
        return validity || '';
      }
      return '';
    },
    validity() {
      return this.operationType === OPERATION_TYPE.VALIDITY ? get(this.operationValidityInfo, 'validity', '') : '';
    },
    courseChange() {
      if (this.operationType === OPERATION_TYPE.COURSE) {
        let assetRemaining = get(this.operationValueInfo, 'assetRemaining', 0);
        let assetAmount = get(this.operationValueInfo, 'assetAmount', 0);
        if (assetRemaining < 0 && assetAmount >= 0) return `剩余-/共${assetAmount / 100}`;
        if (assetAmount < 0 && assetRemaining >= 0) return `剩余${assetRemaining / 100}/共-`;
        if (assetRemaining < 0 && assetAmount < 0) return `剩余-/共-`;
        return `剩余${assetRemaining / 100}/共${assetAmount / 100}`;
      }
      return '';
    },
  },

  mounted() {
    // 单个课程变更详情页刷新跳转到上一页面
    if (!this.detailData) {
      this.$router.back();
    }
  },
};
</script>
