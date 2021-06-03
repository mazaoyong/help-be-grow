<template>
  <i v-if="isCustomerDiscount" class="ump-tag-vip" />
  <mini-font-tag
    v-else-if="tagName"
    :color="$theme.colors.main"
    :background-color="lightColor"
    class="ump-tag"
    height="16px"
    :text="tagName"
  />
</template>

<script>
import { fns } from '@youzan/vue-theme-plugin';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';

import MiniFontTag from 'components/mini-font-tag';

const ACTIVITY_TYPE_MAP = {
  [ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT]: '限时折扣',
  [ACTIVITY_TYPE.SEC_KILL]: '秒杀',
  [ACTIVITY_TYPE.GROUP_BUY]: '拼团',
  [ACTIVITY_TYPE.LADDER_GROUPON]: '阶梯拼团',
  [ACTIVITY_TYPE.RECOMMEND_GIFT]: '好友推荐专享',
};

// 只有会员价，限时折扣，秒杀，拼团展示ump-tag
export default {
  name: 'ump-tag',

  components: {
    MiniFontTag,
  },

  state: ['goods', 'timelimitDiscount', 'secKill'],

  getters: ['singleGoods', 'isCustomerDiscount', 'isTimeLimitDiscount', 'isSecKill'],

  computed: {
    tagName() {
      // 限时折扣可以自定义标题
      if (this.isTimeLimitDiscount && this.timelimitDiscount.description) {
        return this.timelimitDiscount.description;
      }

      if (this.isSecKill && this.secKill.tag) {
        return this.secKill.tag;
      }

      return ACTIVITY_TYPE_MAP[this.singleGoods.activityType];
    },

    lightColor() {
      return fns.hexToRgba(this.$theme.colors.main, 0.1);
    },
  },

  created() {
    this.$dispatch('LOG_RECOMMENDGIFT_VISIT');
  },
};
</script>

<style lang="scss" scoped>
.ump-tag {
  &-vip {
    display: inline-block;
    width: 49px;
    height: 16px;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(https://b.yzcdn.cn/public_files/52b888a2a75b16bc85655bf9e8caef0c.png);
  }
}
</style>
