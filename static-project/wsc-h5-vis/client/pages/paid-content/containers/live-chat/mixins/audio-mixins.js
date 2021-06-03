import get from 'lodash/get';
import Bus from '../utils/bus';

const STATUS = {
  STOP: 0,
  PLAY: 1,
  PAUSE: 2,
};

export default {
  methods: {
    play() {
      // audio 为null 两种情况
      // 1、音频加载失败
      // 2、当前加载的是本地的微信 audio id (this.item.isLoading || this.item.isError)
      // this.item.isLoading 表示当前是本地音频（还在上传中）
      // this.item.isError 表示本地音频上传失败
      if (!this.audio) {
        if (this.item.isLoading || this.item.isError) {
          this.$emit('audio-no');
          return;
        }
        window.yzStackLog.log({
          name: 'live-chat-audio',
          message: 'this.audio 为空',
          extra: {
            item: this.item,
          },
          level: 'warn',
        });
        return;
      }
      this.loadAudio(this.item);
      Bus.$emit('stop-all', this.item); // 将所有正在播放的音频样式停止

      this.audio.play();
      this.status = STATUS.PLAY;
      get(this.$listeners, 'audio-play', () => {})(this.item);
      // 全局相同音频的不同播放组件更改状态
      Bus.$emit('audio-status-playing', this.item);
    },
    pause() {
      this.audio.pause();
      this.status = STATUS.PAUSE;
      get(this.$listeners, 'audio-pause', () => {})(this.item);
    },
    stop() {
      this.audio.pause();
      this.audio.set('currentTime', 0);
      this.status = STATUS.STOP;
      get(this.$listeners, 'audio-stop', () => {})(this.item);
      // 全局相同音频的不同播放组件更改状态
      Bus.$emit('audio-status-stop', this.item);
    },
    __isSameMsg(item) {
      return typeof item.fromMsg.msgId !== 'undefined' && item.fromMsg.msgId !== '' && item.fromMsg.msgId === this.item.fromMsg.msgId;
    },
  },
  created() {
    // 接到暂停逻辑
    Bus.$on('stop-all', (item) => {
      if (this.isPlaying && this.audio) {
        this.stop();
      }
    });
    // 自动播放
    Bus.$on('play', (item) => {
      if (this.__isSameMsg(item) && (this.item.areaName === item.areaName)) {
        console.log(item.fromMsg.msgId, this.item.fromMsg.msgId);
        this.play();
      }
    });
    // 全局所有音频变更播放状态
    Bus.$on('audio-status-playing', (item) => {
      // 未发成功时 msgId 都为 undefined
      if (this.__isSameMsg(item)) {
        this.$set(this.item, 'hasRead', true);
        this.status = STATUS.PLAY;
      }
    });
    Bus.$on('audio-status-stop', (item) => {
      if (this.__isSameMsg(item)) {
        this.status = STATUS.STOP;
      }
    });
    Bus.$on('audio-status-waiting', (item) => {
      if (this.__isSameMsg(item)) {
        this.isLoading = true;
      }
    });
    Bus.$on('audio-status-canplaythrough', (item) => {
      if (this.__isSameMsg(item)) {
        this.isLoading = false;
        this.isLoaded = true;
      }
    });
    Bus.$on('audio-status-error', (item) => {
      if (this.__isSameMsg(item)) {
        this.status = STATUS.STOP;
        if (this.item.fromMsg.wxUid !== this.wxUid) {
          this.item.hasRead = false;
        }
        this.isLoading = false;
      }
    });
  },
  computed: {
    isPlaying() {
      return this.status === STATUS.PLAY;
    },
    isStop() {
      return this.status === STATUS.STOP;
    },
    isPause() {
      return this.status === STATUS.PAUSE;
    },
  },
  watch: {
    status(newValue) {
      if (newValue === STATUS.PLAY) {
        if (this.$listeners['audio-playing']) {
          const offset = this.getDomOffsetTop();
          console.info('[mixins audio-mixins] watch status offset', offset);
          this.$listeners['audio-playing'](offset);
        }
      } else {
        if (this.$listeners['audio-playing']) {
          this.$listeners['audio-playing'](false);
        }
      }
    },
  },
};
