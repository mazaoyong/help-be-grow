<template>
  <div class="profit-wrapper">
    <div class="profit-wrapper__sum">
      <p class="profit-wrapper__sum-tip">
        累计收益
      </p>
      <p class="profit-wrapper__sum-money">
        <span class="unit">
          &yen;
        </span>
        {{ total }}
      </p>
      <div class="profit-wrapper__sum-unaccount">
        <span>包含待结算金额: &yen;{{ account }}</span>
      </div>

      <div class="profit-wrapper__sum-btn" @click="toTakeCash">
        提现
      </div>

      <p class="profit-wrapper__sum-comment">
        推广订单过了冻结期(最长7天)，对应的佣金可提现
      </p>
    </div>

    <div class="profit-wrapper__list">
      <van-cell-group>
        <van-cell
          title="收益历史"
          is-link
          @click="toProfitList"
        />
      </van-cell-group>
      <template>
        <profit-item
          v-for="(item, index) in items"
          :key="index"
          :item="item"
        />
      </template>
    </div>

    <div class="profit-wrapper__footer">
      <p class="profit-wrapper__footer-tip">
        温馨提示
      </p>
      <p class="profit-wrapper__footer-desc">
        此页面展示的收益仅来自于推荐有奖活动
      </p>
    </div>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant';
import format from 'zan-utils/money/format';
import formatDate from '@youzan/utils/date/formatDate';
import ProfitItem from 'pct/components/ProfitItem';
import apis from 'pct/api';
import { FEE_TYPE } from 'pct/constants';
import mixinVisPage from 'common/mixins/mixin-vis-page';
import * as SafeLink from '@youzan/safe-link';
import { getSalemanUpgradeResult } from '../../../../common-api/pay';

export default {
  name: 'profit',

  config: {
    title: '我的收益',
    hideCopyright: true,
  },

  components: {
    'van-cell': Cell,
    'van-cell-group': CellGroup,
    ProfitItem,
  },

  mixins: [mixinVisPage],

  data() {
    return {
      total: 0,
      account: 0,
      items: [],
      showList: false,
      // 分销员零钱是否升级
      changeUpgraded: false,
    };
  },

  created() {
    this.getProfitInfo();
    this.getProfitDetail();
    // 查询分销员零钱是否升级
    this.getChangeUpgradeResult();
  },

  methods: {
    getProfitInfo() {
      apis.getProfitInfo()
        .then((data) => {
          this.parseAmount(data);
        });
    },

    getChangeUpgradeResult() {
      getSalemanUpgradeResult().then(res => {
        this.changeUpgraded = res.upgraded;
      });
    },

    getProfitDetail() {
      apis.getProfitDetail()
        .then((data) => {
          this.parseItems(data);
        });
    },

    parseAmount(data = {}) {
      const { totalAmount, settleAmount } = data;
      this.total = format(totalAmount, true, false);
      this.account = format(settleAmount, true, false);
    },

    parseItems(list = []) {
      list.forEach(item => {
        item.label = FEE_TYPE[item.feeType];
        item.createTime = formatDate(item.createTime, 'YYYY-MM-DD HH:mm:ss');
        item.amount = format(item.amount, true, false);
        item.nickName = item.extra.fansNickName || '匿名小伙伴';
      });
      this.items = list;
    },

    toTakeCash() {
      // 如果分销员零钱分级了，那么需要跳到新的零钱页面
      if (this.changeUpgraded) {
        SafeLink.redirect({
          url: `${window.location.origin}/wscassets/change/profile?kdtId=${window._global.kdt_id}`,
          kdtId: window._global.kdt_id,
        });
      } else {
        SafeLink.redirect({
          url: `${window.location.origin}/wscassets/withdraw`,
          kdtId: window._global.kdt_id,
        });
      }
    },

    toProfitList() {
      this.$router.push({
        name: 'ProfitList',
      });
    },
  },
};
</script>

<style lang="scss">
  @import 'var';

  .profit-wrapper {
    &__sum {
      padding: 30px 20px;
      text-align: center;
      font-size: 16px;
      color: $c-black;
      background-color: $c-white;

      &-tip {
        margin-bottom: 15px;
      }

      &-money {
        line-height: 34px;
        margin-bottom: 27px;
        font-size: 34px;
        font-weight: 600;

        .unit {
          vertical-align: text-top;
          font-size: 24px;
        }
      }

      &-unaccount {
        margin-bottom: 30px;

        span {
          line-height: 22px;
          padding: 4px 12px;
          border-radius: 4px;
          background-color: $c-background;
          color: $c-gray-darker;
        }
      }

      &-btn {
        width: 100%;
        height: 45px;
        line-height: 45px;
        background-color: $c-orange;
        border-radius: 2px;
        color: $c-white;
      }

      &-comment {
        margin-top: 15px;
        font-size: 12px;
        color: $c-gray-dark;
      }
    }

    &__list {
      margin-top: 10px;
      background-color: $c-white;
    }

    &__footer {
      line-height: 20px;
      padding-bottom: 25px;
      text-align: center;
      color: $c-gray-dark;
      font-size: 14px;

      &-tip {
        max-width: 210px;
        margin: 20px auto 10px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAagAAAACAQMAAAA3jNq/AAAABlBMVEUAAADl5eX5J7raAAAAAXRSTlMAQObYZgAAABVJREFUCNdj+I8KPjBgA/xoqsjTBQAbcT3DZVIMuwAAAABJRU5ErkJggg==);
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
      }

      &-desc {
        font-size: 14px;
      }
    }

    .list-pop {
      width: 100%;
      height: 100%;
    }
  }
</style>
