<template>
  <div class="audio-container clearfix">
    <div
      :class="containerClass"
      :style="{
        maxWidth: audioMaxWidth + 'px',
        width: formatedWidth + 'px'
      }"
      @click="trigger"
    >
      <div
        :class="['audio__icon', {
          'audio__icon--play': isPlaying && isLoaded && !isLoading
        }]"
      />
      <van-loading
        v-if="isLoading"
        type="spinner"
        size="15px"
        class="audio__loading"
      />
      <span
        v-else
        class="audio__time"
      >
        {{ formatedDuration }}
      </span>

      <!-- 小红点 -->
      <div
        v-if="hasNotRead"
        class="audio__un-read"
      />
    </div>
  </div>
</template>

<script>

import audioMixins from '../mixins/audio-mixins';
import { Loading } from 'vant';
import {
  getGlobalConfig,
  isOnlineVoice,
} from '../utils/index';
import Audio from '../utils/audio.js';
import Bus from '../utils/bus.js';

const STATUS = {
  STOP: 0,
  PLAY: 1,
  PAUSE: 2,
};
const AUDIO_MAX_WIDTH = 196;

const {
  wxUid,
  userType,
} = getGlobalConfig();

let manmadePlayAudio = false; // 人工第一次触发音频播放

export default {

  name: 'chat-item-audio',

  components: {
    [Loading.name]: Loading,
  },

  mixins: [audioMixins],

  props: {
    content: String,
    isReply: {
      type: Boolean,
      default: false,
    },
    item: Object,
    position: {
      type: String,
      default: 'left',
      validator(value) {
        return ['left', 'right'].indexOf(value) > -1;
      },
    },
  },

  data() {
    return {
      duration: 0,
      isLoading: false,
      isLoaded: false,
      audio: null,
      status: STATUS.STOP,
      audioMaxWidth: AUDIO_MAX_WIDTH,
      userType,
      wxUid,
    };
  },

  computed: {
    formatedDuration() {
      return this.getTime(this.item.fromMsg.during);
    },
    formatedWidth() {
      return this.getWidth(this.item.fromMsg.during);
    },
    containerClass() {
      return {
        audio: true,
        'audio--reply': this.isReply,
        'audio--right': this.position === 'right',
      };
    },
    hasNotRead() {
      return !this.item.hasRead && this.item.fromMsg.wxUid !== wxUid && this.item.fromMsg.msgType === 'voice';
    },
  },

  watch: {
    content(newValue) {
      this.initAudio();
    },
  },

  created() {
    this.initAudio();
    Bus.$on('user-type', (ev) => {
      if (typeof ev.userType !== 'undefined') {
        this.userType = ev.userType;
      }
    });
  },

  mounted() {
  },

  destroyed() {
    if (this.audio) {
      this.stop();
      this.audio.set('__msgId', '');
      this.audio = null;
    }
  },

  methods: {
    getTime(number) {
      return `${parseInt(number, 10) || 1}”`;
    },
    getWidth(number) {
      let width;
      if (number > 0 && number < 20) {
        width = 80;
      } else if (number >= 20 && number < 40) {
        width = 116;
      } else if (number >= 40) {
        width = parseInt(AUDIO_MAX_WIDTH / 60 * number, 10);
      }
      return width;
    },
    loadAudio(url) {
      const eventMap = {
        waiting: () => {
          this.isLoading = true;
          Bus.$emit('audio-status-waiting', this.item);
        },
        canplaythrough: () => {
          this.isLoading = false;
          this.isLoaded = true;
          Bus.$emit('audio-status-canplaythrough', this.item);
        },
        ended: () => {
          this.status = STATUS.PAUSE;
          this.$listeners['audio-end'](this.item);

          Bus.$emit('audio-status-stop', this.item);
        },
        error: () => {
          this.status = STATUS.STOP;
          this.isLoading = false;
          this.stop(); // 结束播放状态 以及让 audio 结束
          Bus.$emit('audio-status-error', this.item);
          console.info('音频加载错误');
        },
      };
      this.audio && this.audio.loadAudio(url, (event) => {
        eventMap[event]();
      });
    },
    initAudio() {
      const content = this.content;

      // 包含 mp3 说明是非本地文件
      if (isOnlineVoice(content)) {
        this.audio = new Audio();
        this.initAudioStatus();
        this.initAutoPlayAudio();
      }
    },
    initAudioStatus() {
      // 各个区块的音频播放展示联动
      if (!this.audio.get('paused') && this.audio.get('__msgId') === this.item.fromMsg.msgId) {
        this.status = STATUS.PLAY;
        this.isLoaded = true;
      }
    },
    initAutoPlayAudio() {
      // 自动播放音频功能
      if (manmadePlayAudio && this.audio.get('paused') && this.item.areaType === 'socket' && this.userType !== 1) {
        console.info('[ChatItemAudio] initAutoPlayAudio');
        setTimeout(() => {
          this.play();
        }, 3000);
      }
    },
    trigger() {
      if (!this.isPlaying) {
        console.log('点击音频 开始播放');
        manmadePlayAudio = true;
        this.play();
      } else {
        console.log('点击音频 结束播放');
        this.stop();
      }
    },
  },

  inject: ['getDomOffsetTop'],
};
</script>

<style lang="scss" scoped>
  @import 'mixins/index.scss';

  .audio-container {
    display: block;

    @include clearfix;
  }

  .audio {
    position: relative;
    float: left;
    height: 36px;
    max-width: 196px;
    min-width: 60px;
    padding-right: 10px;
    line-height: 36px;
    text-align: right;
    background-color: #fff;
    border-radius: 2px;
    box-sizing: border-box;

    &.audio--reply {
      border: 1px solid #e5e5e5;
    }

    &.audio--right {
      float: right;
    }

    .audio__icon {
      position: absolute;
      top: 50%;
      left: 10px;
      width: 9px;
      height: 12px;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAcCAYAAABh2p9gAAAAAXNSR0IArs4c6QAAAeRJREFUSA29lD9oFFEQh79ZLupdY0qtRNKlSxEsEgjJ7V1EsA5JkQRTmCKQRhAtTEoNWNopWAW1FJHz9g4xmCJcINikUMQqEFIliEbuLvsyz+RgPXb39v7gNPv2zcz3Zn77dqDHJrfKXKsaHgn8pI9n3hjfujnDqRneYLhjDMtU2cmVme8GKG4JX4Fa4D+2nkmz+HZUq27TnBCYRcz8/sPOzRLDbfJwIhMMA3XYdMvcUzmaO4hME9fTGluY0j5IhtniCActQmMqDGTqiZP+MV/yJXKB7dBldMvN4YYrvlaaK/F49SOpZnfjPTnQZqiWquf9zTqf85+43oAEn+0BzzNVghu+3lmVYCoIs+uOgOeQy77hlUrw/PY2mQa4G+BfhkqwcHxIZXKDq3aja+AZlcGTGg96B1SSmLP73JsKhd2LwlpPKhThRbqf4XdZ9iww8oJaZws7coS7RZfXwbiOgPpvb8kFpotj/AjC7Lo9DQWjLT4ZSTEaBrPA5BUK+3r6rLboeTYzwpIBhYKTZi7J+IoHCjUdrQ+9CZ5qqy3npi06Gih8V+d0IUsl8bhWoH55TkLkWM9cYqjgUgnxxW6ljLChzYzbKIX/0u++5GV5GZsV40wpbF5JKwozfbD2PsvXmPj/7zoFdmB697uNPj4AAAAASUVORK5CYII=');
      background-repeat: no-repeat;
      background-size: cover;
      transform: translateY(-50%);

      &--play {
        width: 12px;
        height: 12px;
        background-image: url('//img01.yzcdn.cn/public_files/2018/05/22/53cf54713a9109694934675fb023190c.gif');
      }
    }

    .audio__time {
      font-size: 12px;
      color: #999;
    }

    .audio__loading {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }

    .audio__un-read {
      position: absolute;
      top: 50%;
      right: -14px;
      width: 6px;
      height: 6px;
      background-color: #f44;
      border-radius: 50%;
      transform: translateY(-50%);
    }
  }
</style>
