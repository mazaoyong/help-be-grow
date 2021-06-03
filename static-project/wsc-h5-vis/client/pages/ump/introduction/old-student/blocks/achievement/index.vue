<template>
  <vis-popup
    v-model="show"
    title="我的成就"
    closeable
    close-on-click-overlay
    class="achievement"
  >
    <div class='achievement-container'>
      <div class="achievement-top">
        <div class="achievement-top-info">
          <div
            class="info-item"
            v-for="(item, index) in infoList"
            :key="index"
            @click="linkTo(item.url, item.count)"
          >
            <div class="info-item-count">
              {{ item.count }}
              <vis-icon v-if="item.count > 0 && item.url" name="arrow" />
            </div>
            <div class="info-item-label">
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <div class="achievement-tab">
        <van-tabs v-model="activeTab" line-width="40" color="#FF5100">
          <van-tab title="奖励发放记录" name="reward">
            <reward-list v-if="activeTab === 'reward'" />
          </van-tab>
          <van-tab title="好友进度" name="friend">
            <friend-list v-if="activeTab === 'friend'" :alias="alias" />
          </van-tab>
        </van-tabs>
      </div>
      <div v-if="canShare" class="achievement-btn">
        <main-button text="继续邀请赚奖励" @handle-click="onShare" />
      </div>
    </div>
  </vis-popup>
</template>

<script>
import { Popup } from '@youzan/vis-ui';
import { Icon, Tabs, Tab } from 'vant';
import * as SafeLink from '@youzan/safe-link';
import buildUrl from '@youzan/utils/url/buildUrl';
import { getOldStudentSummary } from '../../../apis/old-student';
import RewardList from './reward-list';
import FriendList from './friend-list';
import MainButton from '../../../components/main-button';

export default {
  name: 'achievement',
  data() {
    return {
      show: false,
      isInited: false,
      couponNum: 2,
      giftNum: 2,
      newStudentJoinNum: 2,
      pointNum: 2,
      infoList: [],
      activeTab: 'reward',
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
    },
    alias: {
      type: String,
    },
    canShare: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    'vis-popup': Popup,
    'vis-icon': Icon,
    'van-tabs': Tabs,
    'van-tab': Tab,
    RewardList,
    FriendList,
    MainButton,
  },
  watch: {
    value(bool) {
      this.show = bool;
      if (this.show) {
        this.refresh();
      }
    },
    show(bool) {
      this.$emit('input', bool);
    },
  },
  methods: {
    getSummaryInfo() {
      const { id } = this;
      getOldStudentSummary({
        id,
      }).then((res) => {
        const { couponNum = 0, giftNum = 0, newStudentJoinNum = 0, pointNum = 0 } = res;
        this.infoList = [
          {
            count: newStudentJoinNum,
            label: '邀请好友',
          },
          {
            count: pointNum,
            label: '积分',
            url: `/wscump/pointstore/pointcenter?kdt_id=${_global.kdt_id}`,
          },
          {
            count: couponNum,
            label: '优惠券',
            url: `/wscump/coupon/collection?kdt_id=${_global.kdt_id}`,
          },
          {
            count: giftNum,
            label: '赠品',
            url: `/wscump/presents?kdt_id=${_global.kdt_id}`,
          },
        ];
      });
    },

    linkTo(url, count) {
      if (!url || !count) return;
      const kdtId = window._global.kdt_id;
      SafeLink.redirect({
        url: buildUrl(url, 'h5', kdtId),
        kdtId,
      });
    },

    onShare() {
      this.show = false;
    },

    refresh() {
      this.getSummaryInfo();
    },
  },
};
</script>

<style lang="scss" scoped>
.achievement {
  background: #f7f8fa;

  &-container {
    position: relative;
    padding-bottom: 52px;
  }

  &-top {
    margin: 7px 16px 12px;
    height: 88px;
    background-image: url('https://img01.yzcdn.cn/public_files/501a118d8c3368c4196bfb2f1a49d14c.png');
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 8px;

    &-info {
      display: inline-flex;
      align-items: center;
      width: 100%;
      height: 100%;
      justify-content: space-around;

      .info-item {
        height: 100%;
        display: flex;
        flex-flow: column wrap;
        align-items: center;
        justify-content: center;
        text-align: center;

        &-count {
          display: inline-flex;
          align-items: center;
          margin-bottom: 4px;
          font-size: 16px;
          line-height: 20px;
          color: #714e15;
          font-weight: 500;
          font-family: Avenir;
        }

        &-label {
          font-size: 12px;
          line-height: 17px;
          color: #957849;
        }
      }
    }
  }

  &-tab {
    margin: 0 16px;
    height: 330px;
    background: #fff;
    border-radius: 12px;
    overflow: auto;
  }

  &-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 8px 16px;
  }
}
</style>
