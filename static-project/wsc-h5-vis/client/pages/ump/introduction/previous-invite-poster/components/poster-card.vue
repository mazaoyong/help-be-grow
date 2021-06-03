<!-- 海报绘制 -->
<template>
  <div class="invite-poster__card">
    <vis-img-wrap
      :src="isCustom ? posterBg : previewUrl"
      :loading-img="posterBg"
      :cover="false"
      :class="{'no-save': !isSussess}"
      width="100%"
      height="100%"
      :disable-fullfill="true"
      class="invite-poster__card-preview"
    />

    <div v-show="isCustom" class="invite-poster__card-custom">
      <div class="invite-poster__card-header">
        <van-cell
          :title="posterInfo.name"
          :label="posterInfo.label"
          center
        >
          <vis-img-wrap
            slot="icon"
            :src="posterInfo.avatar"
            width="32px"
            height="32px"
            class="avatar"
          />
        </van-cell>
      </div>
      <div class="invite-poster__card-content">
        <div :class="!uploadUrl ? 'no-pad' : ''" class="upload-wrap">
          <div v-if="!uploadUrl" class="upload-dash">
            <div class="upload-action">
              <vis-img-uploader
                @onChange="onImageUpload"
              />
            </div>
            <p class="upload-tip">
              点击上传图片，生成自己的专属海报
            </p>
          </div>
          <div v-else class="upload-box">
            <cover :cover-url="uploadUrl" @size="getCoverSize" />
            <div class="upload-change">
              更换图片
              <vis-img-uploader
                @onChange="onImageUpload"
              />
            </div>
          </div>
        </div>
        <van-cell :title="posterInfo.shopName" label="扫描或长按识别二维码" center>
          <vis-img-wrap
            slot="icon"
            :src="posterInfo.shopLogo"
            width="36px"
            height="36px"
            class="logo"
          />
          <vis-img-wrap
            slot="right-icon"
            :src="posterInfo.qrCode"
            width="65px"
            height="65px"
            class="qrCode"
          />
        </van-cell>
      </div>
    </div>

    <van-loading
      v-show="loading"
      size="60px"
      class="invite-poster__card-loading"
    />
  </div>
</template>
<script>
import { Cell, Loading, Toast } from 'vant';
import { ImgWrap, ImgUploader } from '@youzan/vis-ui';
import compressImg from '@/shared/common/compress-img';
import { getIntroductionPoster, imageAppraise } from '../invite-poster';
import cover from './cover';
import { toBase64 } from '@youzan/utils/file/index';
export default {
  name: 'poster-card',

  components: {
    'van-cell': Cell,
    'van-loading': Loading,
    'vis-img-wrap': ImgWrap,
    'vis-img-uploader': ImgUploader,
    cover,
  },

  props: {
    isCustom: {
      type: Boolean,
      default: true,
    },

    posterBg: {
      type: String,
      required: true,
    },

    posterInfo: {
      type: Object,
      default() {
        return {};
      },
    },

    // 是否开始绘制
    isStart: {
      type: Boolean,
      default: false,
    },

    posterTheme: {
      type: String,
      default: '',
    },

  },

  data() {
    return {
      loading: false,
      previewUrl: this.posterBg,
      uploadUrl: '', // 上传的图片
      isSussess: false,
      meta: {},
    };
  },

  watch: {
    isStart(bool) {
      if (bool) {
        this.drawPoster();
      }
    },

    uploadUrl(url) {
      this.$emit('upload-change', url);
    },

  },

  methods: {
    drawPoster() {
      this.loading = true;
      // 服务端绘制图片
      const { posterInfo, uploadUrl, previewUrl, isCustom, posterBg, meta, posterTheme } = this;
      const { avatar } = posterInfo;
      this.isSussess = false;
      toBase64(avatar)
        .then((res) => {
          posterInfo.avatar = res;
          const config = { ...posterInfo, bg: posterBg, poster: uploadUrl || previewUrl, ...meta, theme: posterTheme };
          getIntroductionPoster(config)
            .then(res => {
              let url = res.img || '';
              url = url.replace(/https?:\/\/img\.yzcdn\.cn/, (_global.url || {}).imgqn);

              if (res.type === 'error' || !url) {
                Toast(res.data || '生成海报失败，请稍后再试');
              } else {
                // 自定义上传图片校验
                if (isCustom) {
                  imageAppraise({
                    url,
                  })
                    .then(data => {
                      const { status, message } = data || {};
                      if (status !== 0) {
                        Toast(message || '生成海报失败，请稍后再试');
                        this.$emit('finished');
                        this.$emit('track-log', 'make_poster', 0, message);
                      } else {
                        this.previewUrl = url;
                        this.isSussess = true;
                        this.$emit('finished', url);
                        this.$emit('track-log', 'make_poster', 1);
                      }
                    })
                    .catch((msg) => {
                      this.$emit('finished');
                      Toast(msg || '你的网络有点缓慢，请稍后重试');
                      this.$emit('track-log', 'make_poster', 0);
                    });
                } else {
                  this.previewUrl = url;
                  this.isSussess = true;
                  this.$emit('finished', url);
                }
              }
            }).catch((msg) => {
              this.$emit('finished');
              Toast(msg || '生成海报失败，请稍后再试');
            })
            .finally(() => {
              this.loading = false;
            });
        });
    },

    onImageUpload(file) {
      this.loading = true;
      if (Array.isArray(file) && file.length) {
        const meta = JSON.parse(file[0].meta) || {};
        this.meta.orientation = meta.orientation || 'Top-left';
        compressImg(file[0].attachment_file)
          .then(compressFile => {
            this.uploadUrl = compressFile.name;
          })
          .catch(() => {
            this.uploadUrl = file[0].attachment_url;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },

    getCoverSize(size) {
      const orientation = this.meta.orientation;
      let { width, height } = size || {};
      let posterWidth = 260;
      let posterHeight = 250;
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
        height = posterWidth / whScale;
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
      }
      this.meta = Object.assign(this.meta, {
        width: actualWidth,
        height: actualHeight,
        rotate,
      });
    },

  },
};
</script>
<style lang="scss" scoped>
@import 'mixins/index.scss';

.invite-poster {
  &__card {
    position: relative;
    height: 100%;

    &-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &-custom {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      @include flex-column(initial, initial);

      &::after {
        position: absolute;
        bottom: 0;
        left: 4px;
        width: 71px;
        height: 47px;
        background:
          url("https://b.yzcdn.cn/public_files/2020/04/02/lamp.png")
          center center no-repeat;
        background-size: contain;
        content: "";
      }
    }

    &-header {
      .van-cell {
        padding: 16px 16px 8px 16px;
        font-size: 12px;
        color: #fff;
        background-color: transparent;

        .van-cell__label {
          margin-top: 0;
          font-size: 10px;
          color: #fff;
        }
      }

      .avatar {
        margin-right: 8px;
        border-radius: 50%;
      }
    }

    &-content {
      position: relative;
      margin: 0 16px 18px 16px;
      flex: 1;
      font-size: 18px;
      background-color: #fff;
      border-radius: 8px;

      @include flex-column(initial, initial);

      &::before {
        position: absolute;
        position: absolute;
        top: -12px;
        left: 10px;
        width: 0;
        height: 0;
        border: 8px solid transparent;
        border-bottom: 7px solid #fff;
        content: '';
      }

      .upload-wrap {
        position: relative;
        overflow: hidden;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
        box-sizing: border-box;
        flex: 1;

        &.no-pad {
          padding: 8px;
        }

        .upload-dash {
          height: 100%;

          @include flex-column(center, center);
        }

        .upload-action {
          position: relative;
          width: 90px;
          height: 65px;
          overflow: hidden;
          background-color: #f2f3f5;
          border-radius: 12px;

          &::before,
          &::after {
            position: absolute;
            top: 50%;
            left: 50%;
            background-color: #c8c9cc;
            border-radius: 3px;
            content: "";
            transform: translate(-50%, -50%);
          }

          &::before {
            width: 24px;
            height: 4.5px;
          }

          &::after {
            width: 4.5px;
            height: 24px;
          }
        }

        .upload-tip {
          margin-top: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .upload-change {
          position: absolute;
          bottom: 8px;
          left: 50%;
          width: 80px;
          height: 32px;
          overflow: hidden;
          font-size: 12px;
          line-height: 32px;
          color: #fff;
          text-align: center;
          background-color: #323233;
          border-radius: 18px;
          transform: translateX(-50%);

          .visImgUploader {
            position: absolute;
            top: 0;
            left: 0;
          }
        }

        .upload-box {
          position: relative;
          height: 100%;
        }

        .visImgUploader {
          opacity: 0;

          .van-uploader__input-wrapper {
            width: 90px;
            height: 65px;
          }
        }
      }

      .detail {
        margin: 0 16px;
        flex: 1;
        color: #fff;
      }

      .van-cell {
        padding: 12px;
        background: #eef7ff;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
        flex-shrink: 0;
      }

      .logo {
        margin-right: 8px;
        border-radius: 50%;
      }

      .qrCode {
        margin-left: 7px;
      }
    }

    .van-cell__title {
      > span {
        display: block;

        @include multi-ellipsis(2);
      }
    }

    &-preview {
      &.no-save {
        pointer-events: none;
      }
    }
  }
}
</style>
