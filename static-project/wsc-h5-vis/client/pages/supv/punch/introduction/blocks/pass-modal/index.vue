<template>
  <bottom-modal
    is-show
    :bottom="passModalBottom"
    @hideModal="onHideModal"
  >
    <div class="m-pass-content">
      <div class="u-title">
        输入密码
      </div>
      <div :class="['u-desc', isError ? 'u-desc-error' : '']">
        {{ participatePasswordCopy }}
      </div>
      <div :class="['u-input-box', isError ? 'u-input-box-error' : '']">
        <van-field
          v-model="passwordVal"
          class="u-input"
          :type="isPasswordType ? 'password' : 'text'"
          :autofocus="focus"
          @focus="onFocus"
        />
        <a
          v-if="!isPasswordType"
          class="u-switch"
          @click="onTogglePasswordType"
        >
          隐藏
        </a>
        <a
          v-if="isPasswordType"
          class="u-switch"
          @click="onTogglePasswordType"
        >
          显示
        </a>
        <a
          class="u-btn u-btn-confirm"
          @click="onSendPassword"
        >
          确定
        </a>
      </div>
    </div>
  </bottom-modal>
</template>

<script>
import { Field } from 'vant';
import BottomModal from '../../../components/bottom-modal';

export default {
  name: 'pass-modal',
  components: {
    'van-field': Field,
    'bottom-modal': BottomModal,
  },
  props: {
    passModalBottom: {
      type: Number,
      default: 0,
    },
    participatePasswordCopy: {
      type: String,
      default: '',
    },
    isError: {
      type: Boolean,
      default: false,
    },
    passwordVal: {
      type: String,
      default: '',
    },
    isPasswordType: {
      type: Boolean,
      default: true,
    },
    focus: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    passwordVal(val) {
      this.$emit('passwordChange', val);
    },
  },
  methods: {
    onHideModal() {
      this.$emit('hideModal');
    },
    onFocus() {
      this.$emit('focus');
    },
    onTogglePasswordType() {
      this.$emit('togglePasswordType');
    },
    onSendPassword() {
      this.$emit('sendPassword');
    },
  },
};
</script>

<style lang="scss" scoped>
/* 密码弹窗 */
.m-pass-content {
  margin: 40px 30px 50px;
  background-color: #fff;
}
.m-pass-content .u-title {
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  color: #333;
}
.m-pass-content .u-desc {
  margin-bottom: 28px;
  max-height: 34px;
  font-size: 14px;
  text-align: center;
  color: #333;
  line-height: 17px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.m-pass-content .u-desc-error {
  color: #e83939;
}
.m-pass-content .u-input-box {
  position: relative;
  margin: 0 auto;
  padding-left: 20px;
  width: 290px;
  height: 44px;
  line-height: 44px;
  border: 1px solid #bbb;
  border-radius: 100px;
}
.m-pass-content .u-input-box-error {
  border: 1px solid #e83939;
}
.u-input-box .u-input {
  padding-left: 22px;
  width: 170px;
  height: 44px;
  line-height: 44px;
  padding: 1px 0 0 16px;
}
.u-input-box .u-switch {
  position: absolute;
  top: 0;
  right: 75px;
  padding: 0 10px;
  line-height: 44px;
  font-size: 13px;
  color: #00b389;
  text-align: center;
}
.u-input-box .u-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 66px;
  height: 34px;
  line-height: 34px;
  border-radius: 100px;
  font-size: 14px;
  text-align: center;
}
.u-input-box .u-btn-confirm {
  color: #fff;
  background-color: #00b389;
}
</style>
