<template>
  <div class="normal-share" @click="closeNormalShare">
    <van-popup v-model="showNormal">
      <div class="normal-share__image" />
      <p class="normal-share__text">
        快戳右上角，分享给好友
      </p>
    </van-popup>
  </div>
</template>

<script>
import { Popup } from 'vant';

export default {
  name: 'normal-share',

  components: {
    'van-popup': Popup,
  },

  props: {
    showNormal: Boolean,
  },

  methods: {
    closeNormalShare() {
      this.$emit('closeNormalShare');
    },
  },
};
</script>

<style>
  .normal-share {
    .van-popup {
      top: 0;
      right: 0;
      left: 0;
      width: 100%;
      background: transparent;
      transform: none;
    }

    &__image {
      height: 230px;
      margin-top: 20px;
      margin-right: 20px;
      background-image: url(https://img01.yzcdn.cn/public_files/2018/04/08/share-guide-book@2x.png);
      background-position: right;
      background-repeat: no-repeat;
      background-size: contain;
    }

    &__text {
      margin-top: 30px;
      font-size: 14px;
      color: #fff;
      text-align: center;
    }
  }
</style>
