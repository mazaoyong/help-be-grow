<template>
  <van-action-sheet
    v-model="displayValue"
    @click-overlay="resetCommentEditorStatus"
    :title="title"
    class="vis-shared-moments-comment"
  >
    <div class="vis-shared-moments-comment__input">
      <van-field
        ref="searchVm"
        v-model="localComment"
        :autofocus="true"
        class="vis-shared-moments-comment__field"
        type="textarea"
        :placeholder="placeholder"
        :autosize="{ maxHeight: 300, minHeight: 64 }"
        @blur="polyfillWechatBlur"
        @focus="polyfillWechatFocus"
      />
      <van-button
        size="small"
        type="primary"
        class="vis-shared-moments-comment__btn"
        :disabled="!localComment.trim()"
        data-id="send"
        @click="createComment"
      >
        发送
      </van-button>
    </div>
  </van-action-sheet>
</template>

<script>
import {
  Button,
  Field,
  ActionSheet,
  Toast,
} from 'vant';
import UA from '@youzan/utils/browser/ua_browser.js';

// 是否是点了发送按钮 处理 6.7.4 微信问题
export default {
  components: {
    'van-button': Button,
    'van-field': Field,
    'van-action-sheet': ActionSheet,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      displayValue: false,
      localComment: this.comment,
      touchPressBefore: false,
      isFocus: false,
    };
  },

  watch: {
    value(newVlaue) {
      this.displayValue = newVlaue;
    },
    displayValue(newVlaue) {
      if (typeof newVlaue === 'boolean' && !newVlaue) {
        this.$emit('input', false);
      }
    },
    comment(newValue) {
      this.localComment = newValue;
    },
  },

  computed: {
    title() {
      if (this.placeholder.search('回复') > -1) {
        return '回复';
      }
      return '评论';
    }
  },

  mounted() {
    this.polyfillWechatScroll();
  },

  methods: {
    resetCommentEditorStatus() {
      this.localComment = '';
      this.$emit('close');
    },

    polyfillWechatBlur() {
      this.isFocus = false;
      // 34 兼容 iphonex
      // 解决微信6.7.4版本 ios bug
      // 失去焦点时页面不会回滚
      if (UA.isIOS()) {
        if (!this.touchPressBefore) {
          window.scrollTo(0, 34);
        } else {
          this.touchPressBefore = false;
        }
      }
    },

    polyfillWechatFocus() {
      this.isFocus = true;
    },

    polyfillWechatScroll() {
      // 解决微信6.7.4版本 ios bug
      // 失去焦点时页面不会回滚
      if (UA.isIOS()) {
        document.body.addEventListener('touchend', (ev) => {
          if (ev.target.getAttribute('data-id') === 'send') {
            // 没有键盘时，置为 false
            if (this.isFocus) {
              this.touchPressBefore = true;
            } else {
              this.touchPressBefore = false;
            }
          } else {
            this.touchPressBefore = false;
          }
        });
      }
    },

    createComment() {
      const comment = this.localComment || '';
      this.polyfillWechatBlur();

      if (comment.trim().length === 0) {
        return Toast('内容不能为空');
      }

      this.$emit('creat', comment);
    },
  },
};
</script>

<style lang="scss">
  .vis-shared-moments-comment {
    .van-action-sheet__close {
      display: none;
    }

    .van-hairline--bottom {
      &::after {
        content: none;
      }
    }

    &__input {
      // width: 343px;

      min-height: 80px;
      background-color: #f7f7f7;
      border-radius: 4px;
      margin: 0 16px 17px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
    }

    &__field {
      width: 80%;
      background-color: #f7f7f7;

      textarea {
        font-size: 16px;

        &::-webkit-input-placeholder {
          color: #969799;
          font-size: 16px;
        }

        caret-color: #00b389;
      }
    }

    &__btn {
      margin: 0 8px 8px 0;
    }
  }
</style>
