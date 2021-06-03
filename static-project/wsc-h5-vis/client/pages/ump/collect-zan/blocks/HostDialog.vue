<template>
  <van-popup v-model="show" class="block-host-dialog">
    <div class="dialog">
      <van-icon
        name="cross"
        size="18"
        color="#C8C9CC"
        @click="close"
      />

      <div v-if="recordList && recordList.length" class="dialog__records">
        <div class="dialog__records__avatars">
          <img
            v-for="record in recordList.slice(0, 2)"
            :key="record.id"
            class="dialog__records__avatar"
            :src="record.avatar"
          >
        </div>

        <div class="dialog__records__text">
          {{ recordsText }}
        </div>
      </div>

      <div class="dialog__progress" v-html="progressText" />

      <div class="dialog__reward">
        <div v-if="isCourseReward" class="dialog__goods-card">
          <img-wrap
            width="120px"
            height="69px"
            :fullfill="`!small.jpg`"
            :src="courseCover"
            :cover="false"
          />
          <div class="dialog__goods-info">
            <div class="dialog__goods-title">
              {{ courseName }}
            </div>
            <div class="dialog__goods-price"><span>免费</span> 价格：{{ coursePrice }}</div>
          </div>
        </div>

        <cap-coupon
          v-else
          :coupon="coupon"
          :discount-prefix="coupon.discountPrefix"
          display-type="flat"
          hide-btn-wrap
        />
      </div>

      <div class="dialog__action" @click="$store.dispatch('inviteFriend')">
        继续邀请
      </div>

      <div class="dialog__countdown">
        <van-count-down millisecond :time="countDownTime" :format="countDownFormat" />
        <span>后结束</span>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { Popup as VanPopup, Icon as VanIcon, CountDown as VanCountDown } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import CapCoupon from '@youzan/captain/es/coupon';

export default {
  name: 'block-host-dialog',

  components: {
    VanPopup,
    VanIcon,
    VanCountDown,
    ImgWrap,
    CapCoupon,
  },

  data() {
    return {
      show: false,
    };
  },

  computed: {
    ...mapState([
      'showHostDialog',
    ]),
    ...mapGetters([
      'courseCover',
      'courseName',
      'coursePrice',
      'recordList',
      'remainCount',
      'countDownTime',
      'countDownFormat',
      'isCourseReward',
      'isCouponReward',
      'coupon',
    ]),

    recordsText() {
      return this.recordList.length > 1 ? `等${this.recordList.length}人已为你助力` : '已为你助力';
    },

    progressText() {
      const remainText = `再邀 <span>${this.remainCount}</span> 位好友，即可`;

      return `${remainText}${
        this.isCourseReward
          ? '<span>免费领课程</span>'
          : '领取'
      }`;
    },
  },

  watch: {
    showHostDialog(showHostDialog) {
      if (showHostDialog) {
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
@import 'mixins';

.block-host-dialog {
  background: transparent;

  .dialog {
    position: relative;
    width: 311px;
    padding: 24px 18px;
    text-align: center;
    background: #fff;
    border-radius: 8px;
    box-sizing: border-box;

    .van-icon-cross {
      position: absolute;
      top: 10px;
      right: 10px;
    }

    &__records {
      display: inline-block;

      &__avatars {
        display: inline-block;
        vertical-align: middle;
      }

      &__avatar {
        width: 26px;
        height: 26px;
        margin-left: 4px;
        border-radius: 50%;

        &:first-child {
          margin-left: 0;
        }
      }

      &__text {
        display: inline-block;
        margin-left: 12px;
        font-size: 14px;
        line-height: 18px;
        color: #646566;
        vertical-align: middle;
      }
    }

    &__progress {
      margin-top: 16px;
      font-size: 18px;
      font-weight: 500;
      line-height: 24px;
      color: #323233;
      text-align: center;

      span {
        color: #fa1919;
      }
    }

    &__reward {
      position: relative;
      margin-top: 24px;
      background: #fff6f6;
      border-radius: 4px;

      &::after {
        border-radius: 4px;

        @include border-retina(surround, #FEC9C9);
      }

      .cap-couponbox {
        text-align: left;

        &__flat {
          border: none;
        }
      }
    }

    &__action {
      height: 44px;
      margin: 24px 18px 0;
      font-size: 18px;
      font-weight: 500;
      line-height: 44px;
      color: #fff;
      text-align: center;
      background: #fa1919;
      border-radius: 24px;
    }

    &__countdown {
      height: 20px;
      margin-top: 16px;
      font-size: 12px;
      line-height: 20px;

      .van-count-down {
        display: inline-block;
        font-weight: 500;
        vertical-align: middle;
      }

      span {
        display: inline-block;
        margin-left: 2px;
        vertical-align: middle;
      }
    }

    &__goods-card {
      display: flex;
      padding: 8px;
      background: #fff6f6;
      border: 0 solid #fec9c9;
      border-radius: 4px;
      box-sizing: border-box;

      .imgWrap {
        overflow: hidden;
        border-radius: 2px;
        flex: 0 0 auto;
      }
    }

    &__goods-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 8px;
      text-align: left;
    }

    &__goods-title {
      font-size: 12px;
      line-height: 16px;
      color: #323233;

      @include multi-ellipsis(2);
    }

    &__goods-price {
      font-size: 12px;
      line-height: 16px;
      color: #969799;

      span {
        font-weight: 500;
        color: #fa1919;
      }
    }
  }
}

.is-android {
  .dialog__action {
    padding-top: 2px;
  }
}
</style>
