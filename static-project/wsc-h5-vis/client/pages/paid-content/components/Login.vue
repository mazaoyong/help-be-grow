<template>
  <div class="login-popup">
    <van-popup
      v-model="showLogin"
      :close-on-click-overlay="allowClose"
    >
      <cap-login
        :login-url="loginUrl"
        :register-url="registerUrl"
        :change-password-url="changePasswordUrl"
        :auto-confirm-url="authConfirmUrl"
        :country-list-url="countryListUrl"
        :captcha-url="captchaUrl"
        :image-captcha-url="imageCaptchaUrl"
        :check-image-captcha-url="checkImageCaptchaUrl"
        :token-url="tokenUrl"
        :login-redirect-url="loginRedirectUrl"
        :show-country-select="false"
        :after-login-cb="afterLogin"
      />
    </van-popup>
  </div>
</template>

<script>
/**
 * 这个组件已经被废弃，正常页面都没有再引用这个组件
 */
import { Popup } from 'vant';
// 先引用购物车下面的登录组件
import Login from './login-pop';

console.log('paid-content/components/Login 组件已被废弃，请使用 @/common/utils/login');

const global = window._global;
const url = global.url;
const loginUrlMap = {
  captchaUrl: `${url.www}/common/sms/captcha.jsonp`,
  imageCaptchaUrl: `${url.www}/common/sms/imgcaptcha`,
  checkImageCaptchaUrl: `${url.www}/common/sms/imgcaptcha.jsonp`,
  tokenUrl: `${url.www}/common/token/token.jsonp`,
  loginUrl: `${url.uic}/buyer/auth/authlogin.json`,
  registerUrl: `${url.uic}/buyer/auth/authRegister.json`,
  changePasswordUrl: `${url.uic}/buyer/auth/changePassword.json`,
  authConfirmUrl: `${url.uic}/buyer/auth/authConfirm.json`,
  countryListUrl: `${url.uic}/sso/countryCode/category/query`,
  loginRedirectUrl: window.location.href,
};
export default {
  name: 'login-popup',

  components: {
    'cap-login': Login,
    [Popup.name]: Popup,
  },

  props: {
    showLogin: Boolean,
    // 点击蒙版是否允许关闭
    allowClose: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      ...loginUrlMap,
    };
  },

  methods: {
    afterLogin() {
      window.location.reload();
      /* this.$emit('update:showLogin', false); */
    },
  },
};
</script>

<style lang="scss">
.login-popup .help-msg {
  font-size: 12px;
}
</style>
