<template>
  <div class="custom">
    <img-wrap
      width="300px"
      height="418px"
      :fullfill="`!large.jpg`"
      :src="backgroundImage"
      :cover="false"
      :disable-lazyload="true"
    />
    <section class="card">
      <user :avatar="avatar" :name="name" />
      <div class="divider" />
      <message :qr-code="qrCode" :shop-name="shopName" direction="right" />
    </section>
  </div>
</template>

<script>
import { DEFAULT_AVATAR, DEFAULT_USERNAME } from '../../../constants';
import User from '../components/User.vue';
import Message from '../components/Message.vue';
import { ImgWrap } from '@youzan/vis-ui';
export default {
  components: {
    User,
    Message,
    ImgWrap,
  },
  props: {
    avatar: {
      type: String,
      default: DEFAULT_AVATAR,
    },

    name: {
      type: String,
      default: DEFAULT_USERNAME,
    },
    shopName: {
      type: String,
      default: '',
    },

    qrCode: {
      type: String,
      default: '',
    },

    maxTuition: {
      type: Number,
      default: 100,
    },

    backgroundImage: {
      type: String,
      default:
        'https://img01.yzcdn.cn/upload_files/2020/09/24/FhDWCE5IY5risVPZahJMOcyu8uFD.png',
    },
  },
};
</script>

<style lang="scss" scoped>
.custom {
  position: relative;
  width: 300px;
  height: 418px;
  overflow: hidden;
  background-size: 100%;
  border-radius: 8px;

  .card {
    position: absolute;
    right: 16px;
    bottom: 16px;
    left: 16px;
    width: 268px;
    padding: 12px 16px;
    background: #fff;
    border-radius: 8px;
    box-sizing: border-box;

    .divider {
      width: 100%;
      height: 1px;
      margin: 12px 0;
      background: #ebedf0;
    }
  }
}
</style>
