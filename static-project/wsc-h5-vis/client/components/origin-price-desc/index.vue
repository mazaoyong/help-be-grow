<template>
  <div class="price-wrapper">
    <div class="price-title-wrapper">
      <div class="line" />
      <div class="title" @click="onExpand">
        价格说明
        <van-icon name="arrow" :class="isVisible ? 'expand': ''" />
      </div>
      <div class="line" />
    </div>
    <div v-if="isVisible" class="price-desc-wrapper">
      <p>
        <em>划线价格：</em>划线的价格可能是课程的非活动价、曾经展示过的销售价等，仅供您参考。
      </p>
      <p>
        <em>未划线价格：</em>未划线的价格是课程的销售标价，具体的成交价格可能因会员使用优惠券、积分等发生变化，最终以订单结算价格为准。
      </p>
      <p>*此说明仅当出现价格比较时有效。若课程针对划线价格进行了特殊说明，以特殊说明为准。</p>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
export default {

  components: {
    'van-icon': Icon,
  },
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    onExpand() {
      this.isVisible = !this.isVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
.price-wrapper {
  padding: 16px;
  background-color: white;
}

.price-title-wrapper {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1.29;
  color: #323233;

  .line {
    flex: 1;
    height: 1.5px;
    background: #ebedf0;
  }

  .title {
    padding: 0 12px;

    .van-icon-arrow {
      font-size: 12px;
      color: #dcdee0;
      transform: rotate(90deg);
      transition: 0.3s all;
      vertical-align: middle;

      &.expand {
        transform: rotate(-90deg);
      }
    }
  }
}

.price-desc-wrapper {
  border-radius: 4px;
  background-color: #f7f8fa;
  margin-top: 20px;
  padding: 12px 8px;
  font-size: 12px;
  line-height: 1.33;
  color: #969799;

  p {
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  em {
    color: #323233;
  }
}
</style>
