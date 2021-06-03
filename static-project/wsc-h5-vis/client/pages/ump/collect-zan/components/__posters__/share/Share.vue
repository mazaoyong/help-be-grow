<template>
  <div class="share">
    <div class="share__user">
      <img :src="userAvatar">
      <span>{{ username }} 请你助力</span>
    </div>

    <div class="share__reward">
      <div v-if="isCourseReward">
        <p>0 元免费得</p>
        <p>{{ courseName }}</p>
      </div>
      <div v-else>
        <p class="share__reward__coupon-text" v-html="couponText" />
        <p>{{ courseName }}可用</p>
      </div>
    </div>

    <div
      class="share__button"
    >
      为我助力
    </div>
  </div>
</template>

<script>
export default {
  name: 'share',

  props: {
    username: {
      type: String,
      default: '',
    },
    userAvatar: {
      type: String,
      default: '',
    },
    isCourseReward: {
      type: Boolean,
      default: true,
    },
    courseName: {
      type: String,
      default: '',
    },
    couponText: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
@import '../index';

.share {
  position: relative;
  width: 500px;
  height: 400px;
  background: url(~assets/images/ump/collect-zan/bg-share.jpg) no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;

  &__user {
    position: absolute;
    top: 32px;
    left: 16px;
    display: flex;
    padding: 8px;
    background: #fff;
    border-radius: 32px;

    img {
      flex: 0 0 auto;
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }

    span {
      display: inline-block;
      height: 48px;
      margin-left: 8px;
      font-size: 28px;
      font-weight: 500;
      line-height: 48px;
      color: #323233;
    }
  }

  &__reward {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 220px;
    text-align: center;

    p {
      &:nth-child(1) {
        margin-top: 50px;
        font-size: 40px;
        font-weight: 500;
        line-height: 48px;
        color: #fa1919;
      }

      &:nth-child(2) {
        max-width: 368px;
        margin-top: 8px;
        overflow: hidden;
        font-size: 24px;
        line-height: 32px;
        color: #fa1919;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &__coupon-text {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__button {
    width: 400px;
    height: 88px;
    margin: 44px auto 0;
    font-size: 36px;
    font-weight: 500;
    line-height: 88px;
    color: #ef1b00;
    text-align: center;
    background-image: linear-gradient(0deg, #ffbb4c 0%, #ffdc76 56%, #ffeac4 96%, #ffdb6d 100%);
    border-radius: 48px;
    box-shadow: 0 6px 6px 0 rgba(202, 7, 0, .22), inset 0 0 4px 0 rgba(255, 211, 164, .8);
  }
}
</style>
