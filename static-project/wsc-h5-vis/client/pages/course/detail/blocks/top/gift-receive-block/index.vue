<template>
  <div v-if="show" class="gift-receive-block">
    <span>恭喜，你是第{{ rank }}个抢到的</span>
    <span v-theme:color.main class="action" @click="openList">看看谁抢到了</span>
    <van-icon class="close" name="cross" @click="close" />
  </div>
</template>

<script>
import { Icon } from 'vant';
import { get } from '@youzan/utils/url/args';
import { RECEIVE_GIFT_STATUS } from '@/constants/ump/receive-gift-status';
import openRankList from './components/rank-list';
import { getReceiveGiftResult } from './api';

export default {
  components: {
    'van-icon': Icon,
  },

  data() {
    return {
      show: false,

      rank: 0,

      receivedCount: 0,

      unreceivedCount: 0,
    };
  },

  rootState: ['goodsData'],

  created() {
    this.init();
  },

  methods: {
    init() {
      const isReceive = get('is_receive');
      if (isReceive) {
        getReceiveGiftResult(
          this.goodsData.alias,
          get('share_alias'),
          get('channel_type'),
          get('order_alias'),
          get('gift_no'),
          get('gift_sign'),
        ).then(res => {
          this.show = res.shareStatus === RECEIVE_GIFT_STATUS.RECEIVED;
          this.rank = res.rank;
          this.receivedCount = res.receivedCount;
          this.unreceivedCount = res.unreceivedCount;
        });
      }
    },

    openList() {
      openRankList({
        props: {
          alias: this.goodsData.alias,
          rank: this.rank,
          receivedCount: this.receivedCount,
          unreceivedCount: this.unreceivedCount,
        },
      });
    },

    close() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.gift-receive-block {
  position: fixed;
  top: 12px;
  right: 12px;
  left: 12px;
  z-index: 2;
  height: 48px;
  padding: 0 16px;
  font-size: 14px;
  line-height: 48px;
  color: $main-text-color;
  background-color: $white;
  border-radius: 8px;
  box-shadow: 0 3px 9px 0 $shadow-color;

  .action {
    display: inline-block;
    margin-left: 8px;
  }

  .close {
    float: right;
    line-height: 48px;
    color: $disabled-color;
  }
}
</style>
