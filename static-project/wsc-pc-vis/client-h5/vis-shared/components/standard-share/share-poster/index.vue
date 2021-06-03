<template>
  <div
    v-show="isPosterOpen"
    :lock-scroll="false"
    class="poster-overlay"
    @click="isPosterOpen = false"
  >
    <div
      class="poster-container"
      @click.stop
    >
      <van-icon
        v-if="posterUrl"
        name="close"
        color="#fff"
        size="24"
        @click="isPosterOpen = false"
      />
      <vis-img-wrap
        v-if="posterUrl"
        width="100%"
        height="100%"
        :src="posterUrl"
      />
      <van-loading
        v-else
        type="spinner"
      />
    </div>
    <p
      v-if="posterUrl"
      class="tip"
    >
      长按保存海报，分享给好友
    </p>
  </div>
</template>
<script>
import { Loading, Toast, Overlay, Icon } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
export default {
  name: 'share-poster',

  components: {
    'van-loading': Loading,
    'vis-img-wrap': ImgWrap,
    'van-overlay': Overlay,
    'van-icon': Icon,
  },

  props: {
    getPoster: {
      type: Function,
      default: () => {},
      required: true,
    },
  },

  data() {
    return {
      posterUrl: '',
      isPosterOpen: true,
    };
  },

  created() {
    this.getPoster().then(url => {
      this.posterUrl = url;
    })
      .catch((e) => {
        Toast(e);
      });
  },

};
</script>
<style lang="scss" scoped>
.poster-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, .7);
}

.poster-container {
  position: relative;
  width: 90%;
  padding-bottom: 75px;
  margin: 70px auto 0;
  border-radius: 8px;
  box-sizing: border-box;

  & > .van-icon {
    position: absolute;
    top: -40px;
    right: 0;
    display: block;
    width: 24px;
    height: 24px;
  }
}

.van-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.tip {
  position: fixed;
  bottom: 32px;
  left: 50%;
  width: auto;
  padding: 0 16px;
  font-size: 12px;
  line-height: 28px;
  color: #fff;
  white-space: nowrap;
  background-color: rgba(0, 0, 0, .7);
  border-radius: 14px;
  transform: translateX(-50%);
  box-sizing: border-box;
}
</style>
