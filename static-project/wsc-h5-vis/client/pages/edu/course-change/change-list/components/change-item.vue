<template>
  <div
    class="change-item"
  >
    <div class="change-item__left">
      <div class="change-item__left-title van-ellipsis">
        {{ item.changeContent }}
      </div>
      <div
        v-if="operationType === 1"
        class="change-item__left-text"
      >
        {{ getAssetRemaining }}
      </div>
      <div
        v-if="operationType === 2"
        class="change-item__left-text"
      >
        有效期：{{ operationValidityInfo.validity }}
      </div>
      <div
        class="change-item__left-text"
      >
        {{ getChangeTime }}
      </div>
    </div>
    <div
      v-if="getChangeData || getUnit"
      :class="`change-item__right ${textOver} ${textGreen}`"
    >
      <span
        class="change-item__right-data"
      >
        {{ getChangeData }}
      </span>
      <span> {{ getUnit }}</span>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import Args from 'zan-utils/url/args';
import formatDate from '@youzan/utils/date/formatDate';
import { OPERATION_TYPE } from '@/constants/course/operation-type';

export default {
  name: 'change-item',

  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    operationType: {
      type: Number,
      default: 0,
    },
  },
  data: function() {
    return {
      assetNo: Args.get('assetNo'),
      operationClassInfo: this.item.operationClassInfo || {},
      operationValueInfo: this.item.operationValueInfo || {},
      operationValidityInfo: this.item.operationValidityInfo || {},
    };
  },
  computed: {
    getAssetRemaining() {
      const assetRemaining = get(this.operationValueInfo, 'assetRemaining', 0);
      return assetRemaining < 0 ? `剩余 - 课时` : `剩余 ${assetRemaining / 100} 课时`;
    },
    // 增加/减少/调班
    getChangeType() {
      const changeType = get(this.item, 'changeType', 0);
      if (changeType === 1) {
        return '+';
      }
      if (changeType === 2) {
        return '-';
      } else return '';
    },
    // 有效期变更单位天/月/季/年，课时变更单位课时
    getUnit() {
      if (this.operationType === OPERATION_TYPE.VALIDITY) {
        const unit = get(this.operationValidityInfo, 'unit', 0);
        if (unit === 1) return '天';
        else if (unit === 2) return '周';
        else if (unit === 3) return '月';
        else if (unit === 4) return '年';
        else return '';
      }
      if (this.operationType === OPERATION_TYPE.COURSE) {
        return '课时';
      }
      if (this.operationType === OPERATION_TYPE.CLASS) {
        return `${get(this.operationClassInfo, 'newClassInfo.className', '')}`;
      }
      return '';
    },
    getChangeTime() {
      return this.item.eventTime ? formatDate(this.item.eventTime, 'YYYY-MM-DD HH:mm:ss') : '';
    },
    getChangeData() {
      if (this.operationType === OPERATION_TYPE.VALIDITY) {
        const quantity = get(this.operationValidityInfo, 'quantity', 0);
        return quantity ? `${this.getChangeType + quantity}` : '';
      }
      if (this.operationType === OPERATION_TYPE.COURSE) {
        // 课时变更总数为赠送课时变更+购买课时变更
        const mainAssetChangeAmount = get(this.operationValueInfo, 'mainAssetChangeAmount', 0);
        const rewardAssetChangeAmount = get(this.operationValueInfo, 'rewardAssetChangeAmount', 0);
        const changeAmount = (mainAssetChangeAmount + rewardAssetChangeAmount) / 100;
        return changeAmount ? `${this.getChangeType + changeAmount}` : '';
      }
      return '';
    },
    // 有效期/课时变更增加的情况
    textGreen() {
      return this.operationType !== OPERATION_TYPE.CLASS && get(this.item, 'changeType', 0) === 1 ? 'text-green' : '';
    },
    // 班级变更名称过长省略号代替
    textOver() {
      return this.operationType === OPERATION_TYPE.CLASS ? 'text-over' : '';
    },
  },
};
</script>

<style lang="scss" scoped>
  .change-item {
    padding: 16px;
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: space-between;
    border-top: 1px solid #f2f2f2;
    border-bottom: 1px solid #f2f2f2;
    &__left {
      &-title {
        width: 160px;
        font-size: 14px;
        color: #323233;
        line-height: 20px;
        margin-bottom: 10px;
      }
      &-text {
        margin-top: 4px;
        font-size: 12px;
        color: #969799;
        line-height: 16px;
      }
    }
    &__right {
      font-size: 12px;
      text-align: right;
      display: inline-block;
      &-data {
      font-family: Avenir;
        font-size: 24px;
        font-weight: bold;
      }
    }
    .text-green {
      color: #03C160;
    }
    .text-over {
      width: 172px;
      text-align: right;
      font-size: 18px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: bold;
    }
  }
</style>
