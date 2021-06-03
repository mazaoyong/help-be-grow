<template>
  <van-popup
    v-model="show"
    class="get-tuition-popup"
  >
    <div class="container">
      <header>
        <h1>恭喜你成功获得学费</h1>
        <h2>学费可用来抵扣课程费用</h2>
      </header>
      <section class="amount">
        <span>
          ¥
          <span class="number">{{ amount }}</span>
        </span>
      </section>
      <footer>
        <van-button class="button" round @click="onClickActionButton">
          开心收下
        </van-button>
      </footer>
    </div>
  </van-popup>
</template>
<script >
import Vue from 'vue';
import { Popup as VanPopup, Button as VanButton } from 'vant';

export default Vue.extend({
  name: 'popup-guide',
  components: {
    VanPopup,
    VanButton,
  },
  computed: {
    show: {
      get() {
        return this.$store.state.isPopupGuideVisible;
      },
      set(value) {
        this.$store.commit('setIsPopupGuideVisible', value);
      },
    },

    amount() {
      return this.$store.getters.freeTuition.formattedAmount;
    },
  },
  methods: {
    onClickActionButton() {
      this.show = false;
      this.$store.dispatch('join');
    },
  },
});
</script>

<style lang="scss" scoped>
.get-tuition-popup {
  background-color: transparent;

  .container {
    width: 311px;
    height: 360px;
    background-image: url(https://b.yzcdn.cn/public_files/e2c0e77970f70838291bc87735b931cf.png);
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 95px 0 27px;
    box-sizing: border-box;
    header {
      text-align: center;
      color: #754802;
      h1 {
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
      }
      h2 {
        margin-top: 4px;
        opacity: 0.6;
        font-size: 13px;
        line-height: 19px;
      }
    }
    .amount {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 172px;
      height: 97.7px;
      background-image: url(https://b.yzcdn.cn/public_files/f953d81edf82891e28046905945ed20c.png);
      background-size: cover;
      background-repeat: no-repeat;
      color: #ff4a00;
      font-size: 26px;
      font-weight: 500;
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
