<template>
  <van-popup v-model="show" class="block-guest-dialog">
    <div class="dialog">
      <div class="dialog__header">
        <van-icon
          name="close"
          color="#fff"
          size="24"
          @click="close"
        />
      </div>
      <div class="dialog__content">
        <div class="dialog__reward">
          <div v-if="isCourseReward">
            <p>0 元免费得</p>
            <p>{{ courseName }}</p>
          </div>
          <div v-else>
            <p class="dialog__reward__coupon-text" v-html="couponText"></p>
            <p>{{ courseName }}可用</p>
          </div>
        </div>
        <div class="dialog__actions">
          <div class="dialog__countdown">
            <van-count-down millisecond :time="countDownTime" :format="countDownFormat" />
            <span>后结束</span>
          </div>

          <div class="dialog__main-btn" @click="$store.dispatch('supportFriend')">
            为好友助力
          </div>

          <div class="dialog__vice-btn" @click="$store.dispatch('createZan')">
            我也要奖励
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { Popup as VanPopup, Icon as VanIcon, CountDown as VanCountDown } from 'vant';

export default {
  name: 'block-guest-dialog',

  components: {
    VanPopup,
    VanIcon,
    VanCountDown,
  },

  data() {
    return {
      show: false,
    };
  },

  computed: {
    ...mapState([
      'showGuestDialog',
    ]),
    ...mapGetters([
      'countDownTime',
      'countDownFormat',
      'isCourseReward',
      'courseName',
      'couponText',
    ]),
  },

  watch: {
    showGuestDialog(showGuestDialog) {
      if (showGuestDialog) {
        this.show = true;
      }
    },
  },

  methods: {
    close() {
      this.show = false;
    },
  },
};
</script>

<style lang="scss">
.block-guest-dialog {
  overflow-y: visible;
  background: transparent;

  .dialog {
    position: relative;
    width: 363px;
    height: 378px;
    margin-top: -40px;
    text-align: center;
    background: url(https://b.yzcdn.cn/public_files/6056ad6cf12b2f9831dac914dddcd062.png) no-repeat;
    background-position: center bottom;
    background-size: 363px 338px;

    .van-icon-close {
      position: absolute;
      top: 0;
      right: 25px;
    }

    &__header {
      height: 40px;
    }

    &__content {}

    &__reward {
      display: flex;
      width: 260px;
      height: 150px;
      margin: 0 auto;
      align-items: center;
      justify-content: center;

      p {
        &:nth-child(1) {
          font-size: 20px;
          font-weight: 500;
          line-height: 24px;
          color: #fa1919;
        }

        &:nth-child(2) {
          margin-top: 4px;
          font-size: 14px;
          line-height: 18px;
          color: #fa1919;
        }
      }

      &__coupon-text {
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          margin: 0 2px;
          font-size: 24px;
          font-weight: 500;
          line-height: 30px;
        }
      }
    }

    &__actions {
      height: 163px;
    }

    &__countdown {
      height: 20px;
      margin-top: 16px;
      font-size: 12px;
      line-height: 20px;
      color: #fff;

      .van-count-down {
        display: inline-block;
        font-weight: 500;
        color: #fff;
        vertical-align: middle;
      }

      span {
        display: inline-block;
        margin-left: 2px;
        vertical-align: middle;
      }
    }

    &__main-btn {
      width: 240px;
      height: 44px;
      margin: 16px auto 0;
      font-size: 18px;
      font-weight: 500;
      line-height: 44px;
      color: #ef1b00;
      text-align: center;
      background-image: linear-gradient(0deg, #ffbb4c 0%, #ffdc76 56%, #ffeac4 96%, #ffdb6d 100%);
      border-radius: 24px;
      box-shadow: 0 3px 3px 0 rgba(202, 7, 0, .22), inset 0 0 2px 0 rgba(255, 211, 164, .8);
    }

    &__vice-btn {
      display: inline-block;
      height: 20px;
      margin-top: 16px;
      font-size: 14px;
      line-height: 20px;
      color: #fff;
    }
  }
}
</style>
