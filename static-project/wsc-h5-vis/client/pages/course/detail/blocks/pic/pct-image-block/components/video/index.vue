<template>
  <van-sticky>
    <div class="video" :style="{ width: `${pageWidth}px`, height: `${height}px` }">
      <video-player
        v-log.inner="log"
        class="video-player"
        :src="limitWeixin ? '' : url"
        :start-at="startAt"
        :autoplay="autoplay"
        :cover="cover"
        :network-type="networkType"
        :can-forward="goodsData.speedSwitch"
        :play-rate="videoPlayRate"
        @play="onPlay"
        @pause="onPause"
        @ended="handleEnded"
        @timeupdate="progress"
        @error="handleError"
        @togglePlayRate="onToggleVideoPlayRate"
      >
        <template slot="play" slot-scope="slotprops">
          <van-icon
            v-if="lock"
            class="lock-icon"
            name="lock"
            size="30px"
          />
          <van-icon
            v-else
            name="play-circle-o"
            size="50px"
            @click="handlePlay(slotprops.play)"
          />
          <span v-if="tip" class="tip">{{ tip }}</span>
        </template>
        <template slot="replay" slot-scope="slotprops">
          <div v-if="audioOrVideoPlayEndRecommendGoods" class="reply-wrap">
            <recommend class="recommend" />
            <div class="replay" @click="slotprops.replay">
              <van-icon
                class="button"
                name="replay"
                size="16px"
              />
              重播
            </div>
          </div>
          <div v-else class="reply-wrap">
            <van-icon
              name="replay"
              size="24px"
              @click="slotprops.replay"
            />
            <span v-if="tip" class="tip">{{ tip }}</span>
          </div>
        </template>
        <p v-if="nextTip" class="next-tip-wrap">
          {{ nextTip }}
          <span class="cancel" @click.stop="$commit('cancelNext', true)">取消</span>
        </p>
      </video-player>
    </div>

    <info-collect-block v-if="showInfoCollectBlock" show-mask-type />
  </van-sticky>
</template>

<script>
import { get } from 'lodash';
import { Icon, Dialog, Sticky } from 'vant';
import number from '@youzan/utils/number';
import log, { skynetLog } from '@/pages/course/detail/utils/log';
import { setValidTimer as countVideoPlayed } from 'common/utils/count-played';
import Video from './video';
import Recommend from '../recommend';
import storeName from '../../name';
import { heartBeatDetector, learnProgress } from '@/pages/course/detail/track-list';
import InfoCollectBlock from '@/pages/course/detail/components/info-collect-block';

// 知识付费封面固定16:9的比例
const RATIO = 16 / 9;

export default {
  storeName,

  components: {
    'van-icon': Icon,
    'van-sticky': Sticky,
    'video-player': Video,
    Recommend,
    InfoCollectBlock,
  },

  data() {
    return {
      first: true,

      duration: 0,
    };
  },

  state: ['networkType', 'cancelNext', 'autoplay'],
  getters: ['cover', 'url', 'lock', 'startAt', 'tip', 'nextTip'],
  rootState: ['goodsData', 'audioOrVideoPlayEndRecommendGoods', 'env', 'offlineData', 'videoPlayRate'],
  rootGetters: ['pageWidth', 'needCollectInfo'],

  computed: {
    log() {
      return {
        '.vis-video__control_bottom_rate': ['click_video_rate', '视频点击倍速'],
        '.vis-video__control_bottom_screen': ['click_video_full_screen', '视频点击全屏'],
      };
    },

    height() {
      return this.pageWidth / RATIO;
    },

    limitWeixin() {
      return this.goodsData.mediaUrlSwitch && !this.env.isWeixin;
    },

    showInfoCollectBlock() {
      return this.needCollectInfo && !this.goodsData.needOrder;
    },
  },

  watch: {
    'goodsData.alias'() {
      this.first = true;
    },
  },

  created() {
    this.$dispatch('initNetworkType');
    this.$rootDispatch('initContentProgress');
    this.$rootDispatch('initColumnProgress');
  },

  mounted() {
    // 增加数据变化的监听
    this.$track.addTask(learnProgress.media);
  },

  methods: {
    handlePlay(play) {
      if (this.limitWeixin) {
        Dialog.alert({
          message: '请在微信环境中访问',
          confirmButtonText: '知道了',
        });
        return;
      }

      play();

      countVideoPlayed({
        videoId: this.goodsData.isOwnAsset ? this.goodsData.fullContentId : this.goodsData.previewContentId,
        channel: this.goodsData.isOwnAsset ? 'owl_content_main' : 'owl_content_preview',
        component: 'edu_video_player',
      });
    },

    onPlay() {
      this.$dispatch('start');
      if (this.goodsData.isOwnAsset) {
        this.$rootDispatch('updateColumnProgress', {
          alias: this.goodsData.alias,
          title: this.goodsData.title,
        });
        if (this.first) {
          log({
            et: 'click',
            ei: 'paid_play',
            en: '音/视频购买后点击播放',
          });
          this.first = false;
        }
      }
      // 视频播放开始，设置paidContent:startTime用以统计学习时长
      this.$track.collect('paidContent:isPlaying', true);
      this.$track.addTask(heartBeatDetector);
    },

    onPause() {
      this.$track.collect('paidContent:isPlaying', false);
    },

    onToggleVideoPlayRate(rate) {
      if (rate === this.videoPlayRate) {
        return;
      }
      this.$rootCommit('toggleVideoPlayRate', rate);
    },

    progress(status) {
      const { current, duration } = status;
      this.duration = duration;
      if (duration - current < 5) {
        this.$commit('willFinish', true);
      } else {
        this.$commit('willFinish', false);
      }
      if (this.goodsData.isOwnAsset) {
        const progress = Math.min(
          number.accMul(Number((current / duration).toFixed(2)), 100),
          100,
        );
        this.$rootDispatch('updateContentProgress', {
          current,
          total: duration,
          percent: progress,
        });
      }
      // 设置视频时长和视频播放时间
      this.$track.collect('media:duration', Math.ceil(duration));
      this.$track.collect('media:current', Math.ceil(current));
    },

    handleEnded() {
      // 兜底记录 100% 进度
      const duration = this.duration;
      if (duration) {
        this.$rootDispatch('updateContentProgress', {
          current: duration,
          total: duration,
          percent: 100,
        });
        this.$track.collect('media:duration', Math.ceil(duration));
        this.$track.collect('media:current', Math.ceil(duration));
      }

      if (this.nextTip) {
        this.$router.push({
          path: `/${this.goodsData.nextOwlInfo.alias}`,
          query: this.$route.query,
        });
        this.$commit('autoplay', true);
      } else {
        this.$dispatch('end');
      }
    },

    handleError(e, videoElement) {
      try {
        skynetLog('warn', 'video-error', '视频播放失败', {
          error: {
            message: e.message,
            code: e.code,
          },
          videoInfo: {
            mediaError: videoElement.error,
            readyState: videoElement.readyState,
            duration: videoElement.duration,
            currentTime: videoElement.currentTime,
            isActive: get(navigator, 'userActivation.isActive', null),
          },
        });
      } catch (err) {}
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.video {
  margin: 0 auto;

  .tip {
    display: block;
    margin-top: 20px;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    white-space: pre-line;
  }

  .next-tip-wrap {
    position: absolute;
    right: 16px;
    bottom: 40px;
    padding: 0 12px;
    font-size: 10px;
    line-height: 24px;
    color: $white;
    background-color: rgba(50, 50, 50, .8);
    border-radius: 12px;

    .cancel {
      margin-left: 8px;
      text-decoration: underline;
    }
  }

  .reply-wrap {
    width: 100%;
    text-align: center;

    .recommend {
      padding: 0 24px;
    }

    .replay {
      position: absolute;
      right: 16px;
      bottom: 16px;
      font-size: 12px;
      line-height: 16px;

      .button {
        vertical-align: text-bottom;
      }
    }
  }
}
</style>
