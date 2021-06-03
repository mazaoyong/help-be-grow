<template>
  <div class="invite-friend-and-gift">
    <div
      v-show="isShowFriendGate"
      class="invite-friend-button"
      @click="onInviteFriend">
      <van-icon name="point-gift-o" />
      <span>送好友</span>
    </div>

    <template v-if="isInviteFriend">
      <van-popup
        v-if="isReceivedOver"
        v-model="showInviteFriendPop"
        class="invite-friend-popup"
      >
        <invite-friend-pop-inner
          :cover="contentData.cover"
          :title="contentData.title"
          :author="contentData.author"
          :media-type="contentData.mediaType"
          :video-duration="contentData.videoDuration"
          :every-content-friend-count="persentGiftInfo.everyContentFriendCount"
          @invite-friend="onInviteFriend"
          @pay-for-friend="onPayForFriend"
        />
      </van-popup>
      <share-guide
        v-else
        v-show="showInviteFriendPop"
        :is-distribution="persentGiftInfo.isDistribution"
        :every-content-friend-count="persentGiftInfo.everyContentFriendCount"
        :received-count="persentGiftInfo.receivedCount"
        :distribution-money="persentGiftInfo.distributionMoney"
        @invite-friend="onInviteFriend"
      />
    </template>

    <van-popup
      v-model="showPayForFriendPop"
      position="bottom"
      class="invite-friend-popup-new"
      round
    >
      <pay-for-friend-pop-inner
        :pay-content-info="payContentInfo"
        :author="contentData.author"
        :media-type="contentData.media_type"
        :video-duration="contentData.video_duration"
        :is-free-goods-optimize="isFreeGoodsOptimize"
        @buy-contents="onBuyContents"
        @close="onClosePayForFriendPop"
      />
    </van-popup>
  </div>
</template>

<script>
import { Popup, Icon } from 'vant';
import InviteFriendPopInner from 'pct/components/invite-friend/InviteFriendPopInner';
import PayForFriendPopInner from 'pct/components/invite-friend/PayForFriendPopInner';
import ShareGuide from 'pct/components/invite-friend/ShareGuide';
import { MEDIA_TYPE } from 'pct/constants';

export default {
  name: 'invite-friend-and-gift',

  components: {
    'van-popup': Popup,
    'van-icon': Icon,
    ShareGuide,
    InviteFriendPopInner,
    PayForFriendPopInner,
  },

  props: {
    contentData: {
      type: Object,
      default() { return {}; },
    },
    isPaid: Boolean,

    isPersentGift: Boolean,
    isInviteFriend: Boolean, // 请好友看
    isReceivedOver: Boolean,
    payContentInfo: Object,
    persentGiftInfo: Object,
    isFreeGoodsOptimize: Boolean,
  },

  data() {
    return {
      showInviteFriendPop: false,
      showPayForFriendPop: false,
    };
  },

  computed: {
    // 是否为免费商品
    isFreeGoods() {
      return +this.contentData.sellerType === 2
        ? +this.contentData.columnDetail.price === 0
        : +this.contentData.price === 0;
    },

    // 是否为免费试看（防盗开关有部分逻辑重叠）
    isTry() {
      switch (this.contentData.mediaType) {
        case MEDIA_TYPE.IMAGE_TEXT:
          return this.contentData.isFree;
        case MEDIA_TYPE.AUDIO:
          return !this.isPaid && this.contentData.isFree;
        case MEDIA_TYPE.VIDEO:
          return !this.isPaid && this.contentData.isFree;
        default:
          return false;
      }
    },

    // 所有0元商品，包括0元要领取、0元不要领取、免费试看，C端不展示“请好友看”的入口
    isShowFriendGate() {
      return !this.isFreeGoods && !this.isTry && this.persentGiftInfo.channelType;
    },
  },

  methods: {
    onInviteFriend() {
      if (this.isPersentGift) {
        this.onPayForFriend();
      } else {
        this.showInviteFriendPop = !this.showInviteFriendPop;
      }
    },

    // 付费送好友底部popup
    onPayForFriend() {
      if (this.showInviteFriendPop) {
        this.showInviteFriendPop = !this.showInviteFriendPop;
      }
      this.showPayForFriendPop = !this.showPayForFriendPop;
    },

    onBuyContents(count) {
      this.$emit('buy-gift', count);
    },

    onClosePayForFriendPop() {
      this.showPayForFriendPop = false;
    },
  },
};
</script>

<style lang="scss">
.invite-friend-and-gift {

  .invite-friend-button {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    font-size: 12px;
    color: #00b389;
    border: 1px solid #00b389;
    border-radius: 14px;

    .van-icon-point-gift-o {
      color: #00b389;
      font-size: 14px;
      margin-right: 3px;
    }

    span {
      margin-top: 2px;
    }
  }

  .invite-friend-popup-new {
    max-height: 80%;
    min-height: 50%;
  }

  .invite-friend-popup {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 40%;
  }
}
</style>
