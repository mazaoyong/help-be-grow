<template>
  <div class="ailey">
    <img class="ailey__avatar" :src="userAvatar">
    <div class="ailey__username">
      {{ username }}
    </div>
    <p class="ailey__text">
      “我很想学习这门课程，需要你的助力！”
    </p>
    <p class="ailey__reward-text" v-html="rewardText" />
    <p class="ailey__limit-text">
      {{ limitText }}
    </p>
    <div class="ailey__button-text">
      为我助力
    </div>
    <share-qrcode :qrcode="qrcode" />
  </div>
</template>

<script>
import ShareQrcode from '../components/ShareQrcode';

export default {
  components: {
    ShareQrcode,
  },

  props: {
    username: {
      type: String,
      default: '',
    },
    userAvatar: {
      type: String,
      default: 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png',
    },
    rewardText: {
      type: String,
      default: '',
    },
    limitText: {
      type: String,
      default: '',
    },
    qrcode: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
@import '../index';

.ailey {
  position: relative;
  width: 300px;
  height: 529px;
  overflow: hidden;
  background: url(https://b.yzcdn.cn/public_files/e7b5b358dd05ef41ca4aa6183b3223f4.png);
  background-size: 300px 529px;

  &__avatar {
    display: block;
    width: 36px;
    height: 36px;
    margin: 24px auto 0;
    border-radius: 50%;
  }

  &__username {
    height: 20px;
    margin-top: 4px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #fff;
    text-align: center;
  }

  &__text {
    margin-top: 4px;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    color: #fff;
    text-align: center;
  }

  &__reward-text {
    margin: 64px 50px 0;
    overflow: hidden;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    color: #fa1919;
    text-align: center;
    // text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__limit-text {
    margin: 4px 50px 0;
    font-size: 12px;
    line-height: 16px;
    color: #fa1919;
    text-align: center;
  }

  &__button-text {
    position: absolute;
    top: 310px;
    left: 50%;
    font-size: 18px;
    font-weight: 500;
    line-height: 20px;
    color: #fa1919;
    text-align: center;
    transform: translateX(-50%);
  }
}
</style>
