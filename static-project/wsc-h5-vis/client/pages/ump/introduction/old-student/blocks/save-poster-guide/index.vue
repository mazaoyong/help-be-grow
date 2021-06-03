<template>
  <div class="save-poster">
    <div class="save-poster-hand">
      <img src="https://img01.yzcdn.cn/public_files/129a2218bbbbb628beb056fb62806532.png" />
    </div>
    <div class="save-poster-tip">
      长按保存海报 发送给好友
    </div>
  </div>
</template>

<script>
export default {
  name: 'save-poster-guide',
  data() {
    return {};
  },
  components: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
@keyframes swiper {
  0% {
    transform: translate3d(-5px, 10px, 0);
  }

  25% {
    transform: translate3d(5px, -10px, 0);
  }

  100% {
    transform: translate3d(5px, -10px, 0);
  }
}

@keyframes scale1 {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  24% {
    transform: scale(0.5);
    opacity: 0;
  }

  25% {
    transform: scale(0.5);
    opacity: 1;
  }

  75% {
    transform: scale(2);
    opacity: 0;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes scale2 {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  40% {
    transform: scale(0.5);
    opacity: 0;
  }

  41% {
    transform: scale(0.5);
    opacity: 1;
  }

  91% {
    transform: scale(2);
    opacity: 0;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.save-poster {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -50px;
  margin-top: 50px;
  display: inline-block;
  pointer-events: none;

  &-hand {
    position: absolute;
    top: -15px;
    width: 40px;
    height: 45px;

    img {
      position: relative;
      width: 100%;
      height: 100%;
      animation: swiper 4s infinite;
      z-index: 2;
    }

    &:before,
    &:after {
      position: absolute;
      top: -15px;
      right: -10px;
      display: block;
      content: '';
      width: 15px;
      height: 15px;
      border: 1px solid #ff5100;
      border-radius: 50%;
      opacity: 0;
      animation: scale1 4s infinite;
    }

    &:after {
      opacity: 0;
      animation: scale2 4s infinite;
    }
  }

  &-tip {
    width: 191px;
    height: 31px;
    box-sizing: border-box;
    padding: 0 5px 0 35px;
    color: #fff;
    line-height: 34px;
    font-size: 13px;
    background-image: url('https://img01.yzcdn.cn/public_files/eeb82d4aa50a86ef610b78f8ebc03823.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
}
</style>
