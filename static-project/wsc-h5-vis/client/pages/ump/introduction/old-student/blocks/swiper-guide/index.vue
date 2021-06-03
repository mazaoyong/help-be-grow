<template>
  <div class="swiper-guide-overlay" v-if="show">
    <div class="swiper-guide">
      <div class="swiper-guide-center">
        <div class="swiper-hand">
          <img src="https://img01.yzcdn.cn/public_files/8c7d202d0518864b6d5768525db87862.png" />
        </div>
        <div class="swiper-tip">
          左滑即可制作你的专属海报
        </div>
      </div>
      <div class="swiper-guide-bottom">
        <div class="btn" @click="onClose">
          我知道啦
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'swiper-guide',
  data() {
    return {
      show: false,
      storageKey: 'INTRODUCTION_USER_SWIPER_GUIDE',
    };
  },
  components: {},
  mounted() {
    const hasData = localStorage.getItem(this.storageKey);
    this.show = !hasData;
  },
  methods: {
    onClose() {
      localStorage.setItem(this.storageKey, '1');
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes swiper {
  0% {
    transform: translateX(150px);
  }

  70% {
    transform: translateX(0px);
    opacity: 1;
  }

  90% {
    transform: translateX(0px);
    opacity: 0;
  }

  100% {
    transform: translateX(0px);
    opacity: 0;
  }
}

.swiper-guide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 2;
  }

  &-center {
    .swiper-hand {
      position: relative;
      width: 85px;
      height: 95px;
      margin-bottom: 10px;
      animation: swiper 2s infinite;

      img {
        width: 100%;
        height: 100%;
      }

      &:before {
        position: absolute;
        content: '';
        top: 0;
        right: -45px;
        display: block;
        width: 120px;
        height: 20px;
        z-index: -1;
        background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0) 75%, rgba(255, 255, 255, 0) 100%);
      }
    }

    .swiper-tip {
      width: 193px;
      height: 31px;
      font-size: 13px;
      color: #fff;
      line-height: 31px;
      text-align: center;
      background-image: url('https://b.yzcdn.cn/public_files/5590e28573acf1b3a2d834c9a56fe480.png');
      background-size: contain;
      background-repeat: no-repeat;
    }
  }

  &-bottom {
    position: fixed;
    bottom: 75px;
    left: 0;
    width: 100%;

    .btn {
      margin: 0 37px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      font-size: 16px;
      color: #323233;
      border-radius: 32px;
      background: #fff;
    }
  }
}
</style>
