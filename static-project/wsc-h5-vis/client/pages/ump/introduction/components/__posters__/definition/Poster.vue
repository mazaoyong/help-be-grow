<template>
  <div class="introduce-poster">
    <img-wrap
      :src="poster"
      :cover="false"
      width="100%"
      height="100%"
      class="introduce-poster-bg"
    />
    <div class="introduce-poster-footer">
      <div class="introduce-poster-footer-user">
        <img :src="avatar" alt="头像" class="user-avatar" />
        <div class="user-info">
          <div class="user-name">
            <span class="name-span">{{ name }}</span> 邀请你
          </div>
          <div class="tip-text">长按识别二维码参与活动</div>
        </div>
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
  name: 'intro-custom-poster',
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

  &-footer {
    position: absolute;
    bottom: 12px;
    left: 12px;
    width: 215px;
    height: 71px;
    padding: 0 8px;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    background: rgb(255, 255, 255);
    border-radius: 8px;

    &-user {
      flex: 1;
      display: inline-flex;
      align-items: center;
      height: 30px;

      .user-avatar {
        width: 29px;
        height: 29px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 8px;
      }

      .user-info {
        width: 110px;
        height: 100%;

        .user-name {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          height: 16px;
          color: #323233;
          font-size: 11px;
          font-weight: 500;

          .name-span {
            display: inline-block;
            max-width: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .tip-text {
          transform: scale(0.8);
          white-space: nowrap;
          transform-origin: 0 50%;
          padding-right: 8px;
          color: #969799;
          font-size: 10px;
          line-height: 12px;
        }
      }
    }
  }
}
</style>
