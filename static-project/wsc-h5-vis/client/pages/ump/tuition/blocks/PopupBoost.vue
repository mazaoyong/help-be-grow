<template>
  <!-- ⬇ 助力弹窗组件 - 当打开发起者的分享链接时显示，所有的助力流程均在此弹窗中进行 ⬇ -->
  <van-popup v-model="show" :close-on-click-overlay="false" class="popup-boost">
    <div class="container">
      <!-- ⬇ 标题 ⬇ -->
      <header>帮我攒学费，你也可以免费领课程</header>
      <!-- ⬆ 标题 ⬆ -->
      <!-- ⬇ 金额展示 ⬇ -->
      <section class="amount">
        <div class="tag">
          <span>最</span>
          <span>高</span>
        </div>
        <span>
          <span class="number">{{ maxAmount }}</span>
          <span>元</span>
        </span>
      </section>
      <!-- ⬆ 金额展示 ⬆ -->
      <!-- ⬇ 行动按钮 ⬇ -->
      <footer>
        <van-button
          v-track:click.boostTuition
          @click="onClickBoostButton"
          class="button"
          round
        >
          {{ button.text }}
        </van-button>
      </footer>
      <!-- ⬆ 行动按钮 ⬆ -->
      <!-- ⬇ 头像框（绝对定位） ⬇ -->
      <van-image
        :src="avatar"
        round
        fit="contain"
        class="avatar"
      />
      <!-- ⬆ 头像框（绝对定位） ⬆ -->
      <!-- ⬇ 关闭按钮（绝对定位） ⬇ -->
      <van-icon @click="show = false" name="close" class="close-icon" />
      <!-- ⬆ 关闭按钮（绝对定位） ⬆ -->
    </div>
  </van-popup>
</template>
<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import {
  Popup as VanPopup,
  Button as VanButton,
  Image as VanImage,
  Icon as VanIcon,
} from 'vant';

export default Vue.extend({
  name: 'popup-boost',
  components: {
    VanPopup,
    VanButton,
    VanImage,
    VanIcon,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      maxAmount: 'maxAmount',
      avatar: 'popupBoostAvatar',
      button: 'popupBoostButton',
    }),
    /**
     * 是否显示弹窗
     * @description 通过 store 中的 isBoostPopupVisible 控制显隐
     */
    show: {
      get() {
        return this.$store.state.isBoostPopupVisible;
      },
      set(value) {
        this.$store.commit('setBoostPopupVisible', value);
      },
    },
  },
  methods: {
    /**
     * 助力按钮的回调
     *
     * @description 触发 store 中的助力事件
     */
    onClickBoostButton() {
      this.$store.dispatch(this.button.action);
    },
  },
});
</script>

<style lang="scss" scoped>
.popup-boost {
  background-color: transparent;
  overflow-y: initial;

  .container {
    width: 311px;
    height: 350px;
    background-image: url(https://b.yzcdn.cn/public_files/e5cd97d81c852ae677cb7b5f7afcca7e.png);
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 95px 0 27px;
    box-sizing: border-box;
    position: relative;
    .avatar {
      position: absolute;
      width: 48px;
      height: 48px;
      top: 30px;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
    .close-icon {
      font-size: 32px;
      color: #ffffff;
      position: absolute;
      right: 0;
      top: -15px;
    }
    header {
      text-align: center;
      color: #754802;
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
    }
    .amount {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 206px;
      height: 117px;
      background-image: url(https://b.yzcdn.cn/public_files/f953d81edf82891e28046905945ed20c.png);
      background-size: cover;
      background-repeat: no-repeat;
      color: #ff4a00;
      font-size: 26px;
      font-weight: 500;

      .tag {
        display: flex;
        flex-direction: column;
        width: 16px;
        height: 30px;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #ffffff;
        background: rgba($color: #ff4a00, $alpha: 0.6);
        border-radius: 999px;
        margin-right: 4px;
        box-sizing: border-box;
      }
      .number {
        font-size: 44px;
        font-weight: 600;
      }
    }
    .button {
      background-image: linear-gradient(
        90deg,
        #ff6713 0%,
        #ff6713 0%,
        #ff551f 100%
      );
      border: none;
      width: 263px;
      .van-button__text {
        color: #ffffff;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
}
</style>
