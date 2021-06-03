<template>
  <div class="share">
    <section class="header">
      <img class="avatar" :src="avatar" alt="">
      <span class="name">{{ name }} 请你帮忙</span>
    </section>
    <section class="amount" :style="{fontSize: `${amountFontSize}px`}">
      {{ maxTuition }}
    </section>
  </div>
</template>

<script>
import { DEFAULT_AVATAR, DEFAULT_USERNAME } from '../../../constants';
export default {

  props: {
    avatar: {
      type: String,
      default: DEFAULT_AVATAR,
    },

    name: {
      type: String,
      default: DEFAULT_USERNAME,
    },

    maxTuition: {
      type: Number,
      default: 100,
    },
  },

  computed: {
    amountFontSize() {
      const amountStr = String(this.maxTuition).replace('.', '');
      switch (amountStr.length) {
        case 7:
          return 26;
        case 6:
          return 30;
        case 5:
          return 36;
        default:
          return 44;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.share {
  width: 250px;
  height: 200px;

  background-image: url(https://b.yzcdn.cn/public_files/9259693396ace821f5c244b11f6dfd29.png);
  background-size: 100%;

  position: relative;
  border-radius: 8px;
  overflow: hidden;
  .header {
    background: #ffffff;
    position: absolute;
    left: 8px;
    top: 16px;
    display: flex;
    align-items: center;
    border-radius: 16px;
    padding: 4px 8px 4px 4px;
    box-sizing: border-box;
    .avatar {
      height: 24px;
      width: 24px;
      border-radius: 50%;
    }
    .name {
      font-size: 14px;
      color: #323233;
      line-height: 100%;
      font-weight: 500;
      margin-left: 4px;
    }
  }
  .amount {
    left: 0;
    right: 0;
    top: 57px;
    position: absolute;
    text-align: center;
    font-size: 44px;
    color: #FF4A00;
    line-height: 44px;
    font-weight: 500;
  }
}
</style>

<style>
body {
  background: transparent;
}
</style>
