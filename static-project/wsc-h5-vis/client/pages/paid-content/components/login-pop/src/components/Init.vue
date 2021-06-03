<template>
  <div class="vm-init">
    <vm-input
      id="phone"
      v-model="value"
      label-name="手机号"
      type="tel"
      name="phone"
      placeholder=""
      :disabled="false"
      :maxlength="11"
      :show-cancel="false"
      @input="handleInput"
    />

    <div class="err-msg">
      {{ errorMsg }}
    </div>

    <van-button
      type="primary"
      nativ-type="submit"
      class="vm-action__button"
      :disabled="isLoadingData"
      @click="submitTel">
      确认手机号码
    </van-button>
  </div>
</template>

<script>
import pageMixins from '../page-mixins';
import { checkPhoneValid } from '../utils';

export default {
  mixins: [pageMixins],

  props: ['tel', 'errorMsg', 'isLoadingData'],

  data() {
    return {
      value: this.tel,
    };
  },

  watch: {
    tel(val) {
      this.value = val;
    },

    value(val) {
      this.$emit('input', 'tel', val);
    },
  },

  methods: {
    submitTel() {
      if (this.checkPhone(this.value)) {
        // 提交前检查号码是否符合规范
        this.$emit('submit');
      }
    },

    handleInput(val) {
      this.value = val;
    },

    checkPhone(data) {
      const result = checkPhoneValid(data);
      this.$emit('err-change', result.err);
      return result.valid;
    },
  },
};
</script>
