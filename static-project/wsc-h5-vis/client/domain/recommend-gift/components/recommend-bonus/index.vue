<template>
  <div class="invite-bonus">
    <div class="invite-tip">
      每邀请一位好友下单你{{ multiSku ? '最高' : '' }}获得
    </div>
    <div class="invite-profit">
      <span class="symbol">￥</span>
      <span class="amount">{{ mainPrice | format('') }}</span>
    </div>
    <div class="friend-tip">
      <span class="tip-text">好友{{ multiSku ? '最高' : '' }}立减</span>
      <span class="tip-amount">￥{{ subPrice | format('') }}</span>
    </div>
  </div>
</template>

<script>
import format from '@youzan/utils/money/format';
/* 展示推荐有奖奖金信息 */
export default {
  filters: {
    format,
  },
  props: {
    // 是否多sku
    multiSku: {
      type: Boolean,
      default: false,
    },
    // 获利
    mainPrice: {
      type: [String, Number],
      default: 0,
    },
    // 好友立减
    subPrice: {
      type: [String, Number],
      default: 0,
    },
  },
};
</script>

<style lang="scss">
// 需要从父级覆盖，修改颜色，不用scoped
.invite-bonus {
  display: flex;
  flex-direction: column;
  align-items: center;

  .invite-tip {
    font-size: 14px;
    color: #323233;
    // margin-top: 16px;
    font-weight: bold;
  }
  .invite-profit {
    font-family: Avenir;
    margin: 12px 0;
    color: #FF5100;
    line-height: 1;

    .symbol {
      font-size: 30px;
      font-weight: bolder;
    }
    .amount {
      font-size: 60px;
      font-weight: bolder;
    }
  }

  .friend-tip {
    font-size: 14px;
    .tip-text {
      color: #969799;
    }
    .tip-amount {
      font-family: Avenir;
      color: #FF5100;
      margin-left: 5px;
      font-weight: bold;
    }
  }
}
</style>
