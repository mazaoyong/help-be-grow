<template>
  <div class="vis-audio">
    <div class="vis-audio__progress">
      <span class="vis-audio__progress_current-time vis-audio__progress_time">
        {{ currentTime }}
      </span>
      <div class="vis-audio__progress_slider">
        <van-slider
          :value="progress"
          active-color="#00b389"
          inactive-color="#fff"
          @change="trigger(sliderChange, $event)"
          @drag-start="onDragStart"
          @input="onDragging"
          @drag-end="onDragEnd"
        >
          <i slot="button" class="vis-audio__progress_slider_btn" />
        </van-slider>
      </div>
      <span class="vis-audio__progress_duration vis-audio__progress_time">
        {{ duration }}
      </span>
    </div>
    <div class="vis-audio__control">
      <!-- TODO：所有svg-icon都需要替换为vis-ui中的icon -->
      <svg-icon
        :style="{ visibility: hasTip ? 'visible' : 'hidden' }"
        class="vis-audio__control_control-item vis-audio__control_tip"
        symbol="stick"
        @click.native="trigger(showPopTip)"
      />
      <svg-icon
        class="vis-audio__control_control-item vis-audio__control_back"
        symbol="back15"
        @click.native="trigger(back)"
      />
      <van-loading
        v-if="loading"
        class="vis-audio__control_control-item vis-audio__control_action"
        type="spinner"
        size="40px"
      />
      <svg-icon
        v-else-if="playing"
        class="vis-audio__control_control-item vis-audio__control_action"
        symbol="pause_audio"
        @click.native="trigger(pause)"
      />
      <slot v-else :play="trigger(play, null, true)" name="play">
        <svg-icon
          class="vis-audio__control_control-item vis-audio__control_action"
          symbol="play_audio"
          @click.native="trigger(play)"
        />
      </slot>
      <svg-icon
        class="vis-audio__control_control-item vis-audio__control_forward"
        symbol="forward15"
        @click.native="trigger(forward)"
      />
      <div
        class="vis-audio__control_control-item vis-audio__control_rate"
        @click="trigger(switchRate)"
      >
        <span class="vis-audio__control_rate_label">{{ rate }}x</span>
      </div>
    </div>
    <div v-if="stickTipVisible" class="vis-audio__stick-tip">
      {{ tip }}
    </div>
    <div v-if="popTipVisible" class="vis-audio__pop-tip">
      <p>
        点击右上角，选
        <van-image
          class="vis-audio__pop-tip_icon"
          src="https://b.yzcdn.cn/public_files/b064805328934e2b2d17bf570cde509f.png!small.webp"
        />
        可以边听边聊微信
      </p>
      <span class="vis-audio__pop-tip_button" @click="hidePopTip">
        我知道了
      </span>
    </div>
    <div v-if="showWxOpenTag" id="wx-open-audio" :disabled="disabledWxTag" />
  </div>
</template>

<script>
import { throttle } from 'lodash';
import { Slider, Loading, Toast, Image } from 'vant';
import ua from '@youzan/utils/browser/ua';
import { ZNB } from '@youzan/wxsdk';
import YZLocalStorage from '@youzan/utils/browser/local_storage';
import { audio as ZanAudio } from '@youzan/zan-media-sdk';
import SvgIcon from '@/components/svg-icon';
import secondsToColonTime from '@/pages/course/detail/utils/seconds-to-colon-time';
import getNetworkType from '@/pages/course/detail/utils/get-network-type';
import compareVersions from '@youzan/utils/string/compareVersions';

const TIP_STORAGE_KEY = 'paidcontent:showStickTip';
const RATE = ['1.0', '1.25', '1.5', '2.0', '0.7'];
const QUICK_FIXED_KDT_ID = Object.entries(_global.ebizWhitelist || {}).reduce((summaryWhitelist, curWhitelist) => {
  const [, whitelist] = curWhitelist || [];
  // 不用过滤，如果匹配不上就拉倒
  return summaryWhitelist.concat(String(whitelist).split(',').map(Number));
}, [0]);

// 判断是不是测试店铺
let isTestShop = false;
if (_global.playbgWhitelist) {
  const AUDIO_PLAYBG_KDT_ID = String(_global.playbgWhitelist['audio-playbg']).split(',').map(Number);
  isTestShop = AUDIO_PLAYBG_KDT_ID.includes(Number(_global.kdt_id || _global.kdtId));
}
// 判断是不是微信环境
const isWeapp = _global.miniprogram.isWeapp;

// 开通了认证服务号
const isVerfiedForWxOpenAudio = _global.mp_account.service_type === 2 && _global.mp_account.verify_type !== -1;
// 只有微信小程序版本大于等于2.71.1可以开启背景播放
const isPlayBgVersion = isWeapp ? (compareVersions(_global.weappVersion, '2.71.1')) >= 0 : false;
// 微信APP版本大于等于7.0.15并且为微信browser可以开启悬浮窗(Floating Window)音频播放
const isPlayFwVersion = (ua.isWeixin() && !isWeapp) ? (compareVersions(ua.getPlatformVersion(), '7.0.15')) >= 0 : false;
// 安卓系统版本大于等于5.0可以开启悬浮窗(Floating Window)音频播放
const isPlayAndroidVersion = ua.isAndroid() ? (compareVersions(ua.getAndroidVersion(), '5.0')) >= 0 : false;
// IOS系统版本大于等于10.3可以开启悬浮窗(Floating Window)音频播放
const isPlayIOSVersion = ua.isIOS() ? (compareVersions(ua.getIOSVersion().toString(), '10.3')) >= 0 : false;

export default {
  name: 'vis-audio',

  components: {
    'van-slider': Slider,
    'van-loading': Loading,
    'van-image': Image,
    'svg-icon': SvgIcon,
  },

  props: {
    src: {
      type: String,
      default: '',
    },
    isLog: {
      type: Boolean,
      default: false,
    },
    startAt: {
      type: Number,
      default: 0,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    alias: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      currentTime: '0:00',
      duration: '0:00',
      time: 0,
      rateIndex: 0,
      progress: 0,
      playing: false,
      loading: false,
      stickTipVisible: false,
      popTipVisible: false,
      dragging: false,
      /** 暂存出错的播放时间点 */
      tempCurrentTime: 0,
      showWxOpenTag: false,
      disabledWxTag: false,
    };
  },

  rootState: ['env', 'goodsData'],

  computed: {
    rate() {
      return RATE[this.rateIndex];
    },

    hasTip() {
      return this.tip;
    },

    tip() {
      if (isWeapp) {
        if ((isTestShop || isPlayBgVersion)) {
          return '进入后台播放模式，息屏也能聆听课程';
        }

        if (ua.isIOS()) {
          return '试试边听边聊微信？';
        }
      }
      if (!isWeapp && ua.isIOS() && ua.isWeixin()) {
        return '试试边听边聊微信？';
      }
      return '';
    },
  },

  watch: {
    src(newSrc) {
      const source = String(newSrc);
      if (source) {
        if (this.audio) {
          this.audio.switch(source, { autoplay: this.autoplay });
        } else {
          this.init(source);
        }
      }
    },
    playing(isPlay) {
      if (isPlay === true && isWeapp && isTestShop && isPlayBgVersion) {
        document.addEventListener('click', (e) => {
          if (e.target.className !== 'vis-audio__stick-tip') {
            this.stickTipVisible = false;
            YZLocalStorage.setItem(TIP_STORAGE_KEY, 'no');
          }
        });
      }
    },
  },

  created() {
    const source = String(this.src);
    if (isVerfiedForWxOpenAudio && isPlayFwVersion && (isPlayAndroidVersion || isPlayIOSVersion)) {
      this.showWxOpenTag = true;
    }
    if (source) {
      this.init(source);
    }
    if (isWeapp && isTestShop && isPlayBgVersion) {
      try {
        let { currentTime, playing, duration } = this.$route.query;
        const alias = this.$route.params;
        currentTime = parseFloat(currentTime);
        duration = parseFloat(duration);
        if (currentTime && playing && duration && alias && this.startAt < currentTime) {
          if (currentTime >= duration) {
          // 如果现在播放进度大于音频时长，则取音频时长
            this.audio.setStartTime(0);
            this.currentTime = secondsToColonTime(0);
          } else if (currentTime < duration) {
          // 如果现在播放进度小于音频时长，则取现在播放进度
            this.audio.setStartTime(currentTime);
            this.currentTime = secondsToColonTime(currentTime);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    // 修改一下，vue router防止页面切换多次初始化事件监听
    // 白名单用户才走修复逻辑，iOS不走
    if (!ua.isIOS() && QUICK_FIXED_KDT_ID.includes(Number(_global.kdt_id || _global.kdtId))) {
      this.audio.once('play', this.fixedStopPlaying);
    }
  },

  mounted() {
    if (isVerfiedForWxOpenAudio && isPlayFwVersion && (isPlayAndroidVersion || isPlayIOSVersion)) {
      this.disabledWxTag = true;
      const anchor = document.querySelector('#wx-open-audio');
      const playPosition = document.getElementsByClassName('vis-audio__control_control-item')[2].getBoundingClientRect();
      anchor.style.width = `${playPosition.width}px`;
      anchor.style.height = `${playPosition.height}px`;
      setTimeout(() => {
        this.init(this.src);
      }, 2000);
    }
  },

  methods: {
    init(src) {
      let useWxOpenAudio = false;
      if (isVerfiedForWxOpenAudio && isPlayFwVersion && (isPlayAndroidVersion || isPlayIOSVersion)) {
        useWxOpenAudio = true;
      }
      const { title, author, pictures, column } = this.goodsData;
      this.audio = new ZanAudio({
        src,
        getInfoFromCdn: true,
        autoplay: this.autoplay,
        enableErrorHandler: true,
        wxOpenAudioConfig: {
          useTag: useWxOpenAudio,
          appendDom: '#wx-open-audio',
          title: title,
          author: author,
          cover: pictures[0].url,
          episode: column.title,
        },
      });
      this.audio.on('canplay', () => {
        if (this.audio.useOpenTag) {
          this.disabledWxTag = false;
        };
      });
      this.audio.on('play', () => {
        this.playing = true;
        this.$emit('play');
      });
      this.audio.on('pause', () => {
        this.playing = false;
        this.$emit('pause');
      });
      this.audio.on('ended', () => {
        if (this.audio.useOpenTag) {
          // 使用微信悬浮窗时,若结束时间+2>=时长，则认为用户看完了，抛出ended
          if (this.audio.currentTime + 2 >= this.audio.duration) {
            // 将当前时间+1:解决结束时,播放时间少一秒的问题
            this.currentTime = secondsToColonTime(this.audio.currentTime + 1);
            // 定时器:解决播放时间没有放到最后一秒就页面跳转的问题
            setTimeout(() => {
              this.$emit('ended');
            }, 100);
          }
          return;
        }
        this.$emit('ended');
      });
      this.audio.on('durationchange', () => {
        this.time = this.audio.duration;
        this.duration = secondsToColonTime(this.audio.duration);
      });
      this.audio.on('timeupdate', throttle(() => {
        this.currentTime = secondsToColonTime(this.audio.currentTime);
        if (!this.dragging) {
          this.progress = this.audio.progress * 100;
        }
        this.$emit('timeupdate', this.audio);
      }, 200));
      this.audio.on('loading', () => {
        this.loading = true;
      });
      this.audio.on('loaded', () => {
        this.loading = false;
      });
      this.audio.on('error', e => {
        const { element } = this.audio;
        if (!element ||
          !element.error ||
          (element.error.code !== 3 && element.error.code !== 4)
        ) {
          Toast('加载资源失败，请重试');
        }
        this.loading = false;
        this.$emit('error', e);
      });
      this.audio.setStartTime(this.startAt);
      if (this.autoplay) {
        getNetworkType().then(() => {
          this.audio.play();
        });
      }
    },

    handleStalled() {
      console.log('----音频意外停止，重试中----');
      console.log('失败时间：', this.currentTime);
      window.yzStackLog &&
        window.yzStackLog.log({
          name: 'audio-stalled',
          message: '----音频意外停止，重试中----',
          level: 'info',
          extra: {
            stalledTime: this.currentTime,
          },
        });
      this.installed = true;
      this.tempCurrentTime = this.audio.currentTime;
      this.audio.element.load();
    },
    handleRecovery() {
      if (this.installed) {
        console.log('----重试加载完成，开始播放----');
        this.audio.element.play();
        this.audio.setStartTime(this.tempCurrentTime);
        this.installed = false;
        this.tempCurrentTime = 0;
      }
    },
    // 添加事件监听，修复息屏状态下商家音频停止播放
    fixedStopPlaying() {
      console.log('----初始化重试逻辑----');
      this.audio.element.addEventListener('stalled', this.handleStalled);
      this.audio.element.addEventListener('loadstart', this.handleRecovery);
    },

    trigger(fn, value, returnFunc) {
      const func = () => {
        if (this.audio) {
          fn(value);
        }
      };
      if (returnFunc) {
        return func;
      }
      func();
    },

    sliderChange(value) {
      this.audio.seek(Math.floor(this.time * value / 100));
    },

    onDragStart() {
      this.dragging = true;
    },

    onDragging(value) {
      this.progress = value;
    },

    onDragEnd() {
      this.dragging = false;
    },

    play() {
      if (this.hasTip && YZLocalStorage.getItem(TIP_STORAGE_KEY) !== 'no') {
        this.stickTipVisible = true;
      }
      // 若使用了wx tag ，解决暂停时设置了速率的问题
      if (this.audio.useOpenTag && this.audio.rate !== +RATE[this.rateIndex]) {
        this.audio.play();
        this.audio.rate = +RATE[this.rateIndex];
        return;
      }
      this.audio.play();
    },

    pause() {
      this.audio.pause();
    },

    back() {
      this.audio.backward(15);
    },

    forward() {
      this.audio.forward(15);
    },

    switchRate() {
      this.rateIndex = (this.rateIndex + 1) % RATE.length;
      this.audio.rate = +RATE[this.rateIndex];
    },

    showPopTip() {
      this.stickTipVisible = false;
      const isTestBgPlayOrStable = isTestShop || isPlayBgVersion;
      if (
        (isWeapp && !isTestBgPlayOrStable && ua.isIOS()) ||
        (!isWeapp && ua.isIOS() && ua.isWeixin())
      ) {
        this.popTipVisible = true;
      }
      if (isWeapp && this.loading === false && isTestBgPlayOrStable) {
        setTimeout(() => {
          let { currentTime, duration } = this.audio;
          currentTime = this.playing === true ? currentTime : this.startAt;
          const weappUrl = `/packages/edu/audio-playbg/index?alias=${this.alias}&duration=${duration}&currentTime=${currentTime}&playing=${this.playing}&isLog=${this.isLog}`;
          console.log('weappUrl----------', weappUrl);
          ZNB.navigate({
            weappUrl,
          });
          this.audio.pause();
        });
      }
    },

    hidePopTip() {
      this.popTipVisible = false;
      YZLocalStorage.setItem(TIP_STORAGE_KEY, 'no');
    },
  },
};
</script>

<style lang="scss"> // eslint-disable-line vue-scoped-css/require-scoped
.vis-audio {
  &__progress {
    padding: 0 60px;

    &::after {
      display: table;
      clear: both;
      content: '';
    }

    &_time {
      font-size: 10px;
      line-height: 14px;
      color: #fff;
    }

    &_current-time {
      float: left;
      margin-left: -44px;
    }

    &_slider {
      float: left;
      width: 100%;
      padding: 6px 0;

      &_btn {
        display: block;
        width: 14px;
        height: 14px;
        background-color: #00b389;
        border: 4px solid #fff;
        border-radius: 50%;
        box-sizing: border-box;
      }
    }

    &_duration {
      float: right;
      margin-right: -44px;
    }
  }

  &__control {
    display: flex;
    align-items: center;
    margin-top: 8px;

    &_control-item {
      flex: 1 1 auto;
      width: 100%;
    }

    &_tip {
      height: 16px;
    }

    &_back,
    &_forward {
      height: 24px;
    }

    &_action {
      display: flex;
      justify-content: center;
      height: 40px;
    }

    &_rate {
      text-align: center;

      &_label {
        display: inline-block;
        width: 40px;
        font-size: 12px;
        line-height: 18px;
        color: #fff;
        text-align: center;
        border: 1px solid #fff;
        border-radius: 10px;
        box-sizing: border-box;
      }
    }
  }

  &__pop-tip {
    position: fixed;
    top: 20px;
    right: 16px;
    padding: 16px 20px;
    font-size: 14px;
    line-height: 20px;
    color: #fff;
    text-align: right;
    background: rgba(50, 50, 51, .9);
    border-radius: 4px;

    &::after {
      position: absolute;
      top: -12px;
      right: 25px;
      border-color: transparent;
      border-bottom-color: rgba(50, 50, 51, .9);
      border-style: solid;
      border-width: 6px 5px;
      content: '';
    }

    &_icon {
      width: 20px;
      height: 20px;
      margin: 0 8px;
      vertical-align: middle;
    }

    &_button {
      display: inline-block;
      padding: 0 12px;
      margin-top: 12px;
      font-size: 12px;
      line-height: 24px;
      color: #fff;
      background: #00b389;
      border-radius: 12px;
    }
  }

  &__stick-tip {
    position: absolute;
    bottom: 56px;
    left: 13px;
    height: 30px;
    padding: 0 16px;
    font-size: 12px;
    line-height: 30px;
    color: #fff;
    background: rgba(50, 50, 51, .8);
    border-radius: 15px;

    &::after {
      position: absolute;
      bottom: -12px;
      left: 16px;
      border-color: transparent;
      border-top-color: rgba(50, 50, 51, .8);
      border-style: solid;
      border-width: 6px 5px;
      content: '';
    }
  }
  #wx-open-audio {
    position:absolute;
    bottom:16px;
    left:50%;
    transform:translateX(-50%);
  }
}
</style>
