<template>
  <div class="custom-poster">
    <div :class="['custom-poster-upload']">
      <img-uploader :canDelete="false" />
      <div class="custom-poster-upload-cover"></div>
    </div>
    <div class="custom-poster-bottom">
      <div class="custom-poster-bottom-user">
        <div class="user-info">
          <span class="user-name">{{ userName }}</span> 邀请你扫码领取
        </div>
        <div class="reward-info">
          <div class="tip-text">
            <span>{{ newStuRewardTip }}</span>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <div class="custom-poster-bottom-qrcode">
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
import { ImgUploader, ImgWrap } from '@youzan/vis-ui';
import { Icon } from 'vant';

export default {
  name: 'custom-poster',
  data() {
    return {
      loading: false,
      meta: {},
    };
  },
  props: {
    qrCode: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      default: '',
    },
    newStuRewardTip: {
      type: String,
    },
  },
  components: {
    ImgWrap,
    ImgUploader,
    'van-icon': Icon,
  },
};
</script>

<style lang="scss" scoped>
.custom-poster {
  position: absolute;
  width: 100%;
  height: 100%;
  &-upload {
    position: absolute;
    top: 35%;
    width: 100%;
    display: flex;
    justify-content: center;
    .visImgUploader {
      opacity: 0;
    }
    &-cover {
      position: absolute;
      width: 40%;
      padding-bottom: 40%;
      background: rgba(0, 0, 0, 0.6);
      border: 1px dashed #fff;
      pointer-events: none;

      &:before {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        content: "+";
        font-size: 24px;
        font-weight: 500;
        color: #fff;
      }
    }
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
        padding-left: 12px;
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
        padding: 2px 8px 2px 12px;
        align-items: center;
        background: #ff630a;
        border-radius: 20px;
        font-size: 10px;
        .tip-text {
          display: inline-flex;
          align-items: center;
          justify-content: space-between;

          span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
          }
        }
      }
    }
  }
}
</style>
