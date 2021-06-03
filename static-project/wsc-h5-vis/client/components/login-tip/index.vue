<template>
  <div class="login-tip">
    <span class="text">{{ text }}</span>
    <a
      href="javascript: void(0);"
      class="login-btn"
      @click="onLogin"
    >
      去登录
    </a>
  </div>
</template>

<script>
import { getShareLink } from '@youzan/wxsdk';
import * as SafeLink from '@youzan/safe-link';
const kdtId = _global.kdt_id;

export default {
  name: 'login-tip',
  props: {
    text: {
      type: String,
      default: '买了课程但没有显示？可能是没登录',
    },
  },
  methods: {
    onLogin() {
      const redirectUrl = `https://h5.youzan.com/wscuser/membercenter?kdt_id=${kdtId}`;
      const reUrl = `https://passport.youzan.com/mobile?redirectUrl=${encodeURIComponent(getShareLink(redirectUrl))}`;
      SafeLink.redirect({
        url: reUrl,
        kdtId,
      });
    },
  },
};
</script>

<style lang="scss">
.login-tip {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  height: 40px;
  line-height: 40px;
  align-items: center;
  background-color: #fffbe8;
  .text {
    display: block;
    flex: 1;
    font-size: 14px;
    color: #ed6a0c;
  }
  .login-btn {
    display: block;
    padding: 2px 0;
    width: 52px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    background-color: #ed6a0c;
    font-size: 12px;
    color: #fff;
    border-radius: 22px;
  }
}
</style>
