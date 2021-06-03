<template>
  <div class="order-select-item">
    <span class="select-radio">
      <van-radio :name="data.orderNo" :disabled="!data.selectable" checked-color="#00B389" />
    </span>
    <div class="course-name">{{ data.lessonName }}</div>
    <ul class="data-items">
      <li class="item">
        <span class="label">订单金额</span>
        <span class="value">￥{{ formattedTotalPay }}</span>
      </li>
      <li class="item">
        <span class="label">下单时间</span>
        <span class="value">{{ formattedBookTime }}</span>
      </li>
      <div class="fold" v-show="!fold">
        <li class="item">
          <span class="label">学员</span>
          <span class="value">{{ data.studentName || '-' }}</span>
        </li>
        <li class="item">
          <span class="label">客户</span>
          <span class="value">{{ data.buyerName }}</span>
        </li>
        <li class="item">
          <span class="label">订单编号</span>
          <span class="value">{{ data.orderNo }}</span>
        </li>
      </div>
    </ul>
    <div class="fold-handle">
      <a href="javascript:;" @click="fold = !fold">
        更多信息
        <van-icon :name="fold ? 'arrow-down' : 'arrow-up'" />
      </a>
    </div>
    <div class="unselectable-info" v-if="!data.selectable">
      <span>
        <van-icon name="warning-o" size="16px" color="#F1924E" />
        {{ `${data.unSelectableReason}不可选` }}
      </span>
    </div>
  </div>
</template>

<script>
import { Radio, Icon } from 'vant';
import format from '@youzan/utils/money/format';
import formatDate from '@youzan/utils/date/formatDate';
export default {
  name: 'order-item',
  components: {
    'van-radio': Radio,
    'van-icon': Icon,
  },
  props: {
    data: Object,
  },
  data() {
    return {
      fold: true,
    };
  },
  computed: {
    formattedTotalPay() {
      return format(this.data.totalPay);
    },
    formattedBookTime() {
      return formatDate(this.data.bookTime, 'YYYY-MM-DD HH:mm:ss');
    },
  },
};
</script>

<style lang="postcss" scoped>
.order-select-item {
  position: relative;
  background-color: white;
  border-radius: 4px;
  margin-top: 10px;
  padding: 10px 10px 10px 45px;
  z-index: 1;

  .select-radio {
    position: absolute;
    left: 15px;
    top: 10px;
  }

  .course-name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  ul {
    font-size: 13px;

    .label {
      display: inline-block;
      margin-right: 20px;
      white-space: nowrap;
      color: #969799;
      width: 4em;
    }

    li {
      line-height: 28px;
    }
  }

  .fold-handle {
    line-height: 28px;

    a {
      color: #00b389;
      font-size: 13px;
    }
  }

  .unselectable-info {
    margin-top: 5px;

    & > span {
      display: inline-block;
      height: 34px;
      font-size: 13px;
      padding: 0 15px;
      line-height: 34px;
      border-radius: 17px;
      background-color: #f7f8fa;
    }

    .van-icon {
      vertical-align: -3px;
    }
  }
}
</style>
