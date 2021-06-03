<template>
  <div class="vm-input">
    <label
      class="vm-input__label"
      :for="id">
      {{ labelName }}
    </label>

    <input
      :id="id"
      class="vm-input__input"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="currentValue"
      :maxlength="maxlength"
      autocomplete="off"
      @input="handleInput">

    <van-icon
      v-if="showCancel"
      name="clear"
      @click="clearData"
    />
  </div>
</template>

<script>
import { Icon } from 'vant';
const VALID_TYPES = ['text', 'number', 'email', 'url', 'tel', 'date', 'datetime', 'password'];

export default {

  components: {
    'van-icon': Icon,
  },

  props: {
    labelName: String,
    id: String,
    name: String,
    value: {},
    type: {
      type: String,
      default: 'text',
      validator(val) {
        return VALID_TYPES.indexOf(val) > -1;
      },
    },
    placeholder: String,
    disabled: Boolean,
    // 是否有清空的操作
    showCancel: Boolean,
    maxlength: Number,
  },

  data() {
    return {
      isFocus: false,
      currentValue: this.value,
    };
  },

  watch: {
    value(val) {
      this.currentValue = val;
    },

    currentValue(val) {
      this.$emit('input', val);
    },
  },

  methods: {
    clearData() {
      this.currentValue = '';
    },

    handleInput(event) {
      this.currentValue = event.target.value;
    },

    doCloseFocus() {
      this.focus = false;
    },
  },
};
</script>

<style>
  .vm-input {
    width: 270px;
    height: 54px;
    position: relative;

    &__label {
      position: absolute;
      top: 1px;
      left: 10px;
      line-height: 45px;
      z-index: 1;
      color: #666;
      font-size: 14px;
    }

    &__input {
      width: 100%;
      box-sizing: border-box;
      line-height: 18px;
      padding: 12px 10px 12px 68px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      outline: none;
      opacity: 1;
      -webkit-appearance: none;
    }
  }

  input[disabled='disabled'] {
    background: #f8f8f8;
  }
</style>
