<template>
  <vis-page-container>
    <div :class="[prefix]">
      <div :class="`${prefix}__head`">
        <van-cell-group>
          <van-cell
            is-link
            class="avatar__cell"
            title="头像"
          >
            <img-uploader
              v-if="avatar[0]"
              :circle-shape="true"
              :can-delete="false"
              :default-images="avatar"
              :token-url="tokenUrl"
              icon-name="photograph"
              @onChange="onAvatarChange"
            />
            <img-uploader
              v-else
              :circle-shape="true"
              :can-delete="false"
              :token-url="tokenUrl"
              icon-name="photograph"
              @onChange="onAvatarChange"
            />
          </van-cell>
          <van-field
            v-model="form.name"
            clearable
            required
            label="姓名"
            placeholder="（必填）请输入学员姓名"
          />
          <van-field
            v-if="editMode"
            v-model="form.studentNo"
            readonly
            label="学员编号"
            class="stuNum__cell"
          />
        </van-cell-group>
      </div>
      <div :class="`${prefix}__content`">
        <van-cell-group :class="`${prefix}__content--radius`">
          <div
            v-for="field in fields"
            :key="field.key"
            class="van-cell van-cell--padding"
          >
            <template v-if="field.key === 'gender'">
              <van-cell
                class="gender__cell"
                title="性别"
              >
                <template slot="extra">
                  <van-radio-group v-model="form[field.key]">
                    <van-radio
                      class="gender--male"
                      name="1"
                    >
                      男
                    </van-radio>
                    <van-radio
                      class="gender--female"
                      name="2"
                    >
                      女
                    </van-radio>
                  </van-radio-group>
                </template>
              </van-cell>
            </template>
            <template v-else-if="field.key === 'age'">
              <van-field
                v-if="editMode"
                v-model="form[field.key]"
                readonly
                label="年龄"
                class="stuNum__cell"
              />
            </template>
            <template v-else>
              <van-field
                v-if="field.readonly"
                :key="field.key"
                v-model="form[field.key]"
                :class="[{
                  'cell__address': field.key === 'address',
                }]"
                :required="field.required"
                :icon="field.icon"
                :readonly="field.readonly"
                :label="field.label"
                :placeholder="field.placeholder"
                clearable
                @click="onTogglePopup(field.key !== 'age', field.key)"
              />
              <van-field
                v-else
                :key="field.key"
                v-model="form[field.key]"
                :required="field.required"
                :label="field.label"
                :placeholder="field.placeholder"
                clearable
              />
            </template>
          </div>
        </van-cell-group>
        <van-button
          :class="[`${prefix}__submit-btn`]"
          :loading="isSaveLoading"
          round
          type="danger"
          size="large"
          @click="onSubmitHandler"
        >
          保存
        </van-button>
        <van-button
          v-if="editMode"
          :class="`${prefix}__del-btn`"
          size="large"
          @click="onDelStudent"
        >
          <span class="text-primary">
            删除
          </span>
        </van-button>
        <van-popup
          v-model="showPopup"
          position="bottom"
        >
          <van-datetime-picker
            v-if="popupType === 'bornDate'"
            v-model="datetime.current"
            :min-date="datetime.min"
            :max-date="datetime.max"
            title="生日"
            type="date"
            @confirm="onChangeDate"
            @cancel="() => onTogglePopup(false)"
          />
          <van-area
            v-if="popupType === 'address'"
            :loading="isAreaLoading"
            :area-list="areaList"
            :value="(form._addressArr[2] && form._addressArr[2].code) || ''"
            @confirm="onChangeAddr"
            @cancel="() => onTogglePopup(false)"
          />
        </van-popup>
      </div>
    </div>
  </vis-page-container>
</template>
<script>
import Vue from 'vue';
import { Toast, Cell, CellGroup, Field, Button, Popup, DatetimePicker, Area, Dialog, RadioGroup, Radio } from 'vant';
import ajax from 'captain-ajax';
import formatDate from '@youzan/utils/date/formatDate';
import dataFactory from './fields.js';
import Args from 'zan-utils/url/args';
import { ImgUploader } from '@youzan/vis-ui';
import PageContainer from '../../components/page-container';
import * as SafeLink from '@youzan/safe-link';

Vue.use(Dialog);

const noData = 'https://img01.yzcdn.cn/public_files/2018/10/23/5a01c6428aaa01c3878ce72f265ff952.png';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const MAX_AGE = 125;
const initMonth = 1;
const initDay = 1;

/**
 * 获取联系地址
 */
function computedAddress(type, payload) {
  if (type === 0) {
    const res = [];
    try {
      const addrArr = JSON.parse(payload);
      res[0] = addrArr.slice(0, 3);
      res[1] = addrArr.slice(-1)[0];
    } catch (err) {
      res[0] = [];
      res[1] = '';
    }
    return res;
  }

  if (type === 1) {
    if (payload._addressArr.length < 3) return undefined;
    return JSON.stringify([].concat(payload._addressArr, payload._area));
  }
}

export default {
  name: 'stu-edit',

  components: {
    'vis-page-container': PageContainer,
    'van-cell': Cell,
    'van-cell-group': CellGroup,
    'van-field': Field,
    'van-button': Button,
    'van-popup': Popup,
    'van-datetime-picker': DatetimePicker,
    'van-area': Area,
    'van-radio-group': RadioGroup,
    'van-radio': Radio,
    ImgUploader,
  },

  data() {
    return {
      prefix: 'stu-edit',
      noData,
      isSaveLoading: false,
      form: dataFactory.form(),
      rules: dataFactory.rules(),
      fields: dataFactory.fields(),
      showPopup: false,
      popupType: 'bornDate',
      datetime: {
        current: currentDate,
        max: currentDate,
        min: new Date(currentYear - MAX_AGE, initMonth, initDay),
      },
      // 头像回显
      avatar: [Args.get('avatar')],
      /**
       * 省市县级联选择
       */
      areaList: {},
      isAreaLoading: false,
      tokenUrl: '/wscvis/getUploadToken.json',
    };
  },

  computed: {
    /**
     * 学员alias
     */
    alias() {
      return Args.get('alias');
    },

    /**
     * 店铺ID
     */
    kdtId() {
      return window._global.kdt_id;
    },

    /**
     * 是否为编辑模式
     */
    editMode() {
      return this.alias !== '';
    },
  },

  created() {
    if (this.editMode) {
      this.queryStudent();
    }
    this.getAreaList();
  },

  methods: {
    /**
     * 查询学员信息
     */
    queryStudent() {
      const loadingToash = Toast.loading({
        mask: true,
        message: '加载中...',
      });
      const data = {
        kdtId: this.kdtId,
        studentId: this.alias,
      };
      const DELAY = 2000;

      ajax({
        method: 'get',
        url: '/wscvis/edu/getSimpleById.json',
        data,
        withCredentials: true,
        contentType: 'application/json; charset=utf-8',
      }).then(({ data }) => {
        this.setForm(data);
        this.avatar = [data.avatar];
        setTimeout(() => {
          loadingToash.clear();
        }, DELAY / 2);
      }).catch(() => {
        Toast({
          duration: 0,
          mask: true,
          message: `加载失败，${DELAY / 1000}秒后返回上一页`,
        });
        setTimeout(() => {
          this.backPrePage();
        }, DELAY);
      });
    },

    /**
     * 表单数据回显
     */
    setForm(data) {
      const [addrArr, addrStr] = computedAddress(0, data.address);
      const gender = this.formatGender(data.gender);
      const age = this.formatAge(data.age, data.monthAge);

      this.form = {
        avatar: data.avatar,
        name: data.name,
        studentNo: data.studentNo,
        gender,
        bornDate: data.bornDate,
        grade: data.grade,
        age,
        mobile: data.mobile,
        wechatAccount: data.wechatAccount,
        address: addrArr.map(item => item.name).join(''),
        _addressArr: addrArr,
        _area: addrStr,
      };
    },

    // 处理gender
    formatGender(typeNum) {
      if (typeNum === 1) return '1';
      if (typeNum === 2) return '2';
      return 0;
    },

    // 处理年龄和月龄
    formatAge(age, monthAge) {
      if (age) {
        if (Number(age) === 0) {
          return `${monthAge}个月`;
        }
        return `${age}岁`;
      } else {
        return '';
      }
    },

    /**
     * 返回上一页
     */
    backPrePage(alias, method) {
      // 编辑学员成功之后，在url中添加addenStudent字段，标识已新建/编辑学员
      const prevPage = document.referrer;
      if (alias && prevPage) {
        const ALIAS = method === 'POST' ? alias : this.alias;
        const location = Args.add(prevPage, { checkedStudent: ALIAS });
        SafeLink.redirect({
          url: location,
          kdtId: window._global.kdt_id,
        });
      } else {
        history.go(-1);
      }
    },

    /**
     * 非法提交
     */
    notValid(prop, type) {
      const { requiredMsg, errMsg } = this.rules[prop];
      type === 'required'
        ? Toast(requiredMsg)
        : Toast(errMsg);
      return false;
    },

    /**
     * 表单校验
     */
    validate(form) {
      const { rules, notValid } = this;

      for (const prop in rules) {
        const _value = form[prop].trim();
        const _rule = rules[prop];

        if (_rule.required && _value === '') return notValid(prop, 'required');
        if (_rule.pattern && !_rule.pattern.test(_value)) return notValid(prop);
      }

      return true;
    },

    /**
     * 提交表单/更新表单
     */
    onSubmitHandler() {
      this.isSaveLoading = true;
      if (this.validate(this.form)) {
        let method = 'POST';
        let url = '/wscvis/edu/createOwlStudent.json';
        const { avatar, name, gender, bornDate, grade, mobile, wechatAccount, _addressArr, _area } = this.form;
        console.log(avatar);
        const data = {
          kdtId: this.kdtId,
          avatar,
          name,
          // gender: computedGender(1, { gender }),
          gender,
          bornDate,
          grade,
          mobile,
          wechatAccount,
          address: computedAddress(1, { _addressArr, _area }),
        };

        // 更新学员
        if (this.editMode) {
          method = 'PUT';
          url = '/wscvis/edu/updateOwlStudent.json';
          data.studentId = this.alias;
        }

        ajax({
          method,
          url,
          data,
          withCredentials: true,
          contentType: 'application/json; charset=utf-8',
        })
          .then(data => {
            console.log(data);
            this.isSaveLoading = false;
            if (data.code === 0) {
              Toast('保存成功');
              this.backPrePage(data, method);
            } else {
              Toast(data.msg);
            }
          })
          .catch((msg) => {
            Toast('保存失败，' + msg);
            this.isSaveLoading = false;
          });
      } else {
        this.isSaveLoading = false;
      }
    },

    /**
     * 删除学员信息
     */
    onDelStudent() {
      const data = {
        studentId: this.alias,
      };
      ajax({
        method: 'DELETE',
        url: '/wscvis/edu/deleteOwlStudent.json',
        data,
        withCredentials: true,
        contentType: 'application/json; charset=utf-8',
      })
        .then(data => {
          console.log('deleteData:', data);
          if (data.code === 0) {
            Toast('删除成功');
            this.backPrePage();
          } else {
            Toast(data.msg);
          }
        })
        .catch((msg) => {
          console.log(msg);
          Toast(msg);
        });
    },

    /**
     * 弹出层
     */
    onTogglePopup(bool, type = 'bornDate') {
      this.showPopup = bool;
      this.popupType = type;
    },

    /**
     * 获取地址数据
     */
    getAreaList() {
      this.isAreaLoading = true;
      ajax({
        method: 'GET',
        dataType: 'jsonp',
        url: 'https://www.youzan.com/v2/common/region/all.jsonp',
      })
        .then(({ data }) => {
          this.areaList = data;
          this.isAreaLoading = false;
        })
        .catch(() => {
          this.isAreaLoading = false;
        });
    },

    /**
     * 修改生日
     */
    onChangeDate(val) {
      this.form.bornDate = formatDate(val, 'YYYY-MM-DD');
      this.onTogglePopup(false);
    },

    /**
     * 修改省市县
     */
    onChangeAddr(val) {
      this.onTogglePopup(false);
      if (val.some(item => item.code === '-1')) return;
      this.form._addressArr = val;
      this.form.address = val.map(item => item.name).join('');
    },
    clearStudentSessionStorage() {
      sessionStorage.removeItem('checkedStudent');
    },

    // 获取上传后的图片路径
    onAvatarChange(files) {
      console.log('files:', files);
      if (files.length > 0) {
        this.form.avatar = files[0].thumb_url;
      }
    },
  },
};
</script>
<style lang="scss">
.bg-white {
  background-color: #fff !important;
}

.stu-edit {
  padding: 10px;

  &__loading {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -15px;
  }

  &__head,
  &__content {
    margin-bottom: 10px;
    overflow: hidden;
    border-radius: 6px;

    .van-field__control {
      &::-webkit-input-placeholder {
        color: #ccc;
      }
    }

    .van-field__icon {
      display: block !important;

      .van-icon {
        font-size: 12px;
      }
    }
  }

  &__content--radius {
    overflow: hidden;
    border-radius: 6px;
  }

  &__submit-btn {
    display: block;
    width: 100%;
    height: 44px;
    margin: 20px auto 10px;
    font-size: 16px;
    line-height: 44px;
    background-color: #00b389;
    border: none;
    border-radius: 50px;
  }

  &__del-btn {
    height: 44px;
    font-size: 16px;
    line-height: 44px;
    text-align: center;
    background-color: #fff;
    border: 0;
    border-radius: 22px;

    .van-button__text .text-primary {
      color: #f44;
    }
  }

  &__del-dialog {
    .van-dialog__confirm {
      color: #f44;
    }

    .content {
      padding: 30px 100px;
      text-align: center;
    }
  }

  .van-nav-bar__left {
    i,
    span {
      vertical-align: middle;
    }
  }

  .cell {
    &__address {
      &::after {
        left: 105px;
      }
    }
  }

  .gender__cell {
    .van-radio-group {
      height: 24px;
    }

    .van-radio {
      display: inline-block;
    }

    .van-radio .van-icon-checked {
      color: #00b389;
    }

    .gender--male {
      margin-right: 30px;
    }

    .van-cell__title {
      max-width: 90px;
    }
  }

  .avatar__cell {
    padding: 14px 15px;

    .visImgUploader .van-uploader {
      overflow: initial;

      .van-uploader__input {
        width: 240px;
      }
    }

    .van-cell__title {
      max-width: 90px;
      line-height: 36px;
    }

    .van-cell__right-icon {
      line-height: 36px;
    }

    .visImgUploader__uploaderWrap {
      width: 36px;
      height: 36px;

      img {
        border-radius: 100%;
      }
    }
  }

  .stuNum__cell {
    input {
      color: #ccc;
    }
  }

  .van-hairline--top-bottom::after {
    border: none;
  }

  &__content .van-cell--padding {
    padding: 0;
  }

  .van-cell--required::before {
    content: ' ';
  }

  .van-cell .van-cell__title,
  .van-field .van-cell__title {
    color: #666;
  }
}
</style>
