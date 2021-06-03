<template>
  <info-cell-group
    v-if="show"
    v-tab="tab"
    class="group-buy-block"
  >
    <div v-if="showList">
      <info-cell title="拼团">
        ta正在发起拼团，可直接参与
      </info-cell>
      <group-item v-for="item in list" :key="item.groupId" :data="item" />
    </div>
    <info-cell
      v-log="['groupon_guide', '点击拼团查看玩法']"
      title="玩法"
      url="/v2/ump/groupon/guide"
      is-link
    >
      {{ tip }}
    </info-cell>
  </info-cell-group>
</template>

<script>
import format from '@youzan/utils/money/format';
import { InfoCell, InfoCellGroup } from '@/pages/course/detail/components/info-cell';
import { GOODS_STATUS } from '@/constants/course/goods-status';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { GROUP_BUY_TYPE } from '@/constants/ump/group-buy-type';
import GroupItem from './components/group-item';

export default {
  components: {
    InfoCell,
    InfoCellGroup,
    GroupItem,
  },

  rootState: ['activityTypes', 'activityData', 'goodsData', 'env', 'user'],
  rootGetters: ['isColumn', 'isOnlineCourse'],

  computed: {
    show() {
      if (this.isOnlineCourse && this.env.isIOSWeapp) {
        return false;
      }
      if (this.isOnlineCourse && this.goodsData.isOwnAsset) {
        return false;
      }
      return this.activityTypes.includes(ACTIVITY_TYPE.GROUP_BUY) ||
        this.activityTypes.includes(ACTIVITY_TYPE.LADDER_GROUPON);
    },

    list() {
      return this.activityData.groupList.filter(group => this.user.buyerId !== group.buyerId);
    },

    showList() {
      if (this.isOnlineCourse && this.activityData.isJoined) {
        return false;
      }
      if (this.goodsData.status !== GOODS_STATUS.SELLING) {
        return false;
      }
      if (this.activityData.isShowJoinGroup && this.list.length) {
        return true;
      }
      return false;
    },

    tab() {
      if (this.isColumn) {
        return {
          index: 1,
          title: '专栏介绍',
        };
      }
      return null;
    },

    tip() {
      if (this.activityTypes.includes(ACTIVITY_TYPE.LADDER_GROUPON)) {
        const ladderList = Object.keys(this.activityData.ladder).map(ladder => {
          let minPrice = this.activityData.ladder[ladder].minPrice;
          let maxPrice = this.activityData.ladder[ladder].maxPrice;
          if (minPrice === maxPrice) {
            return `${ladder}人拼团${format(minPrice, true, false)}/件`;
          }
          return `${ladder}人拼团${format(minPrice, true, false)}起/件`;
        });
        return `${ladderList.join('，')}，开团前选择参团人数，支付后开团并邀请好友参团，人数不足自动退款`;
      }
      return `支付开团邀请${this.activityData.conditionNum - 1}${this.activityData.groupType === GROUP_BUY_TYPE.OLD_NEW ? '名新用户' : '人'}参团，人数不足自动退款`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.group-buy-block {
  margin-bottom: 8px;
}
</style>
