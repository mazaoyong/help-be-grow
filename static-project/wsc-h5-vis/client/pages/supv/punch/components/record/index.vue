<template>
  <van-popup
    v-model="popUpDisplay"
    position="bottom"
    :overlay="false"
    :lock-scroll="false"
    class="audio-popup-wrap"
  >
    <div class="audio-popup">
      <div class="audio-popup__close">
        <van-icon
          class="audio-popup__close-icon"
          name="arrow"
          @click="closeAudio"
        />
      </div>
      <div class="audio-popup__controll">
        <div
          v-if="!isRecording"
          class="audio-popup__controll-starter"
          @click="startRecord"
        >
          <i class="audio-popup__start-icon" />
          <p class="audio-popup__start-title">
            单击录音
          </p>
        </div>
        <div
          @click="stopRecord"
        >
          <van-circle
            v-if="isRecording"
            v-model="audioRemainBug"
            class="audio-popup__controll-recording"
            color="#4b0"
            layer-color="#f4f4f4"
            size="80px"
            :rate="audioRecordDuration"
          >
            <div
              class="audio-popup__recording-text"
            >
              发送
            </div>
          </van-circle>
        </div>
      </div>
      <div
        class="audio-popup__cancel"
        @click="cancelRecord"
      >
        <i class="audio-popup__cancel-icon" />
      </div>
    </div>

    <div class="audio-desc">
      <p
        v-if="!isRecording"
        class="audio-desc__init"
      >
        录音满60s将自动发送，并录制下一条
      </p>
      <template
        v-else
      >
        <p
          v-if="remainRecordTime > 10"
          class="audio-desc__recording"
        >
          <span>{{ remainRecordTime + 's' }}</span>
          <span>/60s</span>
        </p>
        <p
          v-else
          class="audio-desc__recording-less10"
        >
          <span class="audio-desc__recording-less10-text">
            {{ remainRecordTime + 's' }}
          </span>
          后语音自动发送，并启动下一条录音
        </p>
      </template>
    </div>
  </van-popup>
</template>

<script>
import { Popup, Icon, Circle, Toast } from 'vant';
import { WxAudio } from '../../utils';
import { WX_AUDIO_RECORD_DIFF_TIME } from 'pct/constants';

export default {
  name: 'record',

  components: {
    'van-popup': Popup,
    'van-icon': Icon,
    'van-circle': Circle,
  },

  props: {
    value: Boolean,
    maxAudiosLength: Number,
    audiosLength: Number,
  },

  data() {
    return {
      popUpDisplay: this.value,
      isRecording: false, // 是否正在录音
      remainRecordTime: 60,
      startTime: 0, // 开始录音标记
      wxAudioManager: null,
      timer: null,
      audioRemainBug: 0, // bug ?
    };
  },

  computed: {
    // 进度条
    audioRecordDuration() {
      return (60 - this.remainRecordTime) * (100 / 60);
    },
  },

  watch: {
    value(newValue) {
      this.popUpDisplay = newValue;
    },
  },

  mounted() {
    this.wxAudioManager = new WxAudio();

    // 监听一分钟自动结束录音的事件
    WxAudio.addRecordMinuteListener(data => {
      const handleMap = {
        end: () => {
          this.$listeners['audio-send'](data.value);
        },
        'end-parsed': () => {
          this.$listeners['audio-parsed'](data.value);
        },
        start: () => {
          // this.remainRecordTime = 60;
          this.startMinuteLeft();
        },
      };
      handleMap[data.type]();
    });

    // 监听主动结束录音的事件
    WxAudio.addRecordListener(data => {
      const handleMap = {
        end: () => {
          this.$listeners['audio-send'](data.value);
          this.isRecording = false;
          this.endMinuteLeft();
        },
      };
      handleMap[data.type]();
    });

    // 监听错误
    WxAudio.addErrorListener(data => {
      const handleMap = {
        error: () => {
          this.$listeners['audio-error:network'](data.value);
          console.info('[ChatControllAudio] 错误 error');
        },
        'error-wxerr': () => {
          const textmMap = {
            'stop-fail': '当前语音录制失败，请重试',
            'onVoiceRecordEnd': '当前语音录制已撤销',
          };
          this.cancelRecord(textmMap[data.value]);
          console.info('[ChatControllAudio] 错误 error-wxerr');
        },
      };
      handleMap[data.type]();
    });
  },

  methods: {
    closePopup() {
      this.$emit('input', false);
    },
    closeAudio() {
      if (this.isRecording) {
        this.wxAudioManager.resetRecord()
          .then(url => {
            this.isRecording = false;
            Toast('已退出语音录制');
            this.endMinuteLeft();
            this.closePopup();
          });
      } else {
        this.closePopup();
      }
    },
    startRecord() {
      if (this.audiosLength > this.maxAudiosLength - 1) {
        Toast(`录音数量上限${this.maxAudiosLength}条`);
        return;
      }
      !this.isRecording && this.wxAudioManager.startRecord()
        .then(() => {
          this.startTime = +new Date();
          this.isRecording = true;
          this.startMinuteLeft();
        })
        .catch(err => {
          console.log('err: ', err);
        });
    },
    stopRecord() {
      if (+new Date() - this.startTime < WX_AUDIO_RECORD_DIFF_TIME) {
        this.wxAudioManager.resetRecord()
          .then(() => {
            this.isRecording = false;
            this.endMinuteLeft();
            Toast('录音时间过短');
          })
          .catch(() => {
            this.isRecording = false;
            this.endMinuteLeft();
            Toast('录音时间过短');
          });
      } else {
        this.wxAudioManager.stopRecord(60 - this.remainRecordTime);
      }
    },
    cancelRecord(text) {
      this.isRecording && this.wxAudioManager.resetRecord()
        .then(url => {
          this.isRecording = false;
          this.endMinuteLeft();
          const msg = typeof text === 'string' && !!text ? text : '';
          Toast(msg || '当前语音已撤销');
        });
      this.$emit('cancel');
    },
    startMinuteLeft() {
      this.wxAudioManager.startMinuteLeft((time) => {
        this.remainRecordTime = time;
      });
    },
    endMinuteLeft() {
      this.remainRecordTime = 60;
      this.wxAudioManager.clearMinuteTimer();
    },
  },
};
</script>

<style lang="scss">
  @import 'mixins/index.scss';

  .audio-popup-wrap {
    height: 216px;
    background-color: #fff;
    border-top: 1px solid #e5e5e5;
    border-radius:12px 12px 0 0;
    box-shadow:0 2px 15px rgba(0,0,0,.14);

    .audio-popup {
      @include clearfix;

      &__close {
        width: 33%;
        text-align: center;
        float: left;
        margin-top: 102px;
      }

      &__close-icon {
        transform: rotate(90deg);
        font-size: 13px;
        color: #666;
      }

      &__controll {
        width: 33%;
        float: left;
        margin-top: 68px;
      }

      &__controll-starter {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: #4b0;
        color: #fff;
        text-align: center;
        overflow: hidden;
        margin: 0 auto;
        user-select: none;
      }

      &__start-icon {
        display: block;
        width: 20px;
        height: 26px;
        margin: 17px auto 0;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAA0CAYAAAD46nqNAAAAAXNSR0IArs4c6QAAA2hJREFUaAXtmT9PFEEYxjlMRLGQmNhgBSb8K4wYJTHR3AewsaDSig9gaaGdlbE2NlR+BEoKY4FGQkyQQAMFjYloIaDBaKLR9fesM8fc3O64ZHfHM7kneZg/7zvv+9zs7c7eS6OvBJIkmWb5TXgdnoPDUNiB7+ALuNBoNN7QxgPCZuEmLAr5ztaukCQjcLmoqgw/rR2pRSiBm/AjLAvFaFYqUgHhd1gVFKsakQTSZa1i5/wPp5jlLzdBynznfFH+eLnUpSaa7ta6Eby7G6FPgLJN7OMhnwpsWzwnJ/Li9OcZEKeHcN3ilH7c5MqUkisQb50QsZCbKyRQx1cs5OYKCdTZGgu5uUIC7cEfQ2Rurty7WM+WGMpsDu7kTC2hHbRr/2nbE1h2+3s72NvBsjtQdn3vO1h6BzkwvunUACfKBqtqvbSkipLkqy7xngl8pqoEFcSxWva7XeDefyFw11ySs96l+eKN6xweeMGtll3t4IYxXvKcVACKhfdeIqtlQwLtb9OrnpOqU7Hg57JaliVwBerldIZb+5ijSKWzWGjlMhpmSCxNK/28yO7T2YKn4EVosWA7EVo3lzRIi34vp48Z5V/UH3DrT9PXh1FFRwmvGxLiFjitBquJvUySSfPk3qM9aRXRj1r6UG4oDcKk1ZG2TCyl00ky5xqYi1Y8Itec0bDkarACbxvjGm3rZqEfpfymnFC5BXuZD3UyOQC3ZAV3Dy3pV6DJXK0FTOWEgjQcd/O3+hia8BfUG05b4YhxE1ZRyOwoASsXVE7lDldecZiHwis40FJPh3HlRXTlMLloknk3X2YfpyH4Vt5gEXa8JzJXyb8hFNvkoElzDmWK8idxHoM7WgWewUHfR2Pmp+ED+Bzqu3NgqL7mZFOdsQPMD0LFFpRrrMMpNMGCCfgBCqvwcsj/KDbFMjFp0hy5FdZgXBZPwW1FAT/hE3g6uChg1FoTQ7EExZ4KLPm7iQB6uj+CP6DwCT6FN2D248AJKx/jqzVaKyiWYrZOLWdJWzez5NXmYQYE0yH+GF5z7J/pv4Z6d7SUedjhFfrurr9kfIfzd422eiB0FN6H67Ao5Ks1o0dVVHgHswKT8DzzF6Ae6g89n3uM9Ta0zm5te7bCw1IC3SzaSneMqEpi6426q1H4U/o7VPZTFd3hrt/B35pUy8jF50psAAAAAElFTkSuQmCC) no-repeat;
        background-size: cover;
      }

      &__start-title {
        font-size: 12px;
        margin-top: 6px;
      }

      &__controll-recording {
        margin: 0 auto;
        display: block;
        overflow: hidden;
      }

      &__recording-text {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #4b0;
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 60px;
        margin: 10px auto;
      }

      &__cancel {
        width: 33%;
        float: left;
      }

      &__cancel-icon {
        display: block;
        width: 24px;
        height: 16px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAgCAYAAABU1PscAAAAAXNSR0IArs4c6QAAA49JREFUWAnNmE1oE0EUx93dWG2K5OAlOYgXKR5EkSIFQUHIRdCDJz34QYu0aUrQeIh60KYFwcZDFOknaLXYS/HqrSIKCiUHRXoSQURovSgVqdgaE3+vdJft5mN2kxB34DGbmf977//febM7G22Ly9bb23upWCzedQlvGkxzk6m/v789n8+/Q0CrG3wzMQFVstnZWWNubm4aXKumaY8mJia6VD7NmO/p6SlKHl2VDPJXwXRC/gsrcFmFb/Z8VQHU/QEIDWCitmtycvJHswmq8lUUkE6nW7jjUjot2Ail81wV7H/MVxSwtLSUhtB+7CMmZeTLVlYAG6STu5+i7guBQOACpfPLl+whVSIgmUzKo1JKx8DujI6OvqH3bSsRsLKychu27dz9hUgkcrMW5uwfPR6PH3brK1jxcYu34zY5UTrHmExgfxBwnqBrdrCba0pPY/9M8eJ7FYvFzqh8BCNY8RFfFd45bwlIpVI7mJzC4K4NjY+Pv3WC3fzGt4h9AmsUCoUn1UTInGAEKz7i6yaHHWMJWF5elnPObixH6UgZ1dwQn9Z1fZAAFUXYyQtWfGpJuC6AYCdw7sZ+Y1I6+VqC2X2qiWgUecmncVDbSQ0uUH9h7sQVEmftROq9hmyaMhkgzl/in5V4ZtnUc+etsxDkR4Q8cV+OjY01/LhsXwnyzEB+hlxGPeTlJpjN2gNsIM9PADOIqhcRhH+KAMmny7WMqfzczOvBYDBOwK8EP8pyJ904ecVwKDxN/FOmn1zLmPm7nl7PZrPfCXhRgtDforb21hPQ6btB3iobKR0wBrlmGiFivYQ46zxjFR4QeDs2zVNI+aHjJFrut5O8lI1zT9QrwtoDoVBIyuczdmhxcfF6OUJexsqRN/0bKcISkMlkfpKgC5O34Q32w0Ezode+GnkzVqNEWAIkMKX0gu4+tpUanU4kEttk3EvDT55mMUz5qLSLEJ8NXy/pSo/TbW1t14jwgWD7VldXhzxFA8xeKhqGcZK+Wwiq/AUj2A0fWX1PTe5WSZMPGgZfE1gj8BE/fhNYb+IS9gxQSvM87oZZBZ039WPAwXI4P4xt2gN2QuFweJDf77E9LETGPuen64oC5GOG8jkH2TVWIt7X1xf1E3GTS0UBAuBwJysgK6FxCHtIKYVk3E+tqgAhGo1Gh+nmWYVd9PdkzE+t7FPISdDPf+7KXyfKlsvlvnV0dMib+rgS3GTAP3ohowT09H5XAAAAAElFTkSuQmCC) no-repeat;
        background-size: cover;
        margin: 100px auto 0;
      }
    }

    .audio-desc {
      padding-top: 20px;
      color: #9b9b9b;
      font-size: 12px;
      text-align: center;

      &__recording-less10-text {
        color: #4b0;
      }
    }
  }
</style>
