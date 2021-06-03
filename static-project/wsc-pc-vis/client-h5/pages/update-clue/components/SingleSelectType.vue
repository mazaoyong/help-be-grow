<template>
  <div>
    <van-field
      v-model="selectedText"
      readonly
      :label="label"
      :class="`${prefix}-panel panel single-select`"
      :placeholder="getPlaceholder"
      :required="required"
      :error-message="errorConf.isError ? errorConf.errorMsg : ''"
      right-icon="arrow"
      @click="toggleSelector"
    />
    <van-popup
      v-model="showSelector"
      class="popup"
      position="bottom"
      @click-overlay="toggleSelector"
    >
      <div class="options-header">
        请选择
        <van-icon name="close" @click="toggleSelector" />
      </div>
      <van-radio-group
        v-if="getOptions.length"
        v-model="stateValue"
        class="options-container"
        @change="handleValueChange"
      >
        <van-radio
          v-for="opt in getOptions"
          :key="opt.value"
          :name="opt.value"
          icon-size="18px"
        >
          {{ opt.text }}
        </van-radio>
      </van-radio-group>
      <p v-else class="no-options">没有可用的选项</p>
    </van-popup>
  </div>
</template>
<script>
import { Field, Popup, Radio, RadioGroup, Icon } from 'vant';
import get from 'lodash/get';

import getPlaceholderFromProps from '../utils/get-placeholder-from-props';

export default {
  name: 'single-select-type',

  components: {
    'van-field': Field,
    'van-popup': Popup,
    'van-icon': Icon,
    'van-radio-group': RadioGroup,
    'van-radio': Radio,
  },

  props: {
    prefix: {
      type: String,
      default: 'se__field',
    },
    value: {
      type: [Number, String],
      default: undefined,
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
    let defaultSelectOpt;
    // vue observerable对象判断是否为空字符串
    if (value[0] !== undefined && value[0] !== '') {
      const options = get(this.$attrs, 'attrItem');
      value = Number(value);
      if (Array.isArray(options) && options.length) {
        defaultSelectOpt = get(options.filter(opt => opt.id === value)[0], 'value');
      }
    }
    return {
      selectedText: defaultSelectOpt,
      stateValue: value,
      showSelector: false,
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
        value: opt.id,
      }));
    },
  },

  methods: {
    handleValueChange(value) {
      const selectedItem = this.getOptions.filter(opt => opt.value === value)[0];
      this.stateValue = value;
      this.selectedText = selectedItem.text;
      this.toggleSelector();
      this.$emit('change', this.name, value);
    },
    toggleSelector() {
      this.showSelector = !this.showSelector;
    },
  },
};
</script>
<style lang="postcss">
.se__field {
  &-panel.single-select {
    .se-icon.van-icon {
      position: absolute;
      right: 15px;
      font-size: 10px;
      transform: scale(.8);
    }
  }

  .input {
    flex: 1;
    position: relative;
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

    .van-radio {
      display: flex;
      padding: 16px;
      height: auto;
    }
  }
}
</style>
