<template>
  <div :class="{ [prefix]: true, 'student-cert': true }">
    <vis-dynamic-form
      v-if="profileList.length"
      :form-configs="getFormattedFormConfig()"
      class="student-edit"
      @submit="formatDataBeforeSubmit"
    >
      <!-- 表单提交区域 -->
      <template slot-scope="{ submit }">
        <div class="disclaimer">
          提交信息即视为你已同意
          <a alt="个人信息使用授权书" href="https://www.youzan.com/intro/rule/detail?alias=1eylob3di&pageType=rules">
            个人信息使用授权书
          </a>
        </div>
        <van-button
          type="primary"
          class="main-button"
          style="margin-bottom: 16px"
          @click="submit"
        >
          保存并使用
        </van-button>
        <van-button v-if="isEqualUserId && isEdit" @click="showDeleteDialog = true"> 删除 </van-button>
      </template>
    </vis-dynamic-form>
    <!-- Dialog: 删除学员 -->
    <van-dialog
      v-model="showDeleteDialog"
      :class="`${prefix}-dialog`"
      :close-on-click-overlay="true"
      show-cancel-button
      @confirm="deleteStudent"
    >
      <p class="content">确定删除学员</p>
    </van-dialog>
  </div>
</template>
<script>
/**
 * @description 编辑学员
 * @param {QueryStringParameters} alias 学员alias
 */
import Vue from 'vue';
import { Button, Toast, Dialog } from 'vant';
import { DynamicForm } from '@youzan/vis-ui';
import ajax from '@/common/utils/captainAjaxWrap';
import * as SafeLink from '@youzan/safe-link';
import Args from 'zan-utils/url/args';

import get from 'lodash/get';
import clone from 'lodash/clone';
import omit from 'lodash/omit';

import enums from './enums';
import reflectValue from './utils/reflect-value';
import preformatProfileList from './utils/preformat-profile-list';
import getFormConfig from './form-config';

import { ZNB } from '@youzan/wxsdk';

Vue.use(Toast);
Vue.use(Dialog);

const noData = 'https://img01.yzcdn.cn/public_files/2018/10/23/5a01c6428aaa01c3878ce72f265ff952.png';

export default {
  name: 'student-edit',

  components: {
    'van-button': Button,
    'vis-dynamic-form': DynamicForm,
  },

  data() {
    const alias = Args.get('alias');
    const fromOrder = Args.get('from') !== 'studentCert';
    const callbackUrl = Args.get('callback_url') || '';
    return {
      isEdit: alias !== '',
      fromOrder, // 是否来源是下单页，这两个不同来源会有不同的页面展示逻辑
      alias,
      prefix: 'se',
      noData,
      profileList: [],
      clonedProfileList: [],
      showDeleteDialog: false,
      studentNo: undefined,
      createUserId: 0,
      callbackUrl,

      // 错误信息
      remoteConf: undefined,
    };
  },

  computed: {
    // 店铺ID
    kdtId() {
      return window._global.kdt_id;
    },
    isEqualUserId() {
      return window._global.buyer_id === this.createUserId;
    },
  },

  created() {
    document.title = this.isEdit ? '编辑学员' : '新增学员';
  },

  mounted() {
    const loading = Toast.loading({
      mask: true,
      message: '加载中...',
    });
    this.getAplloProfileSettings();
    if (this.isEdit) {
      this.getStudentInfoByStudentId(loading);
    } else {
      this.getProfileList(loading);
    }
  },

  methods: {
    // 初始化配置信息
    getAplloProfileSettings() {
      ajax({
        url: '/wscvis/edu/profile/get-remote-conf.json',
        method: 'GET',
        data: {},
        contentType: 'application/json; charset=utf-8',
      }).then((res) => {
        this.remoteConf = get(res, 'data');
      });
    },
    // 查询学员信息
    getStudentInfoByStudentId(loading) {
      const data = {
        kdtId: this.kdtId,
        studentId: this.alias,
      };
      const DELAY = 2000;

      ajax({
        method: 'get',
        url: `/wscvis/edu/getStudentInfoByScene.json?kdt_id=${this.kdtId}`,
        data,
      })
        .then(({ data }) => {
          const { customizeItems = [], studentNo, createUserId = 0 } = get(data, '[0]', {});
          if (customizeItems.length) {
            this.profileList = preformatProfileList(customizeItems, this.fromOrder, this.isEdit).filter(
              (profile) => profile !== undefined,
            );
            this.studentNo = studentNo;
            this.createUserId = createUserId;
          }
        })
        .catch(() => {
          Toast({
            duration: 0,
            mask: true,
            message: `加载失败，${DELAY / 1000}秒后返回上一页`,
          });
          setTimeout(() => {
            window.history.back();
          }, DELAY);
        })
        .finally(loading.clear);
    },
    // 获取自定义资料项（创建)
    getProfileList(loading) {
      ajax({
        method: 'GET',
        url: `/wscvis/edu/student-edit/profile-list.json?kdt_id=${this.kdtId}`,
      })
        .then(({ data }) => {
          window.yzStackLog.log({
            name: 'profile-list-origin-data',
            message: '学员资料项原始数据',
            extra: {
              data,
            },
            level: 'info',
          });
          this.profileList = preformatProfileList(data, this.fromOrder, this.isEdit).filter(
            (profile) => profile !== undefined,
          );
        })
        .finally(loading.clear);
    },
    getFormattedFormConfig() {
      let formattedConfigs = [];
      if (this.profileList.length) {
        if (!this.clonedProfileList.length) {
          this.clonedProfileList = this.profileList.map(clone);
        }
        formattedConfigs = getFormConfig(this.clonedProfileList, {
          studentNo: this.studentNo,
          remoteConf: this.remoteConf,
        });
        // 上报学员格式化config出错的元数据
        const hasError = formattedConfigs.some((config) => get(config, 'type') === undefined);
        if (hasError) {
          window.yzStackLog.log({
            name: 'format-custom-profile-error',
            message: '学员资料项格式化错误',
            extra: {
              originData: this.profileList,
              remoteConf: this.remoteConf,
              studentNo: this.studentNo,
            },
            level: 'error',
          });
        }
      }
      return formattedConfigs;
    },
    formatDataBeforeSubmit(formData) {
      const profileList = this.profileList.filter((profile) => typeof profile !== 'string');
      // studentNo只是展示用字段，并非form表单提交必须的字段
      const formKeys = Object.keys(omit(formData, 'studentNo'));
      try {
        const formattedData = formKeys.map((formKey) => {
          const currentOriginProfile = profileList.find((profile) => {
            const { attributeId, attributeKey } = profile;
            return formKey === attributeKey || formKey === attributeId.toString();
          });

          if (currentOriginProfile === undefined) {
            throw new Error(`找不到相对应的资料项${formKey}`);
          }

          let mutableValue = formData[formKey] || '';
          mutableValue = this.formatSpecialTypeValue(currentOriginProfile, mutableValue);
          return {
            attributeId: get(currentOriginProfile, 'attributeId'),
            value: String(mutableValue),
          };
        });

        let formattedFormData = { customAttributeItems: formattedData };
        // 将原有的数据，例如name,address映射到与customAttributeItems同级
        formattedFormData = reflectValue(formData, formattedFormData);

        let method = 'POST';
        let url = `/wscvis/edu/createOwlStudent.json?kdt_id=${this.kdtId}`;
        if (this.isEdit) {
          method = 'PUT';
          url = `/wscvis/edu/updateOwlStudent.json?kdt_id=${this.kdtId}`;
          formattedFormData.studentId = this.alias;
        }
        this.modifyStudent(formattedFormData, method, url);
      } catch (e) {
        Toast.fail(e && e.message);
      }
    },
    formatSpecialTypeValue(currentOriginPorfile, currentValue) {
      let mutableValue = currentValue || '';
      if (currentOriginPorfile && currentOriginPorfile instanceof Object) {
        const { dataType } = currentOriginPorfile;
        // 如果是地址类型的，需要将其序列化
        switch (dataType) {
          case enums.customProfileType.ADDRESS:
          case enums.customProfileType.PROVINCE:
            if (Array.isArray(currentValue) && currentValue.length) {
              const streetPart = get(currentValue, '[3].name', '');
              mutableValue = currentValue.slice(0, 3).concat({ code: 0, name: streetPart });
              mutableValue = JSON.stringify(mutableValue);
            }
            break;
          case enums.customProfileType.MULTISELECT:
            if (Array.isArray(currentValue) && currentValue.length) {
              mutableValue = currentValue.join(',');
            } else {
              mutableValue = '';
            }
            break;
          default:
            break;
        }
      }
      return mutableValue;
    },
    // 创建/更新学员
    modifyStudent(formData, method, url) {
      Toast.loading('正在保存...');
      ajax({
        method,
        url,
        data: formData,
        contentType: 'application/json; charset=utf-8',
      })
        .then(({ data, code, msg }) => {
          if (code === 0) {
            Toast.success('保存成功');
            this.backPrePage((data || {}).alias, method);
          } else {
            Toast.fail(msg || '保存失败');
          }
        })
        .catch((err) => Toast.fail(err));
    },
    // 删除学员
    deleteStudent() {
      const data = {
        kdtId: this.kdtId,
        alias: this.alias,
      };
      Toast.loading({
        duration: 0,
        mask: true,
        message: '正在删除...',
      });
      ajax({
        method: 'DELETE',
        url: `/wscvis/edu/student.json?kdt_id=${this.kdtId}`,
        data,
        withCredentials: true,
        contentType: 'application/json; charset=utf-8',
      })
        .then(({ data, code, msg }) => {
          if (code === 0) {
            this.backPrePage();
          } else {
            Toast(msg || '删除失败');
          }
        })
        .catch(() => {
          Toast('删除失败');
        });
    },
    // 返回上一页
    backPrePage(alias, method) {
      // 编辑学员成功之后，在url中添加addenStudent字段，标识已新建/编辑学员
      if (this.callbackUrl === 'WEAPP_BACK_ACTION') {
        ZNB.back();
      } else if (alias && this.callbackUrl) {
        const ALIAS = method === 'POST' ? alias : this.alias;
        const url = Args.add(this.callbackUrl, {
          checkedStudent: ALIAS,
        });
        SafeLink.redirect({
          url,
          kdtId: window._global.kdt_id,
          redirectType: 'replace',
        });
      } else {
        history.go(-1);
      }
    },
  },
};
</script>
<style lang="scss">
.student-edit {
  .submit-button {
    margin-top: 0;
  }

  .disclaimer {
    margin-top: 16px;
    margin-bottom: 32px;
    font-size: 12px;
    color: #969799;

    a {
      color: #155bd4;
    }
  }
}

.student-cert {
  padding: 12px;
}

.submit-button .van-button {
  width: 100%;
  border-radius: 50px;
}

.se-dialog .content {
  padding: 30px 100px;
  text-align: center;
}
</style>
