<template>
  <div class="introduce-poster">
    <img
      :src="poster"
      width="100%"
      height="100%"
      class="introduce-poster-bg"
    />
    <div class="introduce-poster-user">
      <img :src="avatar" alt="头像" class="user-avatar" />
      <div class="user-name">{{ name }}</div>
    </div>
    <div class="introduce-poster-text">“{{ newStuRewardTip }}”</div>
    <div class="introduce-poster-footer">
      <div class="shop-info">
        <span class="text">分享自 {{ shopName }}</span>
      </div>
      <div class="introduce-poster-footer-qrcode">
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
    avatar: {
      type: String,
      default: '',
    },
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
    shopName: {
      type: String,
      default: '',
    },
    newStuRewardTip: {
      type: String,
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

  &-user {
    position: absolute;
    top: 106px;
    left: 16px;
    display: inline-flex;
    align-items: center;

    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }

    .user-name {
      margin-left: 6px;
      font-size: 11px;
      color: #323233;
      font-weight: 500;
    }
  }

  &-text {
    position: absolute;
    top: 142px;
    left: 16px;
    width: 204px;
    font-size: 16px;
    line-height: 22px;
    color: #181947;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }

  &-footer {
    position: absolute;
    bottom: 24px;
    left: 18px;
    right: 18px;
    display: inline-flex;
    align-items: flex-start;
    justify-content: space-between;

    .shop-info {
      margin-top: 28px;
      margin-left: 8px;
      width: 190px;
      white-space: pre-wrap;
      font-size: 10px;
      line-height: 12px;
      color: #969799;
      .text {
        display: inline-block;
        transform: scale(0.9);
        transform-origin: 0% 0%;
      }
    }
  }
}
</style>
