<template>
  <van-popup
    v-model="show"
    closeable
    :close-on-click-overlay="false"
    class="confirm-popup"
    round
  >
    <div class="container">
      <header v-if="boostFriendsCount>0">
        <friends-avatar-list :limit="2" :show-more="false" :avatars="avatarList" />
        <span class="text">{{ boostFriendsCount }}人已为你助力</span>
      </header>
      <section class="title">
        <!-- 此处不接受用户输入，保证无风险 -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <h1 v-html="message" />
        <h2>
          当前已攒学费
          <span class="number">{{ currentTuitionAmount }}</span> 元
        </h2>
      </section>
      <section class="progress">
        <progress-bar pop-tip="即将攒到" :animation="true" />
      </section>
      <footer>
        <van-button class="button" round @click="onClickGoOnInviteButton">
          继续邀请
        </van-button>
        <p role="button" class="link-button" @click="onClickRedeemButton">
          兑换课程
        </p>
      </footer>
    </div>
  </van-popup>
</template>
<script>
import Vue from 'vue';
import { Popup as VanPopup, Button as VanButton } from 'vant';
import ProgressBar from '../components/ProgressBar.vue';
import { mapGetters, mapState } from 'vuex';
import FriendsAvatarList from '../components/FriendsAvatarList.vue';
import { DEFAULT_AVATAR } from '../constants';

export default Vue.extend({
  name: 'popup-confirm',
  components: {
    VanPopup,
    VanButton,
    ProgressBar,
    FriendsAvatarList,
  },

  computed: {
    ...mapGetters({
      message: 'inviteTip',
      currentTuitionAmount: 'currentTuitionAmount',
    }),
    ...mapState([
      'boostFriends',
      'boostFriendsCount',
    ]),
    avatarList() {
      return this.boostFriends.map(item => item.avatar || DEFAULT_AVATAR);
    },

    show: {
      get() {
        return this.$store.state.isPopupConfirmVisible;
      },
      set(value) {
        this.$store.commit('setIsPopupConfirmVisible', value);
      },
    },
  },

  methods: {
    onClickGoOnInviteButton() {
      this.$store.commit('setIsPopupConfirmVisible', false);
      this.$store.dispatch('share');
    },
    onClickRedeemButton() {
      this.$store.dispatch('redeem', false);
    },
  },
});
</script>

<style lang="scss" scoped>
.confirm-popup {
  border-radius: 8px;

  .container {
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: space-between; */
    min-width: 311px;
    header {
      display: flex;
      align-items: center;
      justify-content: center;
      .text {
        font-size: 14px;
        color: #646566;
        margin-left: 12px;
        font-weight: 500;
      }
    }
    section.title {
      margin-top: 24px;
      text-align: center;
      .number {
        color: #ff3200;
        font-weight: 500;
      }
      h1 {
        font-size: 18px;
        color: #323233;
        font-weight: 500;
      }
      h2 {
        margin-top: 14px;
        font-size: 14px;
        color: #969799;
      }
    }
    section.progress {
      margin-top: 8px;
      width: 100%;
    }
    footer {
      margin-top: 24px;
      .button {
        width: 240px;
        border: none;
        background-image: linear-gradient(
          90deg,
          #ff6713 0%,
          #ff6713 0%,
          #ff551f 100%
        );
        .van-button__text {
          color: #ffffff;
          font-size: 16px;
          font-weight: 500;
        }
      }
      .link-button {
        margin-top: 16px;
        font-size: 16px;
        color: #646566;
        text-align: center;
      }
    }
  }
}
</style>
