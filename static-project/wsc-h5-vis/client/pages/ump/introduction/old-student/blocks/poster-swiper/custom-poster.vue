<template>
  <div class="custom-poster">
    <cover :cover-url="previewUrl" @size="getCoverSize" />
    <img src="https://img01.yzcdn.cn/public_files/7665d3dfa137ed0729491ac2c1b7f68b.png" class="study" />
    <img src="https://img01.yzcdn.cn/public_files/5d8e632c44b841d1dc58415946b476fc.png" class="up" />
    <div :class="['custom-poster-upload', uploadUrl ? 'change' : '']">
      <img-uploader @onChange="onImageUpload" :canDelete="false" />
      <div class="custom-poster-upload-cover"></div>
    </div>
    <div class="custom-poster-bottom">
      <div class="custom-poster-bottom-user">
        <div class="user-info">
          <span class="user-name">{{ userName }}</span> 邀请你扫码领取
        </div>
        <div class="reward-info">
          <div class="tip-text">
            <div class="text">{{ newStuRewardTip }}</div>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <div :class="['custom-poster-bottom-qrcode', isWeapp ? 'is-wx' : '']">
        <img-wrap
          slot="icon"
          :src="qrCode"
          width="52px"
          height="52px"
          class="qrCode"
        />
      </div>
    </div>
    <van-loading v-show="loading" size="60px" class="custom-poster-loading" />
  </div>
</template>

<script>
import { ImgUploader, ImgWrap } from '@youzan/vis-ui';
import { Loading, Icon } from 'vant';
import compressImg from '@/shared/common/compress-img';
import cover from './cover';

const { miniprogram = {} } = window._global || {};

export default {
  name: 'custom-poster',
  data() {
    return {
      uploadUrl: '',
      previewUrl: '',
      loading: false,
      meta: {},
      isWeapp: miniprogram.isWeapp,
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
  watch: {
    uploadUrl(url) {
      this.$emit('upload-change', url, this.meta);
    },
  },
  components: {
    cover,
    ImgWrap,
    ImgUploader,
    'van-loading': Loading,
    'van-icon': Icon,
  },
  methods: {
    getCoverSize(size) {
      const orientation = this.meta.orientation;
      let { width, height } = size || {};
      let posterWidth = 240;
      let posterHeight = 330;
      let whScale = width / height;
      if (
        (width <= posterWidth && height <= posterHeight && whScale <= 1) ||
        (width <= posterWidth && height > posterHeight) ||
        (width > posterWidth && height > posterHeight && whScale <= 1)
      ) {
        height = posterHeight;
        width = posterHeight * whScale;
      } else {
        width = posterWidth;
        height = posterHeight;
      }
      let actualWidth = width;
      let actualHeight = height;
      let rotate = 0;
      switch (orientation) {
        case 'Right-top':
          actualWidth = height;
          actualHeight = width;
          rotate = 90;
          break;
        case 'Bottom-right':
          rotate = 180;
          break;
        case 'Left-bottom':
          actualWidth = height;
          actualHeight = width;
          rotate = 270;
          break;
        default:
          break;
      }
      this.meta = Object.assign(this.meta, {
        width: actualWidth,
        height: actualHeight,
        rotate,
      });
      this.uploadUrl = this.previewUrl;
    },
    onImageUpload(file) {
      this.loading = true;
      if (Array.isArray(file) && file.length) {
        const meta = JSON.parse(file[0].meta) || {};
        this.meta.orientation = meta.orientation || 'Top-left';
        compressImg(file[0].attachment_file)
          .then((compressFile) => {
            this.previewUrl = compressFile.name;
          })
          .catch(() => {
            this.previewUrl = file[0].attachment_url;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
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
        content: '+';
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
          flex: 1;

          .text {
            padding-right: 5px;
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

  &-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .study {
    position: absolute;
    top: 57px;
    left: 7px;
    width: 79px;
    height: 52px;
  }

  .up {
    position: absolute;
    top: 12px;
    right: 7px;
    width: 79px;
    height: 52px;
  }
}
</style>
