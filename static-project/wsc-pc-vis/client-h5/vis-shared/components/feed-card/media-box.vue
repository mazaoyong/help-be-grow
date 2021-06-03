<template>
  <div class="moments-feeds__media">
    <template v-if="mediaType === 0">
      <!-- 图片 -->
      <ul class="moments-feeds__media-pics">
        <li
          v-for="(item, index) in mediaList"
          :key="index"
          class="moments-feeds__media-pics-li"
          @click="showPicsPreview(index)"
        >
          <img-wrap
            class="moments-feeds__media-pics-img"
            :width="'100%'"
            :height="'100%'"
            :src="item"
            :fullfill="'!160x0.jpg'"
            :cover="true"
          />
        </li>
      </ul>
      <div v-if="isShowPicsPreview" class="popup-box">
        <div class="actions-sheet">
          <div v-if="!isBusinessType" class="action-item" @click.stop="handleShare">
            <img :src="shareIcon" alt="分享">
          </div>
          <div class="action-item" @click.stop="generatePoster">
            <img :src="downloadIcon" alt="生成海报">
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="mediaType === 2">
      <!-- 视频 -->
      <div class="moments-feeds__media-video">
        <vis-video-patch
          :source="videoSource"
          :poster="videoCover"
          :disabled="isDelete"
          :video-size="videoSize"
          width="200"
          height="112"
          @playing="onPlaying"
        >
          <div slot="cover" class="video-cover">
            <div v-if="isDelete" class="video-delete">
              <label style="line-height: 112px;">已删除</label>
            </div>
            <label v-else class="video-size">{{ videoDuration }}</label>
          </div>
          <div slot="cover-foot" class="actions-sheet">
            <div v-if="!isAndroidWx && !isBusinessType" class="action-item" @click.stop="handleShare">
              <img :src="shareIcon" alt="分享">
            </div>
            <div class="action-item" @click.stop="generatePoster">
              <img :src="downloadIcon" alt="生成海报">
            </div>
          </div>
        </vis-video-patch>
      </div>
    </template>
  </div>
</template>
<script>
import { ImagePreview } from 'vant';
import { VideoPatch, ImgWrap } from '@youzan/vis-ui';
import get from 'lodash/get';
import { format } from 'date-fns';
import UserAgent from '@youzan/utils/browser/ua_browser';
import fullfillImage from '@youzan/utils/fullfillImage';
import { setValidTimer as countVideoPlayed } from '../../utils/count-played';

import constant from './constants';

export default {
  name: 'media-box',

  components: {
    'vis-video-patch': VideoPatch,
    'img-wrap': ImgWrap,
  },

  props: {
    // 是否是B端
    isBusinessType: {
      type: Boolean,
      default: false,
    },
    mediaList: {
      type: Array,
      default: () => [],
    },
    mediaType: {
      type: Number,
      default: 0,
    },
    postId: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      showSharePopup: false,
      isShowPicsPreview: false,
      isAndroidWx: UserAgent.isWeixin() && (UserAgent.isAndroid() || UserAgent.isAndroidOld()),
      shareIcon: constant.STATIC_ASSETS.shareIcon,
      downloadIcon: constant.STATIC_ASSETS.downloadIcon,
    };
  },

  computed: {
    videoCover() {
      return get(this.mediaList, '[0].coverUrl', '');
    },
    videoSource() {
      return get(this.mediaList, '[0].source');
    },
    isDelete() {
      return get(this.mediaList, '[0].deleted');
    },
    videoId() {
      return get(this.mediaList, '[0].videoId');
    },
    videoSize() {
      const coverHeight = get(this.mediaList, '[0].coverHeight');
      const coverWidth = get(this.mediaList, '[0].coverWidth');

      return {
        height: coverHeight,
        width: coverWidth,
      };
    },
    videoDuration() {
      const duration = get(this.mediaList, '[0].duration', 0);
      if (duration) {
        const minus = Math.floor(duration / 60);
        let seconds = Math.ceil(duration % 60);
        if (seconds < 10) {
          seconds = `0${seconds}`;
        }

        return `${minus}:${seconds}`;
      }

      return '00:00';
    },
    videoName() {
      const now = format(new Date(), 'YYYY_MM_DD__hh_mm_ss');
      return `${now}_video`;
    },

    filledImage() {
      return this.mediaList.map(o => {
        if (typeof o === 'string') {
          return fullfillImage(o.replace('img.yzcdn.cn', 'img01.yzcdn.cn'), 'origin');
        }
      });
    },
  },

  created() {
    // console.log(this.mediaList, this.mediaType);
  },

  methods: {
    thumImageUrl(item) {
      // 获取小尺寸的图片
      return fullfillImage(item, '!120x120.jpg');
    },
    playVideo() {
      console.log('click playVideo');
    },
    handleVideoChange(index) {
      console.log('switch to ', index);
    },
    showPicsPreview(index) {
      this.isShowPicsPreview = true;
      ImagePreview({
        lazyLoad: true,
        images: this.filledImage,
        startPosition: index,
        onClose: () => {
          this.isShowPicsPreview = false;
        },
      });
    },
    handleShare() {
      this.showSharePopup = true;
      this.$emit('on-share', this.postId);
    },
    generatePoster() {
      if (_global.visBuyer) {
        window.location.href = `/wscvis/edu/moments/poster?postId=${this.postId}&kdtId=${_global.kdt_id}`;
      } else {
        window.location.href = `${_global.url.v4}/vis/h5/edu/moments/poster?postId=${this.postId}`;
      }
    },

    onPlaying() {
      if (this.videoId) {
        countVideoPlayed({
          channel: 'owl_ceres_post',
          videoId: this.videoId,
          component: 'edu_moments_video',
        });
      }
    },
  },
};
</script>
<style lang="scss">
.van-image-preview {
  background-color: #000;

  .van-swipe-item {
    height: calc(100% - 52px) !important;
  }
}

.moments-feeds__media {
  margin-top: 12px;

  .popup-box {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    width: 100%;
    height: 52px;
    overflow: hidden;
  }

  &-pics {
    display: flex;
    flex-wrap: wrap;

    &-li {
      width: 80px;
      height: 80px;
      margin: 0 4px 4px 0;

      &-img {
        width: 100%;
        height: 100%;
      }
    }
  }

  &-video {
    position: relative;
    width: 200px;
    height: 112px;
    margin-top: 8px;
    overflow: hidden;
    background-color: #000;

    .video-cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      text-align: center;

      .video-size {
        position: absolute;
        right: 4px;
        bottom: 4px;
        color: #fff;
        text-shadow: rgba(0, 0, 0, .7) 1px 1px 7px;
      }

      .video-delete {
        width: 100%;
        height: 100%;
        color: #C8C9CC;
        background-color: #EBEDF0;
      }
    }
  }
}

.actions-sheet {
  position: fixed;
  right: 16px;
  bottom: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .action-item:not(:last-child) {
    margin-bottom: 16px;
  }

  .action-item {
    width: 44px;
    height: 44px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, .6);
    border: 2px solid #fff;
    border-radius: 50%;
    box-sizing: border-box;

    img {
      width: 18px;
      height: 18px;
      margin: 11px;
    }
  }
}

@media screen and (max-width: 320px) {
  .moments-feeds__media-pics {
    &-li {
      width: 75px;
      height: 75px;
    }
  }
}
</style>
