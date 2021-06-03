<template>
  <div
    v-if="data"
    class="group-item"
  >
    <i
      class="avatar"
      :style="{ backgroundImage: `url(${avatar})` }"
    />
    <span class="name">{{ name }}</span>
    <div class="group-info">
      <div class="info">
        <p class="num">
          还差 <span :style="{ color: mainColor }">{{ data.remainJoinNum }}</span> 人成团
        </p>
        <p class="time">
          剩余
          <van-cont-down
            class="count-down"
            :time="data.remainTime * 1000"
          />结束
        </p>
      </div>
      <span
        v-log="['groupon_join', '点击去参团']"
        class="join"
        :style="{ color: mainColor, borderColor: mainColor }"
        @click="join"
      >
        去参团
      </span>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash';
import { CountDown, Dialog } from 'vant';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import pay from '@/pages/course/detail/store/pay';
import { createGroup } from '@/pages/course/detail/store/parser/activity-parser/default/buttons/utils';
import cdnDowngrade from '@/common/utils/cdn-downgrade';
import { mapActions } from 'vuex';

export default {
  components: {
    'van-cont-down': CountDown,
  },

  props: {
    data: {
      type: Object,
      default: null,
    },
  },

  rootState: ['goodsData', 'activityTypes', 'activityDataMap', 'kdtId'],

  computed: {
    avatar() {
      return cdnDowngrade(this.data.avatar) || 'https://b.yzcdn.cn/wsc-h5-vis/course/detail/defaultAvatar.png';
    },

    name() {
      return this.data.nickName || '匿名小伙伴';
    },

    mainColor() {
      return this.$theme.colors.main;
    },

    hasBookedOrder() {
      return get(_global, 'hasBookedOrder', false);
    },
  },

  methods: {
    ...mapActions(['autoReceiveCoupon']),
    join() {
      let type = ACTIVITY_TYPE.GROUP_BUY;
      let logType = 'groupon-join';
      if (this.activityTypes.includes(ACTIVITY_TYPE.LADDER_GROUPON)) {
        type = ACTIVITY_TYPE.LADDER_GROUPON;
        logType = 'ladder-groupon-join';
      }
      const payload = {
        groupAlias: this.data.groupAlias,
        scale: this.data.joinNum + this.data.remainJoinNum,
      };
      const activityData = get(this.activityDataMap, type, {});
      if (activityData.groupType === 1 && this.hasBookedOrder) {
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
          pay(type, { ...payload, ...res }, logType);
        });
        return;
      }
      pay(type, payload, logType);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.group-item {
  padding: 12px 16px;

  .avatar {
    display: inline-block;
    width: 44px;
    height: 44px;
    vertical-align: middle;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    border-radius: 50%;
  }

  .name {
    display: inline-block;
    margin-left: 16px;
    font-size: 14px;
    color: $main-text-color;
  }

  .group-info {
    display: flex;
    float: right;
    height: 44px;
    align-items: center;

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-right: 12px;
      text-align: right;

      .num {
        font-size: 14px;
        line-height: 18px;
        color: $main-text-color;
      }

      .time {
        @include mini-font;

        margin-top: 2px;
        line-height: 14px;
        color: $vice-text-color;
        transform-origin: right;

        .count-down {
          display: inline-block;
          font-size: 12px;
          color: $vice-text-color;
        }
      }
    }

    .join {
      height: 30px;
      padding: 0 12px;
      font-size: 14px;
      line-height: 28px;
      border-style: solid;
      border-width: 1px;
      border-radius: 15px;
      box-sizing: border-box;
    }
  }
}
</style>
