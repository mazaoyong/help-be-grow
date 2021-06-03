<template>
  <div v-if="groupInfo" class="group van-goods-action" @click="join">
    <div class="imgs">
      <img :src="groupInfo.avatar">
      <img src="https://b.yzcdn.cn/wsc-h5-vis/course/detail/join-group.png">
    </div>
    <p class="tip">
      {{ groupInfo.name }}的团只差
      <span class="num">{{ groupInfo.gapNum }}</span>
      人
    </p>
    <p class="button">
      快速凑团
      <van-icon class="arrow" name="arrow" />
    </p>
  </div>
</template>

<script>
import { get } from 'lodash';
import { Icon, Dialog } from 'vant';
import { GOODS_STATUS } from '@/constants/course/goods-status';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import pay from '@/pages/course/detail/store/pay';
import { createGroup } from '@/pages/course/detail/store/parser/activity-parser/default/buttons/utils';
import { mapActions } from 'vuex';
import { getGroupOnDetail } from './api';

export default {
  components: {
    'van-icon': Icon,
  },

  data() {
    return {
      groupInfo: null,
    };
  },

  rootState: ['goodsData', 'activityData', 'activityTypes', 'kdtId'],
  rootGetters: ['isOnlineCourse'],

  computed: {
    activityType() {
      let activityType = ACTIVITY_TYPE.NO_ACTIVITY;
      if (this.activityTypes.includes(ACTIVITY_TYPE.GROUP_BUY)) {
        activityType = ACTIVITY_TYPE.GROUP_BUY;
      }
      if (this.activityTypes.includes(ACTIVITY_TYPE.LADDER_GROUPON)) {
        activityType = ACTIVITY_TYPE.LADDER_GROUPON;
      }
      return activityType;
    },

    hasBookedOrder() {
      return get(_global, 'hasBookedOrder', false);
    },
  },

  created() {
    if (this.activityType && this.activityData.groupAlias) {
      if (this.isOnlineCourse && this.activityData.isJoined) {
        return;
      }
      if (this.goodsData.status !== GOODS_STATUS.SELLING) {
        return;
      }
      getGroupOnDetail(this.activityType, this.activityData.groupAlias)
        .then(res => {
          const { groupInfo = {}, joinRecords = [] } = res;
          if (!groupInfo.isGroupOnSuccess && !groupInfo.isGroupOnFailed && !groupInfo.isEnd) {
            this.groupInfo = {
              avatar: joinRecords[0] && joinRecords[0].fansPicture,
              name: joinRecords[0] && joinRecords[0].fansNickName,
              joinNum: groupInfo.joinNum,
              gapNum: groupInfo.gapNum,
            };
          }
        });
    }
  },

  methods: {
    ...mapActions(['autoReceiveCoupon']),
    join() {
      let logType = 'groupon-join';
      if (this.activityType === ACTIVITY_TYPE.LADDER_GROUPON) {
        logType = 'ladder-groupon-join';
      }
      const payload = {
        groupAlias: this.activityData.groupAlias,
        scale: this.groupInfo.joinNum + this.groupInfo.gapNum,
      };
      if (this.activityData.groupType === 1 && this.hasBookedOrder) {
        Dialog.confirm({
          title: '',
          message: '你已经是老客户了，无法享受新客拼团价。推荐立即开新团，享受开团优惠',
          cancelButtonText: '暂不开团',
          confirmButtonText: '开新团',
        }).then(() => {
          createGroup({ kdtId: this.kdtId });
        });
        return;
      }
      if (this.activityTypes.includes(ACTIVITY_TYPE.COUPON)) {
        Object.assign(payload, {
          skuActivityType: ACTIVITY_TYPE.COUPON,
        });
        this.autoReceiveCoupon().then((res) => {
          pay(this.activityType, { ...payload, ...res }, logType);
        });
        return;
      }
      // TODO: 这里需要对 groupAlias 做一次校验，因为这里用户实际触发了参与拼团的操作，那么带出去的数据就一定要准确的
      pay(this.activityType, payload, logType);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.group {
  position: fixed;
  bottom: 50px;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-bottom: constant(safe-area-inset-bottom);
  margin-bottom: env(safe-area-inset-bottom);
  font-size: 14px;
  background-color: #ffe1ba;
  box-sizing: border-box;

  .imgs {
    position: relative;
    width: 52px;
    height: 30px;
    flex-shrink: 0;

    img {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 30px;
      height: 30px;
      border-radius: 50%;

      &:last-child {
        left: 22px;
        z-index: 1;
      }
    }
  }

  .tip {
    width: 100%;
    margin: 0 8px;

    .num {
      color: #f44;
    }
  }

  .button {
    flex-shrink: 0;
    color: $main-text-color;

    .arrow {
      font-size: 16px;
      color: $main-text-color;
      vertical-align: text-bottom;
    }
  }
}
</style>
