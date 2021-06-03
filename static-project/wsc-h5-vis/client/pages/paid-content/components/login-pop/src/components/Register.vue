<template>
  <div class="vm-register">
    <vm-input
      id="phone"
      v-model="telData"
      label-name="手机号"
      type="tel"
      name="phone"
      placeholder="请输入你的手机号"
      :disabled="true"
      :maxlength="11"
      :show-cancel="false"
    />

    <div class="captcha">
      <span class="captcha-label">
        验证码
      </span>
      <vm-captcha
        v-model="verifyCodeData"
        :phone="telData"
        placeholder="请输入验证码"
        :captcha-url="captchaUrl"
        :image-captcha-url="imageCaptchaUrl"
        :check-image-captcha-url="checkImageCaptchaUrl"
        :biz="captchaBiz"
        :token-url="tokenUrl"
      />
    </div>

    <vm-input
      id="password"
      v-model="passwordData"
      label-name="密码"
      type="password"
      name="password"
      placeholder="请输入8-20位数字和字母组合"
      :disabled="false"
      :maxlength="20"
      :show-cancel="false"
      @input="handlePwdInput"
    />

    <div class="err-msg">
      {{ errorMsg }}
    </div>

    <van-button
      :disabled="isLoadingData"
      type="primary"
      class="vm-action__button"
      @click="submitPostData"
    >
      <span v-if="showBindText">
        注册并绑定
      </span>
      <span v-else>
        确认
      </span>
    </van-button>
  </div>
</template>

<script>
import pageMixins from '../page-mixins';
import { Captcha } from 'captain-ui';
import { checkPasswordValid, checkVerifyCodeValid } from '../utils';

const globalUrl = window._global.url.www.replace(/^https?:\/\//, '//');
const fetchCaptchaUrl = globalUrl + '/common/sms/captcha.jsonp';
const fetchImageUrl = globalUrl + '/common/sms/imgcaptcha';
const verifyImageUrl = globalUrl + '/common/sms/imgcaptcha.jsonp';
const tokenUrl = globalUrl + '/common/token/token.jsonp';

export default {

  components: {
    'vm-captcha': Captcha,
  },

  mixins: [pageMixins],

  props: {
    tel: {},
    password: String,
    verifyCode: {},
    showBindText: Boolean,
    errorMsg: String,
    // 代表当前对应状态，注册还是找回
    route: String,
    isLoadingData: Boolean,
  },

  data() {
    return {
      telData: this.tel,
      passwordData: this.password,
      verifyCodeData: this.verifyCode,
      captchaUrl: fetchCaptchaUrl,
      imageCaptchaUrl: fetchImageUrl,
      checkImageCaptchaUrl: verifyImageUrl,
      tokenUrl: tokenUrl,
    };
  },

  computed: {
    captchaBiz() {
      if (this.route === 'register') return 'kdt_account_captcha';
      if (this.route === 'findpwd') return 'reset_account_passwd';

      return '';
    },
  },

  watch: {
    password(val) {
      this.passwordData = val;
    },
    passwordData(val) {
      this.$emit('input', 'password', val);
    },
    verifyCode(val) {
      this.verifyCodeData = val;
    },
    verifyCodeData(val) {
      this.$emit('input', 'verifyCode', val);
    },
  },

  methods: {
    submitPostData() {
      if (!this.checkVerifyCode()) return;
      if (!this.checkPassword()) return;
      this.$emit('submit');
    },

    handlePwdInput(val) {
      this.passwordData = val;
    },

    handleVrfInput(val) {
      this.verifyCodeData = val;
    },

    checkPassword() {
      const result = checkPasswordValid('register', this.passwordData);
      this.$emit('err-change', result.err);
      return result.valid;
    },

    checkVerifyCode() {
      const result = checkVerifyCodeValid(this.verifyCodeData);
      this.$emit('err-change', result.err);
      return result.valid;
    },
  },
};
</script>

<style>
  .captcha {
    position: relative;
    height: 54px;

    input {
      width: 178px;
      line-height: 18px;
      box-sizing: border-box;
      padding: 12px 10px 12px 68px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      outline: none;
      opacity: 1;
      -webkit-appearance: none;
    }

    .captcha-label {
      position: absolute;
      top: 1px;
      left: 10px;
      line-height: 45px;
      z-index: 1;
      color: #666;
      font-size: 14px;
    }

    .captcha-button {
      width: 80px;
      color: #06bf04 !important;
      border-color: #0c3 !important;
      padding: 0 4px !important;
      height: 44px;
      line-height: 44px;
      border-radius: 5px !important;
    }

    .van-button--disabled {
      background-color: #ddd !important;
      border: 1px solid transparent !important;
      color: #fff !important;
    }
  }

  .cap-captcha {
    padding-right: 0 !important;
  }
</style>
