<template>
  <div>
    <div :class="`${prefix}-panel panel multi-select ${required ? 'van-cell--required' : ''}`">
      <label class="se__field-label van-cell__title">{{ label }}</label>
      <div class="input" @click="toggleSelector">
        <div v-if="selectedTexts.length" class="multi-values">
          <label
            v-for="(text, index) in selectedTexts"
            :key="index"
            class="multi-values__item"
          >
            {{ text }}
          </label>
        </div>
        <span v-else class="placeholder">{{ getPlaceholder }}</span>
        <van-icon class="se-icon" name="arrow" />
      </div>
    </div>
    <div v-if="errorConf.isError" :class="`${prefix}-panel panel error`">
      <label class="se__field-label van-cell__title" />
      {{ errorConf.errorMsg }}
    </div>
    <van-popup
      v-model="showSelector"
      class="popup"
      position="bottom"
      @click-overlay="handleCancel"
    >
      <div class="options-header">
        请选择
        <van-icon name="close" @click="handleCancel" />
      </div>
      <van-checkbox-group
        v-if="getOptions.length"
        v-model="stateValue"
        class="options-container"
        @change="handleValueChange"
      >
        <van-checkbox
          v-for="opt in getOptions"
          :key="opt.value"
          :name="opt.value"
          icon-size="18px"
          checked-color="#00B389"
        >
          {{ opt.text }}
        </van-checkbox>
      </van-checkbox-group>
      <p v-else class="no-options">没有可用的选项</p>
      <div class="btn-container">
        <van-button type="primary" @click="handleConfirm">
          确定
        </van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Popup, Icon, Checkbox, CheckboxGroup, Button } from 'vant';
import get from 'lodash/get';
import find from 'lodash/find';

import getPlaceholderFromProps from '../utils/get-placeholder-from-props';

export default {
  name: 'multi-select-type',

  components: {
    'van-popup': Popup,
    'van-icon': Icon,
    'van-checkbox-group': CheckboxGroup,
    'van-checkbox': Checkbox,
    'van-button': Button,
  },

  props: {
    prefix: {
      type: String,
      default: 'se__field',
    },
    value: {
      type: [Array, String],
      default: () => [],
    },
    name: {
      type: [Number, String],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    errorConf: {
      type: Object,
      default: () => ({
        isError: false,
        errorMsg: '',
      }),
    },
  },

  data() {
    let value = this.$props.value;
    let defaultSelectOpt = [];
    if (typeof value === 'string') {
      value = value.split(',');
    }
    if (Array.isArray(value)) {
      value = value.filter(val => val !== '').map(val => String(val));
      const options = get(this.$attrs, 'attrItem');
      if (Array.isArray(options) && options.length) {
        defaultSelectOpt = options.filter(opt => value.indexOf(String(opt.id)) !== -1).map(opt => opt.value);
      }
    }
    return {
      selectedTexts: defaultSelectOpt,
      stateValue: value,
      showSelector: false,
      preValue: value,
    };
  },

  computed: {
    getPlaceholder() {
      const defaultPlaceholder = this.$props.placeholder || '请选择';
      return getPlaceholderFromProps(this.$attrs, defaultPlaceholder);
    },
    getOptions() {
      const options = get(this.$attrs, 'attrItem');
      if (!options) {
        return [];
      }
      return options.map(opt => ({
        text: opt.value,
        value: String(opt.id),
      }));
    },
  },

  created() {
    // 组件加载完成之后需要设置一下value
    if (this.value) {
      this.handleValueChange(this.stateValue);
    }
  },

  methods: {
    handleValueChange(values) {
      // 改动之前需要校验一下选项是否合法
      const OPTIONS = this.getOptions;
      const validValue = (values || [])
        .filter(val => find(OPTIONS, opt => String(opt.value) === String(val)));
      this.$emit('change', this.name, validValue);
    },
    handleCancel() {
      this.stateValue = this.preValue;
      this.handleValueChange(this.preValue);
      this.toggleSelector();
    },
    toggleSelector() {
      this.showSelector = !this.showSelector;
    },
    handleConfirm() {
      this.selectedTexts = this.stateValue
        .map(value => find(this.getOptions, { value }))
        .filter(value => value !== undefined)
        .map(opt => opt.text);
      this.preValue = this.stateValue;
      this.toggleSelector();
    },
  },
};
</script>
<style lang="postcss">
.se__field {
  &-panel.multi-select {
    .se-icon.van-icon {
      position: absolute;
      right: 15px;
      font-size: 10px;
      transform: scale(.8);
    }

    .input {
      flex: 1;
      position: relative;
      display: flex;
      padding: 5px 0 10px;
      align-items: center;

      .se-icon {
        margin-top: 2px;
      }

      .multi-values {
        display: flex;
        flex-wrap: wrap;

        &__item {
          padding: 2px 5px;
          margin: 5px 8px 0 0;
          font-size: 14px;
          line-height: 16px;
          color: #fff;
          background-color: #666;
          border-radius: 3px;
        }
      }
    }
  }

  .placeholder {
    color: #ccc;
  }

  .popup {
    flex-direction: column;
    padding-bottom: 15px;
    border-radius: 12px 12px 0 0;

    .options {
      &-header {
        position: relative;
        height: 44px;
        line-height: 44px;
        text-align: center;

        .van-icon {
          position: absolute;
          top: 16px;
          right: 16px;
        }
      }

      &-container {
        max-height: 500px;
        overflow-y: scroll;
      }
    }

    .van-checkbox {
      display: flex;
      height: 48px;
      padding: 14px;
      box-sizing: border-box;
    }

    .btn-container {
      display: flex;
      flex: 1;
      padding: 7px 16px;

      .van-button {
        width: 100%;
        height: 36px;
        line-height: 36px;
        border-radius: 18px;
      }
    }
  }
}
</style>
