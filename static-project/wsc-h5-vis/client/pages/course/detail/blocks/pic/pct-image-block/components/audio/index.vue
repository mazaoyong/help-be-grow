<template>
  <div class="audio">
    <div>
      <i :style="{ backgroundImage: `url(${cover})` }" class="bg-img" />
      <i class="bg-mask" />
      <div class="cover">
        <div class="feedback-icon">
          <a href="/wscvis/feedback?from-type=force">反馈</a>
        </div>
        <recommend v-if="isEnd && audioOrVideoPlayEndRecommendGoods" class="recommend" />
        <div v-else class="img-mask">
          <img :src="cover" class="img">
          <i v-if="lock" class="mask" />
          <van-icon
            v-if="lock"
            class="lock-icon"
            name="lock"
            size="30px"
          />
        </div>
        <p v-if="tip" class="tip-wrap">
          <span class="tip">{{ tip }}</span>
        </p>
        <p v-if="nextTip" class="tip-wrap">
          <span class="tip">{{ nextTip }}</span>
          <span @click="$commit('cancelNext', true)" class="cancel">取消</span>
        </p>
      </div>
      <audio-player
        v-log.inner="log"
        :src="url"
        :alias="alias"
        :start-at="startAt"
        :is-log="isLog"
        :autoplay="autoplay"
        @play="onPlay"
        @pause="onPause"
        @ended="handleEnded"
        @timeupdate="progress"
        @error="handleError"
        class="audio-player"
      >
        <svg-icon
          slot="play"
          slot-scope="slotprops"
          @click.native="handlePlay(slotprops.play)"
          class="vis-audio__control_control-item vis-audio__control_action"
          symbol="play_audio"
        />
      </audio-player>
    </div>
    <info-collect-block v-if="showInfoCollectBlock" show-mask-type />
  </div>
</template>

<script>
import { Icon, Dialog } from 'vant';
import get from 'lodash/get';
import number from '@youzan/utils/number';
import log, { skynetLog } from '@/pages/course/detail/utils/log';
import InfoCollectBlock from '@/pages/course/detail/components/info-collect-block';
import SvgIcon from '@/components/svg-icon';
import Audio from './audio';
import Recommend from '../recommend';
import { PLAY_STATUS } from '../../constants';
import storeName from '../../name';
import { heartBeatDetector, learnProgress } from '@/pages/course/detail/track-list';

export default {
  storeName,

  components: {
    'van-icon': Icon,
    'audio-player': Audio,
    Recommend,
    SvgIcon,
    InfoCollectBlock,
  },

  data() {
    return {
      first: true,
      alias: '',
      isLog: false,

      duration: 0,
    };
  },

  state: ['playStatus', 'networkType', 'cancelNext', 'autoplay'],
  getters: ['cover', 'url', 'lock', 'startAt', 'tip', 'nextTip'],
  rootState: ['goodsData', 'audioOrVideoPlayEndRecommendGoods', 'env'],
  rootGetters: ['isAudio', 'isVideo', 'needCollectInfo'],

  computed: {
    isEnd() {
      return this.playStatus === PLAY_STATUS.AFTER_PLAY;
    },
    log() {
      return {
        '.vis-audio__control_tip': ['click_audio_backend_play', '音频点击后台运行提示'],
        '.vis-audio__control_back': ['click_audio_back', '音频点击倒退'],
        '.vis-audio__control_action': ['click_audio_play', '音频点击播放'],
        '.vis-audio__control_forward': ['click_audio_forward', '音频点击快进'],
        '.vis-audio__control_rate': ['click_audio_rate', '音频点击倍速'],
      };
    },

    showInfoCollectBlock() {
      return this.needCollectInfo && !this.goodsData.needOrder;
    },
  },

  watch: {
    'goodsData.alias'() {
      this.first = true;
      this.alias = this.goodsData.alias;
    },
  },

  created() {
    this.$dispatch('initNetworkType');
    this.$rootDispatch('initContentProgress');
    this.$rootDispatch('initColumnProgress');
    this.alias = get(this.goodsData, 'alias', '');
  },

  mounted() {
    // 增加数据变化的监听
    this.$track.addTask(learnProgress.media);
  },

  methods: {
    handlePlay(play) {
      if (this.goodsData.mediaUrlSwitch && !this.env.isWeixin) {
        Dialog.alert({
          message: '请在微信环境中访问',
          confirmButtonText: '知道了',
        });
        return;
      }
      play();
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
      // 音频播放开始，设置paidContent:startTime用以统计学习时长
      this.$track.collect('paidContent:isPlaying', true);
      this.$track.addTask(heartBeatDetector);
      this.isLog = true;
    },

    onPause() {
      this.$track.collect('paidContent:isPlaying', false);
    },

    progress(obj) {
      const currentTime = obj.element.currentTime;
      const duration = obj.element.duration;
      this.duration = duration;
      // 剩余时间小于5s，状态改为即将结束
      if (duration - currentTime < 5) {
        this.$commit('willFinish', true);
      } else {
        this.$commit('willFinish', false);
      }
      if (this.goodsData.isOwnAsset) {
        const progress = Math.min(
          number.accMul(Number((currentTime / duration).toFixed(2)), 100),
          100,
        );
        this.$rootDispatch('updateContentProgress', {
          current: currentTime,
          total: duration,
          percent: progress,
        });
      }
      // 设置音频时长和音频播放时间
      this.$track.collect('media:duration', Math.ceil(duration));
      this.$track.collect('media:current', Math.ceil(currentTime));
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

    handleError(e) {
      skynetLog('warn', 'audio-error', '音频播放失败', {
        error: e,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'mixins/index.scss';

.audio {
  position: relative;
  height: 290px;
  overflow: hidden;

  .bg-img {
    position: absolute;
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    filter: blur(15px);
  }

  .bg-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba($main-text-color, 0.6);
  }

  .cover {
    position: absolute;
    top: 12px;
    left: 50%;
    width: 100%;
    height: 168px;
    color: $white;
    transform: translateX(-50%);

    .lock-icon,
    .loading-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .img-mask {
      position: absolute;
      left: 50%;
      height: 100%;
      background-color: rgba($black, 0.6);
      border-radius: 4px;
      transform: translateX(-50%);

      .img {
        height: 100%;
        border-radius: 4px;
      }

      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba($black, 0.6);
        border-radius: 4px;
      }
    }

    .tip-wrap {
      position: absolute;
      bottom: 4px;
      left: 50%;
      display: flex;
      max-width: 270px;
      padding: 0 16px;
      font-size: 12px;
      line-height: 30px;
      color: $white;
      white-space: nowrap;
      background-color: rgba($main-text-color, 0.8);
      border-radius: 15px;
      transform: translateX(-50%);

      .tip {
        @include ellipsis;
      }

      .cancel {
        flex-shrink: 0;
        margin-left: 16px;
        text-decoration: underline;
      }
    }

    .recommend {
      padding: 40px 24px;
    }
  }

  .audio-player {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-bottom: 16px;
  }
}
</style>
