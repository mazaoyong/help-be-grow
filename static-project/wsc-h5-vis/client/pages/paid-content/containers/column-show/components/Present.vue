<template>
  <div class="invite-friend-and-gift">
    <div
      v-show="isPersentGift && +columnData.price !== 0"
      class="invite-friend-button"
      @click="onPresentGiftShow">
      <van-icon name="point-gift-o" />
      <span>送好友</span>
    </div>

    <van-popup
      v-if="isPersentGift"
      v-model="showPayForFriendPop"
      class="invite-friend-popup-new"
      position="bottom"
      round
    >
      <pay-for-friend-pop-inner
        :pay-content-info="payContentInfo"
        :author="columnData.author"
        @buy-contents="onBuyContents"
        @close="onPresentGiftShow"
      />
    </van-popup>
  </div>
</template>

<script>
import { Popup, Icon } from 'vant';
import PayForFriendPopInner from 'pct/components/invite-friend/PayForFriendPopInner';

export default {
  name: 'present',

  components: {
    'van-popup': Popup,
    'van-icon': Icon,
    PayForFriendPopInner,
  },

  props: {
    columnData: {
      type: Object,
      default() { return {}; },
    },
    isPaid: Boolean,

    isPersentGift: Boolean,
    payContentInfo: Object,
    persentGiftInfo: Object,
  },

  data() {
    return {
      showInviteFriendPop: false,
      showPayForFriendPop: false,
    };
  },

  methods: {
    onPresentGiftShow() {
      this.showPayForFriendPop = !this.showPayForFriendPop;
    },

    onBuyContents(count) {
      this.$emit('buy-gift', count);
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
    min-height: 50%;
    max-height: 80%;
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
