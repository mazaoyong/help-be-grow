<template>
  <div>
    <cap-mobile-auth
      v-if='openAppConfig.authorize_account && simpleLogin.authType === 2'
      :visible='simpleLogin.needLogin'
      :phone='simpleLogin.mobile'
      :kdt-id='kdtId'
      :img-shop-url='shopLogo'
      :name-shop='shopName'
      :name-app='appName'
      @success='handleAfterAuth'
      @close='handleCloseAuth'
    />
  </div>
</template>

<script>
import userInfoAuthorize from '@youzan/user-info-authorize';
import { MobileAuth } from '@youzan/captain';
import queryString from 'zan-utils/url/queryString';
import { action } from '@youzan/zan-jsbridge';

export default {
  name: 'check-auth-mobile',

  components: {
    [MobileAuth.name]: MobileAuth,
  },

  data() {
    return {
      kdtId: _global.kdt_id || '',
      simpleLogin: _global.simpleLogin || {},
      openAppConfig: _global.open_app_config || {},
      shopLogo: _global.mp_data.logo || '',
      shopName: _global.mp_data.shop_name || '',
      appName: _global.appName || '',
    };
  },

  mounted() {
    this.checkAuth();
  },

  methods: {
    checkAuth() {
      const { openAppConfig, simpleLogin } = this;
      const showSimpleLogin =
        openAppConfig.authorize_account && simpleLogin.authType === 2;
      if (showSimpleLogin) {
        this.simpleLogin.needLogin = true;
        return;
      }
      if (!_global.authorized.mobile) {
        this.simpleLogin.needLogin = true;
        userInfoAuthorize
          .open({
            authTypeList: ['mobile'],
          })
          .then(() => {
            this.handleAfterAuth();
          });
      } else {
        this.handleAfterAuth();
      }
    },

    handleAfterAuth() {
      this.handleCloseAuth();
      action.doAction({
        action: 'checkAuthSucceed',
      });
      const search = queryString.parse(window.location.search) || {};
      window.location.replace(search.redirectUrl);
    },

    handleCloseAuth() {
      this.simpleLogin.needLogin = false;
    },
  },
};
</script>
