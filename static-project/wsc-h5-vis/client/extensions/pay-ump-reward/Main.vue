<template>
  <div v-if="rewardList.length" class="ump-reward">
    <div class="ump-reward__header">
      入学奖励
    </div>
    <div
      v-theme.main
      v-theme:background.main10="rewardType === REWARD_TYPE.POINTS || rewardType === REWARD_TYPE.COUPON"
      class="ump-reward__body"
      :class="[`ump-reward__body${
        rewardType === REWARD_TYPE.POINTS || rewardType === REWARD_TYPE.COUPON ? '--points' : ''}`]"
    >
      <div class="ump-reward__content">
        <!-- 课程奖励 -->
        <list-item
          v-if="rewardType === REWARD_TYPE.COURSE || rewardType === REWARD_TYPE.EXP_COURSE"
          :thumbnail-url="courseCover"
          :title="courseTitle"
          :subtitle="`${courseValue}课时`"
        >
          <div slot="footer-left" class="ump-reward__item__price">
            <span v-theme.main>￥0</span>
            <del>￥{{ coursePrice }}</del>
          </div>
        </list-item>
        <!-- 积分奖励 -->
        <div v-if="rewardType === REWARD_TYPE.POINTS" class="ump-reward__content--points">
          <p v-theme.main>
            恭喜获得{{ awardValue }}{{ pointsName }}
          </p>
          <p v-theme.main>
            可兑换商品、抵扣现金
          </p>
        </div>
        <!-- 优惠券 -->
        <div v-if="rewardType === REWARD_TYPE.COUPON" class="ump-reward__content--coupons">
          <div class="ump-reward__content--coupons__count">
            <span class="ump-reward__content--coupons__unit">￥</span>
            <span class="ump-reward__content--coupons__num">{{ couponValue }}</span>
          </div>
          <div class="ump-reward__content--coupons__info">
            <p class="ump-reward__content--coupons__name">
              {{ couponName }}
            </p>
            <p class="ump-reward__content--coupons__desc">
              {{ couponDesc }}
            </p>
          </div>
        </div>
      </div>
      <div v-if="rewardType !== REWARD_TYPE.POINTS" class="ump-reward__action">
        <div v-if="isReceived" class="ump-reward__text-received">
          已领取
        </div>
        <template v-else>
          <div
            v-if="rewardType === REWARD_TYPE.COUPON && couponCount > 1"
            class="ump-reward__coupon-count"
          >
            共{{ couponCount }}张
          </div>
          <div
            v-theme.main="'background'"
            class="ump-reward__btn-receive"
            @click="gotoRewardList"
          >
            立即领取
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import ListItem from 'components/list-item';
import buildUrl from '@youzan/utils/url/buildUrl';
import { REWARD_STATUS, REWARD_TYPE } from './constants';
import { mapData } from '@youzan/ranta-helper-vue';
import { getThemeHook } from '@/common/global/common-run/theme';

const themeHook = getThemeHook();

export default {
  name: 'ump-reward',

  components: {
    ListItem,
  },

  directives: {
    'theme': {
      inserted: themeHook,
      update: themeHook,
    },
  },

  data() {
    return {
      REWARD_TYPE,
      pointsName: '积分',
      rewardInfo: {},
    };
  },

  computed: {
    rewardList() {
      return get(this.rewardInfo, 'payAwardList', []);
    },

    rewardType() {
      return this.rewardList[0] && this.rewardList[0].awardType;
    },

    courseCover() {
      return get(this, 'rewardList[0].awardData.pictureUrl');
    },

    courseTitle() {
      return get(this, 'rewardList[0].awardData.goodsName');
    },

    courseValue() {
      return this.awardValue / 100;
    },

    coursePrice() {
      return get(this, 'rewardList[0].awardData.price', 0) / 100;
    },

    // 积分、优惠券数值
    awardValue() {
      return get(this.rewardList[0], 'awardValue', 0);
    },

    // 优惠券张数
    couponCount() {
      return this.rewardList.reduce((count, reward) => {
        if (reward.rewardStatus === REWARD_STATUS.UNRECEIVED) {
          count += reward.awardValue;
        }

        return count;
      }, 0);
    },

    // 优惠券价格
    couponValue() {
      return get(this, 'rewardList[0].awardData.value', 1) / 100;
    },

    // 优惠券名字
    couponName() {
      return get(this, 'rewardList[0].awardData.title', '优惠券');
    },

    // 优惠券描述
    couponDesc() {
      return get(this, 'rewardList[0].awardData.usingThresholdDisplay', '');
    },

    // 是否已被领取
    isReceived() {
      return this.rewardList.every(reward => reward.rewardStatus === REWARD_STATUS.RECEIVED);
    },
  },

  watch: {
    'rewardType': function(val) {
      if (val) {
        this.$nextTick(() => {
          const numElem = document.querySelector('.ump-reward__content--coupons__num');
          if (numElem) {
            const { width } = numElem.getBoundingClientRect();
            if (width > 65) {
              numElem.style.transform = `scale(${65 / width})`;
              numElem.style.verticalAlign = 'bottom';
            } else {
              numElem.style.lineHeight = '42px';
            }
          }
        });
      }
    },
  },

  created() {
    mapData(this, ['rewardInfo', 'pointsName']);
  },

  methods: {
    gotoRewardList() {
      switch (this.rewardType) {
        case REWARD_TYPE.POINTS:
          this.ctx.process.invoke('logAction', {
            et: 'click',
            ei: 'ump_reward_points',
            en: '入学奖励-领取积分',
            pt: 'paidReceipt',
          });
          break;
        case REWARD_TYPE.COURSE:
        case REWARD_TYPE.EXP_COURSE:
          this.ctx.process.invoke('logAction', {
            et: 'click',
            ei: 'ump_reward_course',
            en: '入学奖励-领取课程',
            pt: 'paidReceipt',
          });
          break;
        case REWARD_TYPE.COUPON:
          this.ctx.process.invoke('logAction', {
            et: 'click',
            ei: 'ump_reward_coupon',
            en: '入学奖励-领取优惠券',
            pt: 'paidReceipt',
          });
          break;
        default:
          break;
      }

      const kdtId = _global.kdtId || _global.kdt_id;

      this.ctx.process.invoke('navigateGo', {
        url: buildUrl(`https://h5.youzan.com/wscvis/edu/reward/list/active?kdtId=${kdtId}`, 'h5', kdtId),
      });
    },
  },
};
</script>

<style lang="scss">
.ump-reward {
  margin: 12px;
  padding: 0 12px 16px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;

  &__header {
    line-height: 44px;
    font-size: 16px;
    font-weight: 500;
    color: #323233;
  }

  &__body {
    display: flex;

    &--points {
      box-sizing: border-box;
      padding: 0 12px;
      height: 84px;
      border-radius: 4px;
    }
  }

  &__content {
    max-width: calc(100vw - 108px);
    flex: 1 1 auto;
    display: flex;
    align-items: center;

    .item {
      width: 100%;
      padding: 0;
      display: flex;
      align-items: center;

      &__thumbnail-container {
        float: none;
        min-width: 110px;
      }

      &__title {
        font-weight: 400;
      }
    }

    &--points {

      p {
        margin-top: 8px;
        line-height: 16px;
        font-size: 12px;

        &:first-child {
          margin-top: 0;
          line-height: 18px;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    &--coupons {
      display: flex;
      justify-content: space-around;

      &__count {
        width: 80px;
        white-space: nowrap;
      }

      &__unit {
        display: inline-block;
        font-size: 12px;
      }

      &__num {
        display: inline-block;
        font-size: 30px;
        transform-origin: 0 100%;
      }

      &__info {
        margin-left: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      &__name {
        line-height: 18px;
        font-size: 14px;
        font-weight: 500;
      }

      &__desc {
        margin-top: 8px;
        line-height: 16px;
        font-size: 12px;
      }
    }
  }

  &__action {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__btn-receive {
    padding: 0 6px;
    line-height: 22px;
    font-size: 12px;
    color: #fff;
    border-radius: 11px;
  }

  &__coupon-count {
    margin-bottom: 4px;
    font-size: 10px;
    color: #646566;
  }

  &__text-received {
    height: 18px;
    font-size: 14px;
    color: #969799;
  }

  &__item {
    &__price {
      line-height: 14px;
      font-size: 12px;
      font-weight: 700;

      del {
        margin-left: 4px;
        font-size: 10px;
        font-weight: 500;
        color: #969799;
      }
    }
  }
}
</style>
