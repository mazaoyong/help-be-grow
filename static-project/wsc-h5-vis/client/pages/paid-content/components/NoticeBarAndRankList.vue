<template>
  <div class="notice-bar-and-rank-list">
    <van-notice-bar
      v-if="showNoticeBar"
      mode="closeable"
      :scrollable="false"
      color="#BF9C69"
      background="#FBF7F2">
      <span class="content__notice-text">
        {{ receiveResultText }}
      </span>
      <span
        class="content__notice-action"
        @click="onRankListPopup">
        <u>&nbsp;看看谁抢到了</u>
      </span>
    </van-notice-bar>

    <van-popup
      v-if="showNoticeBar"
      v-model="showRankListPopup"
      class="rank-list-popup">
      <receive-rank-list
        :alias="params.alias"
        :share-alias="params.share_alias"
        :channel-type="params.channel_type"
        :order-alias="params.order_alias"
        :receive-result="receiveResult"
        :show-list="showNoticeBar"
        @rank-list-popup="onRankListPopup"
      />
    </van-popup>
  </div>
</template>

<script>
import { Popup, NoticeBar } from 'vant';
import ReceiveRankList from 'pct/components/invite-friend/ReceiveRankList';
import { RECEIVE_GIFT_STATUS } from 'pct/constants';
import apis from '../api';

export default {
  name: 'notice-bar-and-rank-list',

  components: {
    'van-popup': Popup,
    'van-notice-bar': NoticeBar,
    ReceiveRankList,
  },

  props: {
    params: Object,
  },

  data() {
    return {
      showNoticeBar: false,
      showRankList: true,
      showRankListPopup: false,
      receiveResultText: '',
      receiveResult: {},
    };
  },

  created() {
    // 获取礼物领取结果
    this.fetchReceiveGiftResult();
  },

  methods: {
    // 领取礼物结果
    fetchReceiveGiftResult() {
      const { params = {} } = this;

      const data = {
        alias: params.alias,
        share_alias: params.share_alias,
        channel_type: params.channel_type,
        order_alias: params.order_alias,
        gift_no: params.gift_no,
        gift_sign: params.gift_sign,
      };

      apis.getReceiveGiftResult(data)
        .then(data => {
          this.receiveResult = data;
          this.showNoticeBar = this.receiveResult.shareStatus === RECEIVE_GIFT_STATUS.RECEIVED;
          if (this.receiveResult.shareStatus === RECEIVE_GIFT_STATUS.RECEIVED) {
            this.receiveResultText = `恭喜，你是第${this.receiveResult.rank}抢到的`;
          }
        });
    },

    onRankListPopup() {
      this.showRankListPopup = !this.showRankListPopup;
    },
  },
};
</script>

<style lang="scss">
.notice-bar-and-rank-list {

  .rank-list-popup {
    overflow-y: inherit;
    top: 45%;
    border-radius: 4px;
  }
}
</style>
