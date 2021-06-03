<template>
  <div :class="`${[prefix]} update-clue`">
    <div
      v-for="(item, index) in profileList"
      :key="item.attributeId || index"
      :v-if="profileList.length > 0"
      :class="{[`${prefix}__field`]: true, 'no-border': item === 'divide'}"
    >
      <!-- 分隔符 -->
      <div v-if="item === 'divide'" />
      <!-- 线索来源类型 -->
      <van-field
        v-else-if="item === 'source'"
        v-model="parsedRight"
        label="来源"
        required
        readonly
        :disabled="isSystemSource"
        placeholder="请选择线索来源（必填）"
        :error-message="getError('source').isError ? getError('source').errorMsg : ''"
        right-icon="arrow"
        @click="showSourceModal"
      />
      <!-- 文本类型 -->
      <text-type
        v-else-if="isEqualType(item, ENUMS.customProfileType.TEXT)"
        v-bind="getProps(item)"
        type="text"
        @change="valueChange"
      />
      <!-- 数字类型 -->
      <text-type
        v-else-if="isEqualType(item, ENUMS.customProfileType.NUMBER)"
        v-bind="getProps(item)"
        type="number"
        @change="valueChange"
      />
      <!-- 电话类型 -->
      <text-type
        v-else-if="isEqualType(item, ENUMS.customProfileType.PHONE)"
        v-bind="getProps(item)"
        type="tel"
        @change="valueChange"
      />
      <!-- 性别类型 -->
      <gender-type
        v-else-if="isEqualType(item, ENUMS.customProfileType.GENDER)"
        v-bind="getProps(item)"
        @change="valueChange"
      />
      <!-- 单选 -->
      <single-select-type
        v-else-if="isEqualType(item, ENUMS.customProfileType.SINGLESELECT)"
        v-bind="getProps(item)"
        @change="valueChange"
      />
      <!-- 多选 -->
      <multi-select-type
        v-else-if="isEqualType(item, ENUMS.customProfileType.MULTISELECT)"
        v-bind="getProps(item)"
        @change="valueChange"
      />
      <!-- 地址 -->
      <address-type
        v-else-if="
          isEqualType(item, ENUMS.customProfileType.PROVINCE)
            || isEqualType(item, ENUMS.customProfileType.ADDRESS)"
        v-bind="getProps(item)"
        @change="valueChange"
      />
      <!-- 时间类型 -->
      <date-type
        v-else-if="isEqualType(item, ENUMS.customProfileType.DATE)"
        v-bind="getProps(item)"
        @change="valueChange"
      />
      <!-- 时间类型 -->
      <image-type
        v-else-if="isEqualType(item, ENUMS.customProfileType.IMAGE)"
        v-bind="getProps(item)"
        @change="valueChange"
      />
    </div>
    <!-- 通用mask 开始 -->
    <div v-if="isShowMask" class="mask" @click="onHideMask" />
    <!-- 来源modal 开始 -->
    <van-tree-select
      v-if="isShowSource"
      :items="sourceList"
      :main-active-index="sourceMainActiveIndex"
      :active-id="sourceItemActiveId"
      @navclick="onClickSourceMain"
      @itemclick="onClickSourceItem"
    />
    <!-- 来源modal 结束 -->
    <van-button
      type="primary"
      style="margin-bottom: 8px;"
      class="confirm"
      @click="createOrUpdateClue"
    >
      {{ type === 'edit' ? '更新' : '创建' }}
    </van-button>
  </div>
</template>
<script>
import Vue from 'vue';
import { Field, Button, Toast, Dialog, TreeSelect } from 'vant';
import get from 'lodash/get';
import Args from 'zan-utils/url/args';
import { isEduBranchStore } from '@youzan/utils-shop';

import enums from './enums';
import validating from './validate';

import TextType from './components/TextType';
import GenderType from './components/GenderType';
import SingleSelectType from './components/SingleSelectType';
import MultiSelectType from './components/MultiSelectType';
import AddressType from './components/AddressType';
import DateType from './components/DateType';
import ImageType from './components/ImageType';

import getDifferentType from './utils/get-different-type';
Vue.use(Toast);
Vue.use(Dialog);

// 默认值
const DEFAULT_VALUE_ENUM = {
  [enums.customProfileType.MULTISELECT]: [],
  [enums.customProfileType.ADDRESS]: [],
  [enums.customProfileType.PROVINCE]: [],
  [enums.customProfileType.DATE]: '',
};
const GENDER_REFLECT = {
  男: '1',
  女: '2',
};
const noData = 'https://img01.yzcdn.cn/public_files/2018/10/23/5a01c6428aaa01c3878ce72f265ff952.png';
const global = window._global;
let APILock = false;

export default {
  name: 'update-clue',

  components: {
    'van-field': Field,
    'van-button': Button,
    'gender-type': GenderType,
    'text-type': TextType,
    'single-select-type': SingleSelectType,
    'multi-select-type': MultiSelectType,
    'address-type': AddressType,
    'date-type': DateType,
    'image-type': ImageType,
    'van-tree-select': TreeSelect,
  },

  data() {
    return {
      ENUMS: enums,
      prefix: 'se',
      noData,
      profileList: [],
      profileValues: {},

      // 错误信息
      errors: {},

      // 小程序项目兼容字段
      type: Args.get('type') || 0,
      clueId: Args.get('clueId') || 0,
      sourceList: [],
      sourceMainActiveIndex: 0,
      sourceItemActiveId: 0,
      isShowMask: false,
      isShowSource: false,
      parsedRight: undefined,
      // 线索来源信息
      sourceData: {},

      // 从Apollo获取的配置
      remoteConf: undefined,
    };
  },

  computed: {
    // 店铺ID
    kdtId() {
      return window._global.kdt_id;
    },
    // 系统来源不支持更改
    isSystemSource() {
      return this.type === 'edit' && this.sourceData.sourceType !== 2;
    },
  },

  mounted() {
    this.initTitle();
    this.initFiledsSetting();
    if (this.type === 'add') {
      this.initAttribute();
    } else {
      this.initAttributeById();
    }
  },

  methods: {
    initTitle() {
      const typeObj = {
        add: '添加线索',
        edit: '编辑线索',
      };
      document.title = typeObj[this.type];
    },
    // 初始化配置信息
    initFiledsSetting() {
      this.$store.dispatch('updateClueModule/getRemoteConf').then(data => {
        this.remoteConf = data;
      });
    },
    initAttribute() {
      // 获取资料项设置改为使用新的接口获取，applicableScene：2表示获取的是线索管理相关的接口
      this.$store
        .dispatch('updateClueModule/findAttributeItemsByKdtId', {
          sceneId: 2,
        })
        .then(res => {
          if (res && res.length > 0) {
            const attributes = res;
            // 获取到相关配置之后，通过调用getDifferentType方法来对配置项进行定制，在线索管理中，需要加上的是线索来源（source）类型
            this.profileList = getDifferentType(res, true);
            const initValues = {};
            // 拿到配置项之后根据资料项类型初始化表单的值
            attributes.forEach(item => {
              const { attributeId, attributeKey, dataType } = item;
              const name = attributeKey || attributeId;
              initValues[name] = DEFAULT_VALUE_ENUM[dataType] || '';
            });
            this.profileValues = initValues;
          } else {
            Toast('无可添加资料项');
          }
        })
        .catch(err => {
          Toast(err);
        });
    },
    initAttributeById() {
      const { clueId } = this;
      this.$store
        .dispatch('updateClueModule/getAttributesById', {
          clueId,
        })
        .then(res => {
          if (res && res.attributes && res.attributes.length > 0) {
            const attributes = res.attributes;
            // 设置线索来源
            this.$store.dispatch('updateClueModule/setSourceId', res.source.sourceId);
            this.sourceItemActiveId = res.source.sourceId;
            // 设置线索来源的显示
            this.parsedRight = `${res.source.groupName}/${res.source.name}`;
            this.sourceData = res.source || {};
            this.profileList = getDifferentType(attributes, true);
            // 初始化需要提交的表单的value集合
            const initValues = {};
            attributes.forEach(item => {
              const { attributeId, attributeValue, attributeKey, dataType } = item;
              const name = attributeKey || attributeId;
              initValues[name] = attributeValue || DEFAULT_VALUE_ENUM[dataType] || '';
              if (dataType === enums.customProfileType.GENDER) {
                if (/男|女/.test(attributeValue)) {
                  initValues[name] = GENDER_REFLECT[attributeValue];
                }
              }
            });
            this.profileValues = initValues;
          } else {
            Toast('暂无资料项');
          }
        })
        .catch(err => {
          Toast(err);
        });
    },
    getError(name) {
      return get(this.errors, `items[${name}]`, {});
    },
    // Apollo配置
    getPlaceholders(dataType) {
      const remotePlaceholders = get(this.remoteConf, 'placeholders', '[]');
      try {
        return get(JSON.parse(remotePlaceholders), `[${dataType}]`);
      } catch (err) {
        return undefined;
      }
    },
    getRemoteLimitation(dataType) {
      switch (dataType) {
        case enums.customProfileType.TEXT:
          return get(this.remoteConf, 'textLimit');
        case enums.customProfileType.NUMBER:
          return get(this.remoteConf, 'numberLimit');
        default:
          return undefined;
      }
    },
    getProps(config) {
      // 标准资料项会有key
      const standardKey = get(config, 'attributeKey');
      const name = standardKey || config.attributeId;
      config.required = config.needFill;
      if (!name) {
        throw new Error('请检查资料项列表是否含有标准资料项key或者attributeId');
      }
      config.label = config.attributeTitle || '';
      config.name = name;
      // 从表单数据中获取相对应的value
      config.value = get(this.profileValues, name);

      // 错误处理与提示
      if (this.errors.isHasError) {
        const errorItems = this.errors.items;
        config.errorConf = errorItems[name];
      }
      if (
        config.dataType === enums.customProfileType.TEXT ||
        config.dataType === enums.customProfileType.NUMBER
      ) {
        // 改为从apollo拿配置，如果没有就用原有的
        const defaultPlaceholder = '最多20个字';
        const defaultMaxlength = 20;
        const remotePlaceholder = this.getPlaceholders(config.dataType);
        const remoteLimitation = this.getRemoteLimitation(config.dataType);
        // 如果原来处理了placeholder，就不要再处理了
        if (!config.placeholder) {
          if (remoteLimitation) {
            config.placeholder = `最多${remoteLimitation}个字` || defaultPlaceholder;
          } else {
            config.placeholder = remotePlaceholder || defaultPlaceholder;
          }
        }
        config.maxlength = remoteLimitation || defaultMaxlength;
      }

      // 设置特定的标准资料项的字数限制
      if (standardKey === 'edu_stuName' || standardKey === 'edu_school') {
        config.placeholder = '最多20个字';
        config.maxlength = 20;
      } else if (standardKey === 'edu_stuAddress') {
        config.maxlength = 100;
      } else if (standardKey === 'edu_stuContractWeChat') {
        config.placeholder = '最多30个字';
        config.maxlength = 30;
      } else if (standardKey === 'edu_idCard') {
        // 开启身份证校验
        config.validations = {
          isIdCard: true,
        };
        config.validationErrors = {
          isIdCard: '身份证格式不正确',
        };
      } else if (standardKey === 'edu_stuBirth') {
        config.maxDate = new Date();
      }
      return config;
    },
    // 类型判断
    isEqualType(config, type) {
      const TYPE = get(config, 'dataType');
      return !!(TYPE !== undefined && Number(TYPE) === type);
    },
    // valueChange
    valueChange(key, value) {
      const conf = this.profileList.find(
        profile => get(profile, 'attributeKey') === key || get(profile, 'attributeId') === key,
      );
      const onValueChanged = get(conf, 'onValueChanged');
      let newValues = { [key]: value };
      if (onValueChanged) {
        newValues = onValueChanged(value);
      }
      this.profileValues = Object.assign({}, this.profileValues, newValues);
      const errorKeys = Object.keys(this.errors);
      if (errorKeys.length) {
        this.errors.items[key].isError = false;
      }
    },
    // 校验表单数据
    validatingForm() {
      const values = this.profileValues;
      const profileList = this.profileList;
      if (profileList.length) {
        // 将原有的配置项加上value然后传入校验规则进行校验（需要使用到applicableScene）
        const validatingVals = profileList
          // 筛选出一些不需要参加校验的配置项，这里divide只是一个UI组件，不参与校验
          .filter(profile => profile !== 'divide')
          .map(profile => {
            if (typeof profile === 'string') {
              return profile;
            }
            const { attributeId, attributeKey } = profile;
            const name = attributeKey || attributeId;
            return Object.assign({}, profile, {
              value: values[name],
            });
          });
        const result = validating(validatingVals, 2, this.sourceItemActiveId);
        if (!result.isHasError) {
          return true;
        }
        // 设置错误信息
        this.errors = result;
      }
      return false;
    },
    // 创建编辑线索
    createOrUpdateClue() {
      if (!this.validatingForm()) {
        return void 0;
      }
      // 避免重复请求
      if (APILock) {
        return void 0;
      }
      APILock = true;

      // 获取value并且对其中的特殊格式要求的数据进行转换
      const values = this.profileValues;
      const profileList = this.profileList.filter(value => typeof value !== 'string');
      const keys = Object.keys(values);
      /** @type {Array<{attributeId: number; attributeValue: any; attributeKey?: string;}>} */
      const attributes = keys.map(attributeIdOrKey => {
        // 找到对应这个name的资料项配置
        let originProfileConf = profileList.filter(profile => {
          const { attributeId, attributeKey } = profile;
          const name = attributeKey || attributeId.toString();
          return name === attributeIdOrKey;
        })[0];
        const { dataType, attributeId, attributeKey } = originProfileConf;
        let value = originProfileConf.value;
        if (value) {
          // 如果是地址类型的，需要将其序列化
          // ⚠️地址类型的补充说明
          // 1. ADDRESS: [{code: number, name: string} × 3, streetName]
          // 2. PROVINCE: [{code: number, name: string} × 3, '']
          // 在线索管理中，需要将地址类型（ADDRESS）转为四个code-name的数据格式，省市区类型需要转为仅有三个code-name的格式
          if (
            dataType === enums.customProfileType.ADDRESS ||
            dataType === enums.customProfileType.PROVINCE
          ) {
            if (Array.isArray(value)) {
              if (value.length) {
                if (dataType === enums.customProfileType.PROVINCE) {
                  value = value.slice(0, 3);
                } else {
                  // 线索管理的地址格式不一样
                  value = value.slice(0, 3).concat({ code: 0, name: value[3] });
                }
                value = JSON.stringify(value);
              } else {
                value = '';
              }
            } else {
              value = value || '';
            }
          }
          // 如果是多选项需要将其转成字符串，并以','分割
          if (dataType === enums.customProfileType.MULTISELECT) {
            if (Array.isArray(value) && value.length) {
              value = value.join(',');
            } else {
              value = '';
            }
          }
        }
        return {
          attributeId,
          attributeKey,
          attributeValue: String(value),
        };
      });

      // 组装数据准备提交
      const sourceId = this.$store.getters['updateClueModule/sourceId'];
      let clueAddDistribute = {};
      const name = attributes.filter(attr => attr.attributeKey === 'edu_stuName')[0].attributeValue;
      const telephone = attributes.filter(attr => attr.attributeKey === 'edu_stuContractPhone')[0]
        .attributeValue;
      const clueId = this.clueId;
      const type = this.type;

      if (isEduBranchStore) {
        // 校区逻辑
        clueAddDistribute = {
          kdtType: 3, // 1:分配给总部, 2:分配给校区, 3:校区分配给校区
          targetKdtId: global.kdtId,
          receiveType: 1, // 0:公海池 ，1:指定课程顾问
          userId: global.userId, // 单店模式默认分配给自己
        };
      } else {
        // 总店/单店逻辑
        clueAddDistribute = {
          kdtType: 1, // 1:分配给总部, 2:分配给校区, 3:校区分配给校区
          receiveType: 1, // 0:公海池 ，1:指定课程顾问
          userId: global.userId, // 单店模式默认分配给自己
        };
      }

      const confirmObj = {
        add: {
          url: 'updateClueModule/create',
          data: {
            attributes,
            // 如果是总部添加给总部(kdtType)，则需要指明是公海池/指定课程顾问(receiveType)，
            // 如果为指定课程顾问则需要userid，单店模式按照总部传参
            // 如果总部添加给校区(kdtType)，则需要指定targetKdtId即可
            clueAddDistribute,
            sourceId,
            name,
            telephone,
          },
        },
        edit: {
          url: 'updateClueModule/update',
          data: {
            attributes,
            clueId,
            sourceId,
          },
        },
      };

      this.$store
        .dispatch(confirmObj[type].url, confirmObj[type].data)
        .then(() => {
          Toast.success({ message: '保存成功', duration: 1500 });
          setTimeout(() => {
            type === 'edit' ? history.go(-1) : (window.location.href = '/v4/vis/h5/edu/clue#');
          }, 1500);
        })
        .catch(Toast)
        .finally(() => {
          APILock = false;
        });
    },
    showSourceModal() {
      if (this.isSystemSource) {
        Toast('系统默认来源，不可修改');
        return;
      }
      if (this.sourceList.length === 0) {
        this.$store
          .dispatch('updateClueModule/findSourceGroupPage', {
            pageSize: 100,
            pageNumber: 1,
            needSystemDefault: false,
          })
          .then(res => {
            if (res && res.content && res.content.length > 0) {
              this.parseSource(res.content);
              this.isShowMask = true;
              this.isShowSource = true;
            } else {
              Toast('无可选择的来源');
            }
          })
          .catch(err => {
            Toast(err);
          });
      } else {
        this.isShowMask = true;
        this.isShowSource = true;
      }
    },
    parseSource(list) {
      const sourceList = [];
      list.map((group, groupIdx) => {
        let obj = {};
        obj.text = group.name || '';
        obj.groupId = group.groupId || 0;
        // 编辑线索时默认选中原来的来源分组
        if (group.groupId === this.sourceData.groupId) {
          this.sourceMainActiveIndex = groupIdx;
        }
        obj.children = group.sourceDTOS.map(source => {
          return {
            text: source.name,
            id: source.sourceId,
          };
        });
        sourceList.push(obj);
      });

      this.sourceList = sourceList;
    },
    onClickSourceMain(index) {
      this.sourceMainActiveIndex = index;
    },
    onClickSourceItem(data) {
      this.sourceItemActiveId = data.id;
      this.$store.dispatch('updateClueModule/setSourceId', data.id);
      const errorKeys = Object.keys(this.errors);
      if (errorKeys.length) {
        this.errors.items.source.isError = false;
      }
      setTimeout(() => {
        this.parsedRight = `${this.sourceList[this.sourceMainActiveIndex].text}/${data.text}`;
        this.isShowMask = false;
        this.isShowSource = false;
      }, 500);
    },
    onHideMask() {
      this.isShowMask = false;
      this.isShowSource = false;
    },
  },
};
</script>
<style lang="postcss">
body {
  background-color: #f7f8fa;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
}

.confirm {
  display: block;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  text-align: center;
  border-radius: 22px;
  color: #fff;
  background-color: #00b389;
  width: 100%;
  margin: 20px auto 0;
}

.panel.error {
  min-height: unset;
  padding: 8px 0 8px 12px;
  font-size: 12px;
  color: #f44;
}

.van-radio__icon--checked {
  .van-icon-success {
    background-color: #00b389 !important;
    border-color: #00b389 !important;
  }
}

.van-button--primary {
  background-color: #00b389 !important;
}

.update-clue {
  padding: 14px 15px;

  .van-tree-select {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
    width: 100%;
  }

  .van-tree-select__nitem--active {
    font-weight: normal;
    color: #00b389;

    &::after {
      background: none;
    }
  }

  .van-tree-select__item {
    font-weight: normal;
  }

  .van-tree-select__item--active {
    color: #00b389;
  }
}

.no-border {
  height: 15px;
  background-color: transparent !important;
}

.se {
  &__submit-btn {
    height: 44px;
    line-height: 44px;
    width: 95%;
    border-radius: 50px;
    margin: 20px auto;
    display: block;
  }

  &__content {
    padding: 16px;
    background-color: #f8f8f8;

    .van-button {
      width: 100%;
    }
  }

  &-dialog {
    .content {
      padding: 30px 100px;
      text-align: center;
    }
  }

  &__field {
    position: relative;
    background-color: #fff;

    &:not(:first-child)::after {
      content: '';
      position: absolute;
      pointer-events: none;
      box-sizing: border-box;
      left: 15px;
      right: 0;
      top: 0;
      transform: scaleY(0.5);
      border-bottom: 1px solid #eee;
    }

    .no-border ::after,
    .no-border + .se__field::after {
      visibility: hidden;
    }

    .section {
      width: 100%;
    }

    &.van-cell.van-field {
      margin-bottom: 0;
    }

    input {
      color: #666;

      &::placeholder {
        color: #ccc;
      }
    }

    &-panel {
      display: flex;
      min-height: 46px;
      padding-left: 15px;
      align-items: center;
      font-size: 14px;

      .no-options {
        text-align: center;
        color: #ccc;
      }

      .van-field {
        flex: 1;
        padding-left: 0;
      }
    }

    .van-cell__title {
      max-width: 100px;
    }

    &-label {
      width: 100px;
    }

    .van-icon.van-icon-arrow {
      transform: scale(0.7);
    }
  }
}
</style>
