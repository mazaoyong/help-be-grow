<template>
  <vis-dynamic-form
    v-if="formConfigs.length"
    :no-required-text="noRequiredText"
    :form-configs="formConfigs"
    @change="handleChange"
    @submit="handleSubmit"
    @fail="handleFail"
    class="info-collector"
  >
    <template
      slot="withLabel"
      slot-scope="form"
    >
      <van-field
        v-model="smsCaptcha"
        class="captcha-field"
        placeholder="请输入验证码"
        right
        maxlength="6"
        :error-message="withLabelErrMsg"
        @input="() => form.changeHandler('withLabel', smsCaptcha)"
      >
        <van-button
          slot="button"
          plain
          type="danger"
          class="captcha"
          loading-text="发送中..."
          :color="captchaFontColor"
          @click="onSendCaptcha"
        >
          {{ `${captchaTimeout === 0 ? '获取验证码' : `${captchaTimeout}s后再次获取`}` }}
        </van-button>
      </van-field>
    </template>
    <template slot-scope="{ submit }">
      <div class="disclaimer">
        提交信息即视为你已同意
        <a
          alt="个人信息使用授权书"
          href="https://www.youzan.com/intro/rule/detail?alias=1eylob3di&pageType=rules"
        >
          个人信息使用授权书
        </a>
      </div>
      <div class="form-fixed-button">
        <van-button type="primary" class="main-button" @click="submit">
          {{ submitText }}
        </van-button>
      </div>
    </template>
  </vis-dynamic-form>
</template>

<script>
import Vue from 'vue';
import { Button, Field, Toast } from 'vant';
import { DynamicForm, ajax } from '@youzan/vis-ui';
import buildUrl from '@youzan/utils/url/buildUrl';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import cookie from 'zan-utils/browser/cookie';
import { verifyCheckSmsCaptcha } from '@/common/utils/checkSmsCaptcha';

import {
  appendSpecificPropertyByPath,
  appendRequiredProperty,
  appendOptionsProperty,
  appendPlaceholderProperty,
  appendLimitationProperty,
  setRelationBetweenBirthdayAndAge,
  appendPhoneValidation,
  appendDefaultValue,
} from './utils';
import {
  formatAttributeWithCaptcha,
  formatSubmitAttributeWithCaptcha,
} from './formatter';
import {
  COLLECT_INFO_VALUE_CACHE,
  QUICK_COLLECT_SUPPORT_KEYS,
} from '../../constants/course/collect-info-type';

const PHONE_REG = /^1\d{10}$/;

export default Vue.extend({
  name: 'info-collection-form',

  components: {
    'van-button': Button,
    'vis-dynamic-form': DynamicForm,
    'van-field': Field,
  },

  props: {
    infoCollectionItems: {
      type: Array,
      default: () => [],
    },
    noRequiredText: {
      type: Boolean,
      default: false,
    },
    infoCollectDto: {
      type: Object,
      default: () => ({}),
    },
    submitText: {
      type: String,
      default: '保存',
    },
    needVerifyCode: {
      type: Boolean,
      default: false,
    },
    // 1:线上课, 2:好友助力/涨粉海报 3:转介绍, 4:攒学费, 5:报名表单
    scene: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      remoteConf: undefined,
      // 设置默认值，用于弹窗在没有保存的情况下关闭再重新打开时候能够恢复保存的数据，而不是编辑未保存的数据
      defaultInfoCollectValue: this.infoCollectDto,
      phone: '',
      smsCaptcha: '',
      captchaTimeout: 0, // 每60s最多发送一次验证码
      captchaTimer: null, // 验证码倒计时
      withLabelErrMsg: '',
      formConfigs: [],
      cacheValue: null,
    };
  },

  computed: {
    captchaFontColor() {
      if (PHONE_REG.test(this.phone) && this.captchaTimeout === 0) {
        return this.$theme ? this.$theme.colors.main : '#ff5100';
      }
      return '#c8c9cc';
    },

    // 只有线下课支持快捷采集
    supportQuickCollect() {
      return this.scene === 1;
    },
  },

  mounted() {
    this.getAplloProfileSettings();
    this.handleSpecialLogic();
    this.calcFormConfigs();
    this.initSmsCaptcha();
  },

  methods: {
    calcFormConfigs() {
      const propFormConfigs = this.infoCollectionItems;
      if (Array.isArray(propFormConfigs) && propFormConfigs.length > 0) {
        let formConfigsCopy = cloneDeep(propFormConfigs);
        formConfigsCopy = formatAttributeWithCaptcha(
          formConfigsCopy,
          this.needVerifyCode,
        );
        this.visDynamicFormConfigAdaptor(formConfigsCopy);
        this.formConfigs = formConfigsCopy;
      }
    },
    initSmsCaptcha() {
      const smsCaptcha = get(this.defaultInfoCollectValue, 'withLabel', '');
      if (smsCaptcha) {
        this.smsCaptcha = smsCaptcha;
      }
    },
    getAplloProfileSettings() {
      ajax({
        url: buildUrl(
          '/wscvis/edu/profile/get-remote-conf.json',
          'h5',
          window._global.kdt_id,
        ),
        method: 'GET',
        data: {},
        contentType: 'application/json; charset=utf-8',
      }).then(res => {
        this.remoteConf = res;
      });
    },
    handleSpecialLogic() {
      if (Array.isArray(this.infoCollectionItems)) {
        setRelationBetweenBirthdayAndAge(this.infoCollectionItems);
      }
    },
    visDynamicFormConfigAdaptor(propFormConfigs) {
      // 获取信息采集本地缓存
      const collectInfoCacheValue = this.getCollectInfoCache();

      propFormConfigs.forEach(config => {
        const { attributeKey, attributeId } = config;

        appendSpecificPropertyByPath(
          config,
          'name',
          'attributeKey',
          'attributeId',
        );
        appendSpecificPropertyByPath(config, 'label', 'attributeTitle');
        appendSpecificPropertyByPath(config, 'type', 'dataType');
        appendRequiredProperty(config);
        appendOptionsProperty(config);
        appendDefaultValue(config, this.defaultInfoCollectValue, collectInfoCacheValue);

        if (this.remoteConf !== undefined) {
          appendPlaceholderProperty(config, { remoteConf: this.remoteConf });
          appendLimitationProperty(config, { remoteConf: this.remoteConf });
        }

        if (attributeKey === 'edu_stuContractPhone') {
          appendPhoneValidation(config);

          const cachePhone =
            collectInfoCacheValue[attributeKey] ||
            collectInfoCacheValue[attributeId] ||
            '';
          if (cachePhone) {
            this.phone = cachePhone;
          }
        }
      });
    },

    handleSubmit(values) {
      this.handleSaveCollectInfoCache(values);
      if (this.phone && this.smsCaptcha) {
        verifyCheckSmsCaptcha({
          verifyCode: this.smsCaptcha,
          mobile: this.phone,
          scene: this.scene,
          onSucccess: () => {
            this.closePopup(values);
          },
          onFailed: (msg) => {
            Toast(msg);
          },
        });
      } else {
        this.closePopup(values);
      }
    },

    closePopup(values) {
      const attibuteInfo = formatSubmitAttributeWithCaptcha(this.formConfigs, values);
      this.$emit('resolve', attibuteInfo);
      this.$emit('submit', attibuteInfo);
    },

    handleChange(values) {
      this.phone = get(values, 'edu_stuContractPhone', '');
      this.withLabelErrMsg = '';
      this.smsCaptcha && (values.captcha = this.smsCaptcha);
      this.cacheValue = values;
      this.$emit('change', values);
    },

    handleFail(values, errorMsgs) {
      for (let key in errorMsgs) {
        if (key === 'withLabel') {
          this.withLabelErrMsg = errorMsgs[key];
        }
      }
    },

    handleSaveCollectInfoCache(values) {
      if (!this.supportQuickCollect || !values) {
        return;
      }

      // 只有系统固定字段需要做快捷采集
      const filterValues = {};
      QUICK_COLLECT_SUPPORT_KEYS.forEach(v => {
        if (values[v]) {
          filterValues[v] = values[v];
        }
      });

      const oldCache = this.getCollectInfoCache();
      const newCache = {
        ...oldCache,
        ...filterValues,
      };

      cookie(COLLECT_INFO_VALUE_CACHE, {
        value: encodeURIComponent(JSON.stringify(newCache)),
        path: '/',
        domain: 'youzan.com',
        expires: 9999,
      });
    },

    getCollectInfoCache() {
      if (!this.supportQuickCollect) {
        return {};
      }

      let cache = cookie(COLLECT_INFO_VALUE_CACHE);
      try {
        cache = JSON.parse(decodeURIComponent(cache));
      } catch (err) {
        cache = {};
      }

      return cache || {};
    },

    onSendCaptcha() {
      if (this.captchaTimeout > 0) return;
      if (PHONE_REG.test(this.phone)) {
        this.$emit('sendCaptcha', this.phone, (isSuccess, msg) => {
          if (isSuccess) {
            this.captchaCountdown();
          } else {
            Toast(msg);
            // 验证码发送失败会自动刷新页面
            this.handleSaveCollectInfoCache(this.cacheValue);
          }
        });
      } else {
        Toast('请输入11位的手机号码');
      }
    },

    /**
     * 验证码倒计时
     */

    captchaCountdown(count = 60) {
      if (this.captchaTimer) {
        clearTimeout(this.captchaTimer);
      }
      if (count <= 60 && count > 0) {
        this.captchaTimeout = count - 1;
        this.captchaTimer = setTimeout(() => this.captchaCountdown(count - 1), 1000);
      }
    },
  },
});
</script>
<style lang="scss">
.vis-dynamic-form-container {
  padding-bottom: 50px;

  .submit-button {
    margin-top: 0;

    &::after {
      visibility: hidden;
    }
  }

  .form-fixed-button {
    position: fixed;
    bottom: 0;
    z-index: 999;
    height: 50px;
    width: 100%;
    padding: 0 16px 5px;
    background-color: #fff;
    box-sizing: border-box;
  }

  .custom {
    &.has-error {
      padding: 10px 16px;

      .van-cell__title {
        align-self: start;
        line-height: 24px;
      }
    }

    .captcha-field {
      width: 100%;
      padding: 0;
    }

    .captcha {
      cursor: pointer;
      height: 24px;
      line-height: 24px;
      border: 0;
    }
  }
}

.is-iphonex {
  .vis-dynamic-form-container {
    padding-bottom: 84px;
  }

  .se__field:last-child {
    margin-bottom: 32px;
  }

  .form-fixed-button {
    height: 84px;
  }
}

.info-collector {
  .radius-after:last-child::after {
    border-bottom: 1px solid #eee;
  }

  .disclaimer {
    font-size: 12px;
    padding: 16px;
    color: #969799;

    a {
      color: #155BD4;
    }
  }
}
</style>
