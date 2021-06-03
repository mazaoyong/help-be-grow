import BackToAudio from '../components/BackToAudio.vue';
import find from 'lodash/find';

export default {
  components: {
    'back-to-audio': BackToAudio,
  },
  data() {
    return {
      displayBackToAudio: false,
      audioPlayVm: null,
    };
  },
  methods: {
    handleScrollWrap() {
      const audioPlayItem = this.findAudioPlayItem();
      if (audioPlayItem) {
        this.handleAudioPlay(audioPlayItem.getDomOffsetTop());
      }
    },
    handleAudioPlay(ev) {
      if (typeof ev === 'boolean' && !ev) {
        return (this.displayBackToAudio = false);
      }
      const scrollTop = this.$refs.chat.getScrollHeight();
      const audioPlayOffsetTop = ev;
      const scrollHeight = this.$refs.chat.getWrapperHeight();
      console.info('[mixins-back-to-audio] 某条音频开始播放（被动或主动）scrollTop offset scrollHeightall', scrollTop, ev, scrollTop + scrollHeight);

      if (audioPlayOffsetTop >= scrollTop && audioPlayOffsetTop <= (scrollTop + scrollHeight)) {
        this.displayBackToAudio = false;
      } else {
        this.displayBackToAudio = true;
      }
    },
    findAudioPlayItem() {
      this.displayBackToAudio = false;

      if (window.__paidcontent_live_audioManager && !window.__paidcontent_live_audioManager.paused) {
        // 有音频播放时才有逻辑
        if (this.audioPlayVm &&
          window.__paidcontent_live_audioManager &&
          window.__paidcontent_live_audioManager.__msgId === this.audioPlayVm.item.fromMsg.msgId) {
          // 滑动读取缓存的 vm
        } else {
          this.audioPlayVm = find(this.$refs.chatItem, (item) => {
            return item.item.fromMsg.msgId === window.__paidcontent_live_audioManager.__msgId;
          });
          console.info('[mixins-back-to-audio] 滑动读取赋值新 vm', this.audioPlayVm.item);
        }
        return this.audioPlayVm;
      }
    },
    backToAudio() {
      console.log('[mixins-back-to-audio] click backToAudio');
      const audioPlayItem = this.findAudioPlayItem();
      if (audioPlayItem) {
        const offsetTop = audioPlayItem.getDomOffsetTop() - 250;
        this.$refs.chat.scrollTo(offsetTop, true);
      }
    },
  },
};
