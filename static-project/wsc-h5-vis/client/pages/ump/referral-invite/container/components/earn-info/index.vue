<template>
  <div class="wrap">
    <div class="cash-earn">
      <div class="earn-item">
        <div class="earn-title">
          佣金收益（元）
          <van-icon name="question-o" size="14px" @click="onOpenCommisson" />
        </div>
        <div class="earn-num">
          {{ myProfit.commissionValue | money }}
        </div>
      </div>
      <div v-if="showWithdrawal" class="withdrawal-btn" @click="withdraw">
        去提现
        <van-icon name="arrow" />
      </div>
    </div>
    <div class="other-earn">
      <div class="earn-item" @click="goPoint">
        <div class="earn-title">
          {{ pointName }}
        </div>
        <div class="earn-num">
          {{ myProfit.point }}
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="earn-item" @click="goCoupon">
        <div class="earn-title">
          优惠券
        </div>
        <div class="earn-num">
          {{ myProfit.couponCount }}
          <van-icon name="arrow" />
        </div>
      </div>
      <div class="earn-item" @click="goPresent">
        <div class="earn-title">
          赠品
        </div>
        <div class="earn-num">
          {{ myProfit.presentCount || 0 }}
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from 'vant';
import { mapActions, mapState } from 'vuex';
import OpenCommission from './CommissionModal';
import format from '@youzan/utils/money/format';
import { redirect } from '@/common/utils/custom-safe-link';

export default {
  filters: {
    money: function(value) {
      return format(value, true, false);
    },
  },
  components: {
    'van-icon': Icon,
  },
  props: {
    showWithdrawal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('recommend-gift', ['myProfit', 'pointName']),
  },
  mounted() {
    this.getMyProfit();
  },
  methods: {
    ...mapActions('recommend-gift', ['getMyProfit', 'withdraw']),
    onOpenCommisson() {
      OpenCommission({
        props: {
          settleAmount: format(this.myProfit.noSettlementCommissionValue, true, false),
        },
      });
    },
    goPoint() {
      redirect({
        url: '/wscump/pointstore/pointcenter',
      });
    },
    goCoupon() {
      redirect({
        url: '/wscump/coupon/collection',
      });
    },
    goPresent() {
      redirect({
        url: '/wscump/presents',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cash-earn, .other-earn {
  display: flex;
  align-items: center;
}
.cash-earn {
  justify-content: center;
  flex-direction: column;
  .earn-title {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .earn-num {
    font-size: 32px;
    margin-top: 10px;
    margin-left: 0;
  }
  .withdrawal-btn {
    padding: 3px 20px;
    padding-left: 22px;
    margin-top: 8px;
    background: #FFECE3;
    font-size: 12px;
    color: #FF5007;
    line-height: 18px;
    background: #FFECE3;
    border-radius: 12px;
    display: flex;
    align-items: center;
    font-weight: bold;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -5px;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid #FFECE3;
    }

    .van-icon-arrow {
      margin-left: 5px;
    }
  }
}
.other-earn {
  margin-top: 18px;
  justify-content: space-between;
}

.earn-title, .earn-num {
  text-align: center;
  font-weight: bold;
}

.earn-title {
  font-size: 12px;
  color: #959799;
}
.earn-num {
  margin-top: 4px;
  font-size: 16px;
  color: #313133;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  .van-icon-arrow {
    font-size: 14px;
  }
}
</style>
