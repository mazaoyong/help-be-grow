<template>
  <div
    ref="inputWrap"
    class="controll-footer-wrap"
  >
    <div
      v-if="userType === 1"
      class="controll-footer"
    >
      <div
        class="audio"
        @click="openAudio"
      >
        <icon
          class="audio__icon"
          symbol="live_audio"
        />
      </div>
      <div class="input">
        <van-field
          ref="input"
          v-model="userInput"
          class="input__textarea js-input"
          type="textarea"
          :autosize="{
            maxHeight: 50
          }"
          rows="1"
        />
      </div>

      <template
        v-if="!textSendStatus"
      >
        <van-uploader
          class="source"
          :after-read="sendImg"
          multiple
          accept="image/*"
        >
          <icon
            class="source__icon"
            symbol="source"
          />
        </van-uploader>
        <div
          class="setting"
          @click="triggerOperate"
        >
          <icon
            class="setting__icon"
            symbol="setting"
          />
        </div>
      </template>
      <div
        v-else
        class="text-send"
        data-id="send"
        @click="sendText"
      >
        发送
      </div>

      <audio-container-popup
        v-model="audioDisplay"
        v-on="$listeners"
      />
    </div>

    <div
      v-else
      class="controll-footer controll-footer--student"
    >
      <div
        :class="['input', {
          'input--disabled': isRoomForbid
        }]"
      >
        <van-field
          ref="input"
          v-model="userInput"
          class="input__textarea js-input"
          type="textarea"
          :placeholder="mutePlaceholder"
          :autosize="{
            maxHeight: 50
          }"
          :disabled="isRoomForbid || isForbid"
          rows="1"
        >
          <van-checkbox
            v-if="!(isRoomForbid || isForbid)"
            slot="button"
            v-model="questionChecked"
          >
            提问
          </van-checkbox>
        </van-field>
      </div>

      <div
        v-if="!textSendStatus"
        class="controll-area"
      >
        <div
          v-if="!isRoomForbid"
          class="talk"
          @click="triggerTalk"
        >
          <icon
            class="talk__icon"
            symbol="talk"
          />
        </div>
        <div
          class="setting"
          @click="triggerOperate"
        >
          <icon
            class="setting__icon"
            symbol="setting"
          />
        </div>
      </div>

      <div
        v-else
        class="text-send"
        data-id="send"
        @click="sendTextWrap"
      >
        发送
      </div>
    </div>
  </div>
</template>

<script>
import svgIcon from 'components/svg-icon';
import { Field, Uploader, Toast, Checkbox } from 'vant';
import UA from 'zan-utils/browser/ua_browser';

import { versionCompare } from '@/common/utils/index.js';

import AudioPopup from './ChatControllAudio.vue';
import { newMsg } from '../../../utils/msg';
import ImgHandler from '../../../utils/imgHandler';
import { IMG_UPLOAD_MAX } from '../../../constants.js';

export default {
  name: 'chat-controll',

  components: {
    icon: svgIcon,
    'van-field': Field,
    'van-uploader': Uploader,
    'van-checkbox': Checkbox,
    'audio-container-popup': AudioPopup,
  },

  props: {
    userType: {
      type: Number,
      default: 2,
    },
    isAsk: Boolean,
    isRoomForbid: {
      type: Boolean,
      default: false,
    },
    isForbid: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      userInput: '',
      $elInput: null,
      audioDisplay: false,
      imgMaxSize: IMG_UPLOAD_MAX,
      questionChecked: this.isAsk,
      canScroll: false,
      isFocus: false,
    };
  },

  computed: {
    textSendStatus() {
      return !!this.userInput.trim();
    },
    mutePlaceholder() {
      console.log('this.questionChecked', this.isRoomForbid, this.isForbid, this.questionChecked);
      let placeholder = ' ';
      if (this.isRoomForbid) {
        placeholder = '本直播间当前为禁言状态';
      } else if (this.isForbid) {
        placeholder = '当前为禁言状态';
      } else if (this.questionChecked) {
        placeholder = '发表提问';
      }
      return placeholder;
    },
  },

  watch: {
    questionChecked(newValue) {
      this.$emit('question-mode-changed', newValue);
    },
    isAsk(newValue) {
      this.questionChecked = newValue;
    },
    audioDisplay(newValue) {
      this.$emit('trigger-audio-display', newValue);
    },
  },

  mounted() {
    this.polyfillInput();

    ImgHandler.addImgStatusListener((data) => {
      const handleMap = {
        end: () => {
          this.$emit('img-send', data.value);
        },
        'end-parsed': () => {
          this.$emit('img-parsed', data.value);
        },
      };
      handleMap[data.type]();
    });

    ImgHandler.addErrorListener((data) => {
      const handleMap = {
        error: () => {
          this.$emit('img-error:network', data.value);
        },
      };
      handleMap[data.type]();
    });
  },

  methods: {
    sendText() {
      // 键盘弹起时 hack
      // if (document.body.scrollTop > 0) {
      //   this.$elInput.focus();
      // }
      this.canScroll && this.$elInput.focus();
      const currUserInput = this.userInput.trim();
      console.log(' 点击发送按钮 发送文字 ', currUserInput);

      if (!currUserInput) return;
      if (currUserInput.length >= 500) {
        return Toast('字数限制最大500');
      }
      const msg = newMsg({
        msgType: 'text',
        content: currUserInput,
      });
      this.$emit('msg-send', msg);
      this.$emit('msg-parsed', msg);
      this.userInput = '';
    },

    sendTextWrap() {
      console.log('test click sendTextWrap');
      this.sendText();
    },

    sendImg(file) {
      const img = new ImgHandler({
        file,
        maxSize: IMG_UPLOAD_MAX,
      });
      img.uploadImg();
    },

    openAudio() {
      this.audioDisplay = true;
    },

    triggerOperate() {
      this.$emit('trigger-operate');
    },

    triggerTalk() {
      this.$emit('trigger-talk');
    },

    polyfillInput() {
      const iosVersion = `${UA.getIOSVersion()}`;
      // 11.0.0 - 11.3.0 版本的 ios 有问题，无法使用这种方式
      const canScroll = versionCompare(iosVersion, '11.0.0') || versionCompare('11.2.6', iosVersion) || UA.isAndroid();

      // 是否是点了发送按钮 处理 6.7.4 微信问题
      let touchPressBefore = false;

      this.canScroll = canScroll;

      this.$elInput = document.querySelector('.js-input .van-field__control');
      const $inputWrap = this.$refs.inputWrap;
      if (!canScroll) {
        // this.sendTextWrap = () => {};
        $inputWrap.style.position = 'absolute';
        document.body.addEventListener('touchend', (ev) => {
          if (ev.target.getAttribute('data-id') === 'send') {
            console.log('test click touchend');
            setTimeout(this.sendText, 350);
          }
        });
      }
      this.$elInput.addEventListener('focus', (ev) => {
        this.isFocus = true;
        // ios 大于 12.2 的机型 input 不会被键盘阻挡，取消兼容
        // ios < 11 && 11.2.6 < ios < 12.2 && android
        if (versionCompare(iosVersion, '11.0.0') ||
          (versionCompare('11.2.6', iosVersion) && versionCompare(iosVersion, '12.2.0')) ||
          UA.isAndroid()
        ) {
          ((count) => {
            let now = 0;
            let timer = setInterval(() => {
              document.body.scrollTop = document.body.scrollHeight;
              ++now;
              if (now === count) {
                clearInterval(timer);
                timer = null;
              }
            }, 400);
          })(2);
        } else if (versionCompare(iosVersion, '12.2.0')) { // 11.0.0 < ios < 11.2.6
          setTimeout(function() {
            // 根据 375 屏  标明 input 被遮挡了
            let diffScrollTop = 270;

            // 新版微信中 ios 底部
            // 历史堆栈大于1 会出现导航
            if (history.length > 1) {
              diffScrollTop = 250;
            }
            if (document.body.scrollTop < diffScrollTop) {
              $inputWrap.style.marginBottom = '42px';
            }
          }, 400);
        }
      });
      this.$elInput.addEventListener('blur', (ev) => {
        this.isFocus = false;

        // hotfix: 底部消息被遮挡
        // if (!canScroll) {
        //   $inputWrap.style.marginBottom = '0';
        // }
        $inputWrap.style.marginBottom = '';

        // 解决微信6.7.4版本 ios bug
        // 失去焦点时页面不会回滚
        if (UA.isIOS()) {
          if (!touchPressBefore) {
            window.scrollTo(0, 0);
          } else {
            touchPressBefore = false;
          }
        }
      });

      // 解决微信6.7.4版本 ios bug
      // 失去焦点时页面不会回滚
      if (UA.isIOS()) {
        document.body.addEventListener('touchend', (ev) => {
          if (ev.target.getAttribute('data-id') === 'send') {
            // 没有键盘时，置为 false
            if (this.isFocus) {
              touchPressBefore = true;
            } else {
              touchPressBefore = false;
            }
          } else {
            touchPressBefore = false;
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import 'mixins/index.scss';

  @mixin icon {
    width: 30px;
    height: 30px;
  }

  @mixin input {
    flex: 1;
    margin-bottom: 5px;
    margin-right: 10px;
    border: 1px solid #e5e5e5;
    border-radius: 2px;

    &__textarea {
      padding: 6px 15px;

      .van-field__button {
        align-self: flex-end;
      }
    }
  }

  .controll-footer-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .controll-area {
    display: flex;
    flex-direction: row;
  }

  .controll-footer {
    min-height: 50px;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    padding-top: 5px;
    padding-right: 10px;
    border-top: 1px solid #e5e5e5;

    @include clearfix;

    .input {
      @include input;
    }

    .audio {
      margin: 0 10px 7px;

      &__icon {
        @include icon;
      }
    }

    .source {
      margin-bottom: 9px;
      margin-right: 10px;
      width: 31px;
      height: 30px;
      overflow: hidden;

      &__icon {
        @include icon;
      }
    }

    .setting {
      margin-bottom: 7px;

      &__icon {
        @include icon;
      }
    }
  }

  .controll-footer--student {

    .input {
      @include input;

      &__checkbox {
        align-self: flex-end;
      }

      width: 73%;
      margin-left: 10px;

      &--disabled {
        width: 315px;
      }
    }

    .talk {
      margin: 0 10px 7px 0;

      &__icon {
        @include icon;
      }
    }
  }

  .text-send {
    width: 70px;
    line-height: 36px;
    text-align: center;
    background-color: #4b0;
    color: #fff;
    font-size: 14px;
    margin-bottom: 7px;
    border-radius: 2px;
  }
</style>
