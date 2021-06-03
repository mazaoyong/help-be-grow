<template>
  <div
    v-if="canShow"
    class="home-intro"
  >
    <view-wrapper
      title="奖励说明"
    >
      <div class="home-intro__main">
        <div
          v-for="(item, index) in mainRules"
          :key="index"
          class="main__item"
        >
          {{ item }}
        </div>
      </div>

      <div class="home-intro__sub">
        <p class="sub__title">
          其他说明
        </p>
        <div
          v-for="(item, index) in subRules"
          :key="index"
          class="sub__item"
        >
          {{ item }}
        </div>
      </div>
    </view-wrapper>
  </div>
</template>

<script>
import ViewWrapper from '../../../components/view-wrapper/index.vue';
import format from '@youzan/utils/money/format';
import storeName from '../store-name';
import { FROM_PAGE_TYPE } from '../constants';

export default {
  storeName,
  name: 'home-intro',

  components: {
    'view-wrapper': ViewWrapper,
  },

  state: ['activityConfig', 'fromPage'],

  computed: {
    mainRules() {
      const { commissionPrice, decreasePrice, refereeType } = this.activityConfig;
      const friendsText = {
        0: '推荐的好友需要是没有购买过该课程的新客，如果是已经购买过课程的好友则无法参与该活动。',
        1: '分享给任意好友，则有机会获得以上奖励。',
        2: '推荐的好友需要是没有在店铺内购买过课程的新客，如果是已经购买过课程的好友则无法参与该活动。',
      };
      return [
        `1、分享指定课程给好友，好友下单后，分享者即可获得${format(commissionPrice, true, false)}元现金奖励；同时好友也可以在下单时立减${format(decreasePrice, true, false)}元优惠。`,
        `2、${friendsText[refereeType]}`,
      ];
    },
    subRules() {
      return [
        '1、活动有效期内，分享得奖励活动重复分享给相同好友视为一次有效分享，推荐好友下单活动重复分享给相同好友，只要好友满足身份且下单购买，都可以获得一次奖励。',
        '2、若奖励未到帐请联系客服进行处理。奖励的使用有效期以实际发放奖励为准，请及时使用。',
        '3、通过不正当手段参与活动获得奖励，店铺有权撤销奖励。在法律范围内，本店铺有最终活动解释权。如有疑问请联系店铺客服。',
      ];
    },
    canShow() {
      return this.fromPage === FROM_PAGE_TYPE.COURSE;
    },
  },
};
</script>

<style lang="scss">
.home-intro {
  color: #323233;

  &__main {
    .main {
      &__item {
        margin-top: 12px;
        font-size: 14px;
        line-height: 20px;
        text-indent: -1.5em;
        padding-left: 1.5em;
      }
    }
  }

  &__sub {
    .sub {
      &__title {
        margin-top: 24px;
        font-size: 16px;
        line-height: 22px;
      }

      &__item {
        margin-top: 12px;
        font-size: 14px;
        line-height: 20px;
        text-indent: -1.5em;
        padding-left: 1.5em;
      }
    }
  }
}
</style>
