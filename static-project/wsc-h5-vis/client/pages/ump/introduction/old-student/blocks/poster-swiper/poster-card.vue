<template>
  <div
    class="invite-poster__card"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchMove"
  >
    <img-wrap
      :src="posterBg"
      :loading-img="posterBg"
      :cover="false"
      :class="{ 'no-save': !isSussess }"
      width="100%"
      height="100%"
      :disable-fullfill="true"
      class="invite-poster__card-preview"
    />

    <div v-show="type === 'custom'" class="invite-poster__card-custom">
      <custom-poster
        :qrCode="posterInfo.qrCode"
        :userName="posterInfo.name"
        :new-stu-reward-tip="newStuRewardTipSimple"
        @upload-change="uploadChange"
      />
    </div>
    <van-loading v-show="loading" size="60px" class="invite-poster__card-loading" />
  </div>
</template>
<script>
import { Toast, Loading } from 'vant';
import { ImgWrap } from '@youzan/vis-ui';
import { getVuePoster } from '@/common/apis/poster';

import { imageAppraise } from '../../../apis';

import CustomPoster from './custom-poster';

import { toBase64 } from '@youzan/utils/file/index';

const { miniprogram = {} } = window._global || {};

export default {
  name: 'poster-card',

  components: {
    CustomPoster,
    ImgWrap,
    'van-loading': Loading,
  },

  props: {
    type: {
      type: String,
      required: true,
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

    newStuRewardTip: {
      type: String,
    },

    newStuRewardTipSimple: {
      type: String,
    },

    currentIndex: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      isSussess: false,
      loading: false,
      uploadImgMetaInfo: {},
      isWeapp: miniprogram.isWeapp,
    };
  },

  watch: {
    isStart(bool) {
      if (bool) {
        this.getPosterImg();
      }
    },
  },

  methods: {
    getPosterImg() {
      this.loading = true;
      this.$emit('toggle-show-save-guide', false);
      // 服务端绘制图片
      const { posterInfo, posterBg, type, newStuRewardTip, newStuRewardTipSimple, uploadImgMetaInfo, isWeapp } = this;
      const { rotate = 0, width, height } = uploadImgMetaInfo;
      const { avatar, name, qrCode, shopName } = posterInfo;
      this.isSussess = false;
      let pathname = '';
      switch (type) {
        case 'definition':
          pathname = 'ump/introduction/definition';
          break;
        case 'default':
          pathname = 'ump/introduction/default';
          break;
        case 'custom':
          pathname = 'ump/introduction/custom';
          break;
        default:
          break;
      }
      let posterIndex = this.currentIndex;
      toBase64(avatar).then((res) => {
        posterInfo.avatar = res;
        getVuePoster({
          pathname,
          data: {
            name,
            avatar: res,
            poster: posterBg,
            qrCode,
            shopName,
            newStuRewardTip,
            newStuRewardTipSimple,
            rotate,
            width,
            height,
            isWeapp,
          },
          snapshotConfig: {
            width: 240,
            height: 330,
            type: 'png',
          },
        })
          .then((res) => {
            let url = res.img;
            if (res.msg === 'error' || !url) {
              Toast(res.data || '生成海报失败，请稍后再试');
            } else {
              if (type === 'custom') {
                imageAppraise({
                  url,
                })
                  .then((data) => {
                    const { status, message } = data || {};
                    if (status !== 0) {
                      Toast(message || '生成海报失败，请稍后再试');
                      this.$emit('track-log', 'make_poster', 0, message);
                    } else {
                      this.drawPosterSuccess(url, posterIndex);
                    }
                  })
                  .catch((msg) => {
                    Toast(msg || '你的网络有点缓慢，请稍后重试');
                    this.$emit('track-log', 'make_poster', 0);
                  });
              } else {
                this.drawPosterSuccess(url, posterIndex);
              }
            }
          })
          .catch((msg) => {
            Toast('生成海报失败，请稍后再试');
          })
          .finally(() => {
            this.loading = false;
            this.$emit('finished');
          });
      });
    },

    uploadChange(url, uploadImgMetaInfo) {
      this.$emit('upload-change', url);
      this.uploadImgMetaInfo = uploadImgMetaInfo;
    },

    drawPosterSuccess(url, posterIndex) {
      this.$emit('toggle-show-save-guide', true);
      this.isSussess = true;
      this.$emit('finished', url, posterIndex);
      this.$emit('track-log', 'make_poster', 1);
    },

    handleTouchStart(e) {
      if (this.touchTimer) {
        clearTimeout(this.touchTimer);
      }
      this.touchTimer = setTimeout(() => {
        this.handleLongTap();
      }, 1200);
    },

    handleTouchMove() {
      if (this.touchTimer) {
        clearTimeout(this.touchTimer);
        this.touchTimer = null;
      }
    },

    handleLongTap() {
      if (this.type !== 'custom' && this.isSussess) {
        this.$emit('share');
      }
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
    }

    &-preview {
      &.no-save {
        pointer-events: none;
      }
    }
  }
}
</style>
