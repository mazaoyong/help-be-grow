<template>
  <div class="login-pop">
    <div class="header">
      <h2>{{ title }}</h2>
    </div>

    <vm-init
      v-if="route === 'init'"
      :tel="loginData.tel"
      :error-msg="errorMsg"
      :is-loading-data="isLoadingData"
      @err-change="onErrChange"
      @submit="checkTelStatus"
      @input="handleInput"
    />

    <vm-login
      v-if="route === 'login'"
      :tel="loginData.tel"
      :password="loginData.password"
      :error-msg="errorMsg"
      :is-loading-data="isLoadingData"
      :show-bind-text="showBindText"
      @err-change="onErrChange"
      @submit="loginAction"
      @input="handleInput"
    />

    <vm-register
      v-if="route === 'register' || route === 'findpwd'"
      :tel="loginData.tel"
      :password="loginData.password"
      :verify-code="loginData.verifyCode"
      :error-msg="errorMsg"
      :show-bind-text="showBindText"
      :route="route"
      :is-loading-data="isLoadingData"
      @err-change="onErrChange"
      @submit="loginAction"
      @input="handleInput"
    />

    <div v-if="route !== 'init'" class="help-msg clearfix">
      <template v-if="route === 'login' || route === 'register'">
        <span>
          如果忘了密码,请<a href="javascript:void(0);" @click="goTo('findpwd')">
            点此找回密码
          </a>
        </span>
        <a
          href="javascript:void(0);"
          class="pull-right"
          @click="goTo('init')">
          更换手机号
        </a>
      </template>
      <template v-if="route === 'findpwd'">
        <span class="pull-right">
          <a
            class="left-item"
            href="javascript:void(0);"
            @click="goTo('init')">
            已有帐号登录
          </a>
          <a
            class="right-item"
            href="javascript:void(0);"
            @click="goTo('init')">
            注册新帐号
          </a>
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { IS_IN_LOGIN_UA_MAP, ROUTE_TITLE_MAP, SHOW_BIND_TEXT } from './src/constant';
import { commonLoginRequest, syncKDTLoginStatus, syncWapLoginStaus } from './src/api';
import URLHelper from 'zan-utils/url/helper';
import Init from './src/components/Init';
import Login from './src/components/Login';
import Register from './src/components/Register';
import aes from '@youzan/yz-aes';
import { Toast } from 'vant';
import each from 'lodash/each';
import every from 'lodash/every';
import * as SafeLink from '@youzan/safe-link';

const urls = window._global.url;

export default {

  components: {
    'vm-init': Init,
    'vm-login': Login,
    'vm-register': Register,
  },

  props: {
    // 设定还是找回
    isSetting: {
      type: Boolean,
      default: false,
    },
    // 注册来源
    source: {
      type: Number,
      default: 2,
    },
    // 登录请求的接口
    loginUrl: {
      type: String,
      default: urls.uic + '/buyer/auth/authlogin.json',
    },
    // 注册请求的接口
    registerUrl: {
      type: String,
      default: urls.uic + '/buyer/auth/authRegister.json',
    },
    // 更改密码请求的接口
    changePwdUrl: {
      type: String,
      default: urls.uic + '/buyer/auth/changePassword.json',
    },
    // 检查号码是否已经注册的接口
    confirmUrl: {
      type: String,
      default: urls.uic + '/buyer/auth/authConfirm.json',
    },
    // 登录完成后所执行的回调
    afterLoginCb: Function,
  },

  data() {
    return {
      loginData: {
        tel: '',
        password: '',
        verifyCode: '',
      },
      route: 'init',
      errorMsg: '',
      routeTitleMap: ROUTE_TITLE_MAP,
      showBindText: SHOW_BIND_TEXT,
      isLoadingData: false,
    };
  },

  computed: {
    title() {
      if (this.route === 'findpwd' && this.isSetting) {
        return '设定帐号密码';
      } else {
        return ROUTE_TITLE_MAP[this.route];
      }
    },
  },

  created() {
    // 如果在App 中直接跳app 中的登录态
    if (IS_IN_LOGIN_UA_MAP) {
      const reUrl = URLHelper.site('/buyer/kdtunion?redirect_uri=' + encodeURIComponent(window.location.href), 'wap');
      SafeLink.redirect({
        url: reUrl,
      });
    }
  },

  methods: {
    checkTelStatus() {
      const data = {
        phone: this.loginData.tel,
        source: this.source,
      };
      this.isLoadingData = true;
      commonLoginRequest(this.confirmUrl, data).then(resp => {
        this.isLoadingData = false;
        if (resp.code === 0) {
          this.goTo('login');
        } else if (resp.code === 135000003) {
          this.goTo('register');
        } else {
          this.errorMsg = resp.msg;
        }
      }).catch(() => {
        this.isLoadingData = false;
        Toast('手机号验证错误,请重试');
      });
    },

    loginAction() {
      let url = this.loginUrl;

      const data = {
        phone: this.loginData.tel,
        source: this.source,
        password: aes.encrypt(this.loginData.password),
      };

      if (this.route !== 'login') {
        // 注册或找回密码状态下
        Object.assign(data, {
          code: this.loginData.verifyCode,
        });

        if (this.route === 'register') {
          url = this.registerUrl;
        }
        if (this.route === 'findpwd') {
          url = this.changePwdUrl;
        }
      }
      this.isLoadingData = true;

      commonLoginRequest(url, data).then(resp => {
        if (resp.code !== 0) {
          this.isLoadingData = false;
          this.errorMsg = resp.msg;
        } else {
          // 同步登录态
          this.errorMsg = '';
          const ticket = resp.data.ticket;
          this.syncLoginStatus(ticket);
        }
      }).catch(() => {
        this.isLoadingData = false;
        Toast('登录错误,请重试');
      });
    },

    syncLoginStatus(ticket) {
      const wapUrl = (window._global.wap_url || {}).wap || '';
      const isYouzanWapUrl = /youzan\.com/.test(wapUrl);
      const syncList = [];
      syncList.push(syncKDTLoginStatus(ticket));
      if (!isYouzanWapUrl) {
        // 用于同步非youzan域名的cookie => vip 域名
        syncList.push(syncWapLoginStaus(ticket));
      }

      Promise.all(syncList).then(resp => {
        this.isLoadingData = false;
        each(resp, item => {
          if (item.code !== 0) {
            this.errorMsg = resp.msg;
            return false;
          }
        });

        const result = every(resp, item => {
          return item.code === 0;
        });
          // 当为注册时，无需check 是否全部code 为0
        if (result || this.route === 'register') {
          // 如果全部正常处理，执行外部回调
          this.afterLoginCb && this.afterLoginCb();
        }
      });
    },

    onErrChange(val) {
      // 子组件中的错误信息发生变化
      this.errorMsg = val;
    },

    goTo(route) {
      this.route = route;
      // 切换状态时清空错误信息
      this.errorMsg = '';
      this.loginData.password = '';
    },

    handleInput(type, val) {
      // 双向数据绑定
      switch (type) {
        case 'tel':
          this.loginData.tel = val;
          break;
        case 'password':
          this.loginData.password = val;
          break;
        case 'verifyCode':
          this.loginData.verifyCode = val;
          break;
        default:
          this.errorMsg = '出错啦,请重试';
          break;
      }
    },
  },
};
</script>

<style lang="scss">
@import '~assets/styles/mixins/index.scss';

.login-pop {
  padding: 15px;
}

.header {
  width: 270px;
  margin-bottom: 10px;
  text-align: center;

  h2 {
    padding-bottom: 16px;
    color: #06bf04;
    font-size: 16px;
    line-height: 16px;
    position: relative;

    &::after {
      @include border-retina(bottom);
    }
  }
}

.vm-action__button {
  width: 100%;
  margin-top: 10px;
  height: 40px;
  line-height: 40px;

  &:focus {
    outline: -webkit-focus-ring-color auto 5px;
  }
}

.err-msg {
  font-size: 12px;
  line-height: 14px;
  color: #f60;
}

.help-msg {
  color: #f60;
  line-height: 12px;
  margin-top: 16px;

  a {
    color: #38f;

    &:focus {
      outline: -webkit-focus-ring-color auto 5px;
    }
  }

  .pull-right {
    float: right;
  }

  .left-item {
    padding: 0 10px;
    border-right: 1px solid #e5e5e5;
    font-size: 12px;
  }

  .right-item {
    padding: 0 0 0 10px;
  }
}

.vm-login,
.vm-init,
.vm-register {
  padding-top: 10px;
}
</style>
