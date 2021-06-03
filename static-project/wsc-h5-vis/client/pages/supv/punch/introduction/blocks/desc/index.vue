<template>
  <div class="m-intro-header">
    <div class="m-header-desc">
      <div class="m-desc-box">
        <div :class="['u-status', proceedStatusText === '已结束' ? 'u-status-end': '' ]">
          <span>{{ proceedStatusText }}</span>
        </div>
        <div class="u-title">
          {{ name }}
        </div>
        <div class="u-time">
          {{ startAtFormat }}至{{ endAtFormat }}
        </div>
      </div>
    </div>
    <img-wrap
      class="m-header-img"
      :src="coverUrl"
      :cover="false"
      width="100%"
      height="100%"
      backgroundColor="transparent"
      fullfill="!375x0.jpg"
    />
  </div>
</template>

<script>
import { ImgWrap } from '@youzan/vis-ui';

export default {
  name: 'vis-desc',
  components: {
    'img-wrap': ImgWrap,
  },
  props: {
    proceedStatusText: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    startAtFormat: {
      type: String,
      default: '',
    },
    endAtFormat: {
      type: String,
      default: '',
    },
    coverUrl: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.m-intro-header {
  position: relative;
  width: 100%;
  height: 211px;
}
.m-header-desc {
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  // width: 750rpx;
  width: 100%;
  height: 211px;
  background-color: rgba(0, 0, 0, .6);
}
.m-header-desc .m-desc-box {
  padding: 0 20px 20px;
  position: absolute;
  bottom: 10px;
  left: 0;
  box-sizing: border-box;
  width: 100vw;
}
.m-header-desc .u-status {
  width: 50px;
  height: 19px;
  line-height: 18px;
  font-size: 12px;
  text-align: center;
  color: #fff;
  border-radius: 100px;
  background-color: #00b389;
}

.m-header-desc .u-status > span {
  vertical-align: middle;
}

.m-header-desc .u-status-end {
  box-sizing: border-box;
  border-radius: 1px solid #979797;
  color: #fff;
  background-color: rgba(255, 255, 255, .6);
}
.m-header-desc .u-title {
  margin: 10px 0 10px;
  max-height: 64px;
  line-height: 32px;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.m-header-desc .u-time {
  font-size: 13px;
  line-height: 17px;
  color: #999;
}
.m-header-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 211px;
}
</style>

<style>
.m-header-img img {
  width: 100%;
  height: 211px;
}
</style>
