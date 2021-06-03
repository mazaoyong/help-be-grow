<template>
  <div class="vm-login">
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

    <vm-input
      id="password"
      v-model="passwordData"
      label-name="密码"
      type="password"
      name="password"
      placeholder="请输入登录密码"
      :disabled="false"
      :show-cancel="false"
      @input="handleInput"
    />

    <div class="err-msg">
      {{ errorMsg }}
    </div>

    <van-button
      :disabled="isLoadingData"
      type="primary"
      class="vm-action__button"
      @click="submitPostData">
      <span v-if="showBindText">
        登录并绑定
      </span>
      <span v-else>
        确认
      </span>
    </van-button>
  </div>
</template>

<script>
import pageMixins from '../page-mixins';
import { checkPasswordValid } from '../utils';

export default {
  mixins: [pageMixins],

  props: {
    tel: {},
    password: String,
    showBindText: Boolean,
    errorMsg: String,
    isLoadingData: Boolean,
  },

  data() {
    return {
      telData: this.tel,
      passwordData: this.password,
    };
  },

  watch: {
    password(val) {
      this.passwordData = val;
    },

    passwordData(val) {
      this.$emit('input', 'password', val);
    },
  },

  methods: {
    handleInput(val) {
      // 本组件帐号输入被disabled
      this.passwordData = val;
    },

    submitPostData() {
      if (this.checkPassword(this.passwordData)) {
        this.$emit('submit');
      }
    },

    checkPassword(data) {
      const result = checkPasswordValid('login', data);
      this.$emit('err-change', result.err);
      return result.valid;
    },
  },

};
</script>
