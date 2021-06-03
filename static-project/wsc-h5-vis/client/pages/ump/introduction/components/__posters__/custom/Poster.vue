<template>
  <div class="introduce-poster">
    <img-wrap
      v-if="!rotate"
      :src="poster"
      :cover="false"
      width="100%"
      height="100%"
      class="introduce-poster-bg"
    />
    <div class="introduce-poster__bg" v-else>
      <img :src="poster" class="introduce-poster__blur" />
      <img
        :src="poster"
        class="introduce-poster__cover"
        :style="{
          width: `${width}}px`,
          height: `${height}px`,
          transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        }"
      />
    </div>
    <img src="https://img01.yzcdn.cn/public_files/7665d3dfa137ed0729491ac2c1b7f68b.png" class="study-tip" />
    <img src="https://b.yzcdn.cn/public_files/5d8e632c44b841d1dc58415946b476fc.png" class="up-tip" />
    <div class="introduce-poster-bottom">
      <div class="introduce-poster-bottom-user">
        <div class="user-info">
          <span class="user-name">{{ name }}</span> 邀请你扫码领取
        </div>
        <div class="reward-info">
          <div class="tip-text">
            {{ newStuRewardTipSimple }}
          </div>
          <img class="tip-img" src="https://img01.yzcdn.cn/public_files/1b47d37febbd6b4251d53fb3c93da416.png" />
        </div>
      </div>
      <div :class="['introduce-poster-bottom-qrcode', isWeapp ? 'is-wx' : '']">
        <img-wrap
          slot="icon"
          :src="qrCode"
          width="52px"
          height="52px"
          class="qrCode"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ImgWrap from '../components/img-wrap';

export default {
  name: 'intro-default-poster',
  props: {
    name: {
      type: String,
      default: '',
    },
    qrCode: {
      type: String,
      defualt: '',
    },
    poster: {
      type: String,
      default: '',
    },
    newStuRewardTipSimple: {
      type: String,
    },
    rotate: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    isWeapp: {
      type: Boolean,
    },
  },
  components: {
    ImgWrap,
  },
};
</script>

<style lang="scss" scoped>
.introduce-poster {
  position: relative;
  width: 240px;
  height: 330px;
  line-height: 14px;
  font-size: 14px;
  color: #fff;

  &-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &-bottom {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    bottom: 20px;
    left: 0;
    padding: 0 16px;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    &-user {
      flex: 1;
      overflow: hidden;
      margin-right: 14px;
      color: #fff;
      font-size: 12px;
      line-height: 16px;
      font-weight: 500;
      .user-info {
        margin-bottom: 3px;
        display: flex;
        align-items: center;
        flex-flow: row nowrap;
        white-space: nowrap;
        .user-name {
          display: inline-block;
          max-width: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
        }
      }
      .reward-info {
        display: flex;
        flex-flow: row nowrap;
        padding: 2px 4px 2px 12px;
        align-items: center;
        background: #ff630a;
        border-radius: 20px;
        .tip-text {
          line-height: 12px;
          font-size: 10px;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
        .tip-img {
          width: 24px;
          height: 24px;
        }
      }
    }

    &-qrcode {
      &.is-wx {
        display: flex;
        width: 56px;
        height: 56px;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
        background: #fff;
      }
    }
  }

  .study-tip {
    position: absolute;
    top: 57px;
    left: 7px;
    width: 79px;
    height: 52px;
  }

  .up-tip {
    position: absolute;
    top: 12px;
    right: 7px;
    width: 79px;
    height: 52px;
  }

  .introduce-poster__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    overflow: hidden;
    background-color: #fff;
  }

  .introduce-poster__blur,
  .introduce-poster__cover {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
  }

  .introduce-poster__cover {
    transform-origin: center center;
  }

  .introduce-poster__blur {
    width: 100%;
    height: 100%;
    filter: blur(14px);
  }
}
</style>
