<template>
  <div class="address-type">
    <div :class="`${prefix}-panel panel`">
      <van-field
        v-model="selectedText.province"
        readonly
        :label="label"
        :placeholder="getPlaceholder"
        :required="required"
        :error-message="dataType === 3 && errorConf.isError ? errorConf.errorMsg : ''"
        right-icon="arrow"
        @click="toggleSelector"
      />
    </div>
    <div v-if="dataType === 6" :class="`${prefix}-panel panel`">
      <label class="se__field-label van-cell__title" />
      <van-field
        style="border-top: 1px solid #F2F2F2"
        placeholder="街道、楼牌号等"
        v-bind="this.$attrs"
        :error-message="errorConf.isError ? errorConf.errorMsg : ''"
        :value="selectedText.street"
        @input="handleStreetChange"
      />
    </div>
    <van-popup
      v-model="showSelector"
      class="popup"
      position="bottom"
      @click-overlay="toggleSelector"
    >
      <van-area
        :loading="areaLoading"
        :area-list="areaList"
        :value="getProvinceCode"
        @confirm="handleProvinceChange"
        @cancel="toggleSelector"
      />
    </van-popup>
  </div>
</template>
<script>
import { Popup, Area, Field } from 'vant';
import get from 'lodash/get';
import slice from 'lodash/slice';
import ajax from 'captain-ajax';

import getPlaceholderFromProps from '../utils/get-placeholder-from-props';

export default {
  name: 'address-type',

  components: {
    'van-popup': Popup,
    'van-area': Area,
    'van-field': Field,
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
    dataType: {
      type: Number,
      default: 6,
    },
  },

  data() {
    return {
      selectedText: {
        province: undefined,
        street: undefined,
      },
      showSelector: false,

      /**
       * 省市县级联选择
       */
      areaList: {},
      areaLoading: false,
    };
  },

  computed: {
    getPlaceholder() {
      const defaultPlaceholder = this.placeholder || '省 / 市 / 区';
      return getPlaceholderFromProps(this.$attrs, defaultPlaceholder);
    },
    getProvinceCode() {
      const value = get(this.$props, 'value', this.convertedValues);
      if (value.length) {
        return get(value.slice(0, 3), '[2].code', '');
      }
      return '';
    },
  },

  created() {
    this.getAreaList();
    let value = get(this.$props, 'value');
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value || '[]');
        if (this.dataType === 6) {
          // 详细地址类型，最后一个应该转换为string
          const street = get(value, '[3].name', '');
          value[3] = street;
        }
        this.handleValueChange(value);
      } catch (err) {
        console.error(err);
      }
    }
  },

  methods: {
    handleProvinceChange(values) {
      const street = get(this.$props, 'value[3]', '');
      this.toggleSelector();
      const value = this.dataType === 6 ? [].concat(values, street) : values;
      this.handleValueChange(value);
    },
    handleStreetChange(value) {
      let province = slice(get(this.$props, 'value', []), 0, 3);
      if (province.length === 0) {
        province = new Array(3);
      }
      this.handleValueChange([].concat(province, value));
    },
    handleValueChange(value) {
      const provincePart = slice(value, 0, 3);
      this.selectedText = {
        province: provincePart.every(v => !!v) ? provincePart.map(v => v.name).join('/') : undefined,
        street: get(value, '[3]'),
      };
      this.$emit('change', this.name, value);
    },
    toggleSelector() {
      this.showSelector = !this.showSelector;
    },
    getAreaList() {
      this.areaLoading = true;
      ajax({
        method: 'GET',
        dataType: 'jsonp',
        url: 'https://www.youzan.com/v2/common/region/all.jsonp',
      })
        .then(({ data }) => {
          this.areaList = data;
          this.areaLoading = false;
        })
        .catch(() => {
          this.areaLoading = false;
        });
    },
  },
};
</script>
<style lang="postcss">
.address-type {
  .van-cell--required::before {
    left: -9px;
  }

  .se__field {
    &-panel {
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

      .van-radio {
        height: 48px;
        padding: 14px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
