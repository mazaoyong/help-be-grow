<template>
  <div class="block-add-schedule">
    <vis-popup
      :value="showAddPopup"
      title="新建试听日程"
      :buttons="buttons"
      closeable
      @close="onPopupClose"
    >
      <div class="block-add-schedule__container">
        <div class="form-card">
          <vis-dynamic-form
            v-if="showAddPopup"
            ref="form"
            class="form"
            :form-configs="formConfigs"
            @value-change="onValueChange"
            @fail="onSubmitFail"
            @submit="onSubmitSuccess"
          >
            <!-- 替换默认的按钮 -->
            <div />

            <!-- 自定义字段 -->
            <template
              v-for="field in customFields"
              :slot="field.name"
              slot-scope="form"
            >
              <custom-field
                :key="field.name"
                :label="field.label"
                :value="getCustomFieldValue(scheduleForm[field.name])"
                :placeholder="field.placeholder"
                :error-message="
                  showErrorMessage &&
                    !getCustomFieldValue(scheduleForm[field.name]) ?
                      field.errorMessage : ''"
                required
                no-required-text
                @click="openSearchSelector(field.name)"
                @change="evt => form.changeHandler(field.name, evt.target.value)"
              />
            </template>
          </vis-dynamic-form>
        </div>
        <div class="info">
          试听日程只允许机构添加学员，学员自主约课无法预约此日程
        </div>
      </div>
    </vis-popup>

    <search-selector
      v-model="showSearchSelector"
      :title="searchSelectorTitle"
      @search="onSearch"
      @confirm="onSelectorConfirm"
    >
      <van-list
        :loading="searching"
        :finished="searchListFinished"
        :finished-text="searchList.length ? '没有更多了' : ''"
        @load="onSearchListLoad"
      >
        <template v-if="searching || searchList.length">
          <selectable-item
            v-for="item in searchList"
            :key="item.id"
            :label="item.label"
            :selected="isItemSelected(item.id)"
            :status-text="item.isConflict ? '日程冲突' : ''"
            @selected="onSelected(item)"
          />
        </template>
        <div v-else class="no-result">
          未找到相应的{{ curFieldLabel }}
        </div>
      </van-list>
    </search-selector>
  </div>
</template>

<script>
import {
  createNamespacedHelpers,
} from 'vuex';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { List, Dialog, Toast } from 'vant';
import { Popup, DynamicForm } from '@youzan/vis-ui';
import { TYPE_ENUMS } from '@youzan/vis-ui/es/dynamic-form';
import { isEduSingleStore, isEduHqStore } from '@youzan/utils-shop';
import CustomField from '../../components/custom-field';
import SearchSelector from '../../components/search-selector';
import SelectableItem from '../../components/selectable-item';
import { fixedFields, customFields } from './config';
import {
  SET_FIELD_VALUE,
  SET_SHOW_ADD,
} from '../../../../store/modules/schedule-list/mutation-types';

const {
  mapState,
  mapActions,
  mapMutations,
} = createNamespacedHelpers('scheduleList');

export default {
  name: 'block-add-schedule',

  components: {
    'van-list': List,
    'vis-popup': Popup,
    'vis-dynamic-form': DynamicForm,
    CustomField,
    SearchSelector,
    SelectableItem,
  },

  data() {
    return {
      customFields,
      showSearchSelector: false,
      curFieldName: false,
      selected: {},
      searchContent: '',
      isMultiSelector: false,
      showErrorMessage: false,
    };
  },

  computed: {
    ...mapState({
      showAddPopup: state => state.add.showAddPopup,
      searching: state => state.add.searching,
      searchList: state => state.add.searchList,
      searchListFinished: state => state.add.searchListFinished,
      scheduleForm: state => state.add.scheduleForm,
    }),

    buttons() {
      return [
        {
          text: '确定',
          class: 'main-btn',
          onClick: this.submit,
        },
      ];
    },

    formConfigs() {
      return [
        ...fixedFields,
        ...this.customFields.map(field => ({
          type: TYPE_ENUMS.CUSTOM,
          slotName: field.name,
          withoutLabel: true,
        })),
      ];
    },

    searchSelectorTitle() {
      return {
        addressId: '选择上课地点',
        kdtId: '选择上课校区',
        teacherNo: '选择老师',
        assistantNos: '选择助教',
        classroomNo: '选择教室',
      }[this.curFieldName];
    },

    curFieldLabel() {
      return {
        addressId: '地点',
        kdtId: '校区',
        teacherNo: '老师',
        assistantNos: '助教',
        classroomNo: '教室',
      }[this.curFieldName];
    },
  },

  methods: {
    ...mapActions([
      'fetchSearchList',
      'checkScheduleConflict',
      'postCreateSchedule',
      'resetForm',
    ]),
    ...mapMutations({
      setFieldValue: SET_FIELD_VALUE,
      setShowAdd: SET_SHOW_ADD,
    }),

    submit() {
      // 必须先检查自定义字段
      this.checkCustomFields();
      this.$refs.form.handleSubmit();
    },

    isItemSelected(id) {
      if (Array.isArray(this.selected)) {
        return this.selected.some(item => item.id === id);
      } else {
        return id === this.selected.id;
      }
    },

    getCustomFieldValue(field) {
      if (!field) return '';

      if (Array.isArray(field)) {
        return field.map(f => f.label).join('，');
      } else {
        return field.label;
      }
    },

    checkCustomFields() {
      const hasRequired = this.customFields.some(
        field => field.required &&
        !this.getCustomFieldValue(this.scheduleForm[field.name])
      );
      if (hasRequired) {
        this.showErrorMessage = true;
      } else {
        this.showErrorMessage = false;
      }
      return !hasRequired;
    },

    openConfirmDialog({ conflictCodes, query }) {
      const conflictMap = [
        '',
        ['老师', 'teacherNo'],
        ['班级', 'classNo'],
        ['教室', 'classroomNo'],
      ];
      // 默认展示第一个冲突的详情
      const [, key] = conflictMap[conflictCodes[0]];
      Dialog.confirm({
        title: '日程冲突',
        message: `"${get(this.scheduleForm, `${key}.label`)}"在该时段内已有日程，是否继续创建？`,
        confirmButtonText: '继续创建',
        confirmButtonColor: '#00b389',
      }).then(() => {
        this.postCreateSchedule(query);
      }).catch(() => {
        // todo: 关闭创建试听弹窗
      });
    },

    openSearchSelector(curFieldName) {
      const canOpen = !(
        isEduSingleStore &&
        curFieldName === 'classroomNo' &&
        isEmpty(this.scheduleForm.addressId)
      ) && !(
        isEduHqStore &&
        curFieldName !== 'kdtId' &&
        isEmpty(this.scheduleForm.kdtId)
      );
      if (!canOpen) {
        return Toast(`请先选择上课${isEduSingleStore ? '地点' : '校区'}`);
      }

      if (this.curFieldName !== curFieldName) {
        this.curFieldName = curFieldName;
        this.selected = this.scheduleForm[curFieldName]
          ? this.scheduleForm[curFieldName]
          : curFieldName === 'assistantNos'
            ? [] : {};
        this.searchContent = '';
        this.fetchSearchList({
          type: curFieldName,
          refresh: true,
        });
      }
      this.showSearchSelector = true;
    },

    onSearch(searchContent) {
      console.log('搜索：', searchContent);
      this.searchContent = searchContent;
      this.fetchSearchList({
        type: this.curFieldName,
        refresh: true,
        searchContent,
      });
    },

    onSearchListLoad() {
      this.fetchSearchList({
        type: this.curFieldName,
        searchContent: this.searchContent,
      });
    },

    onSelected(item) {
      if (Array.isArray(this.selected)) {
        // 测试问题 hotfix: 增加取消选择操作（todo：后面需要组件支持多选模式和取消操作）
        const selectedIndex = this.selected.map(i => i.id).indexOf(item.id);
        if (selectedIndex > -1) {
          this.selected.splice(selectedIndex, 1);
        } else {
          this.selected.push(item);
        }
      } else {
        if (this.selected === item) {
          this.selected = {};
        } else {
          this.selected = item;
        }
      }
    },

    // 搜索列表点击确定
    onSelectorConfirm() {
      console.log('更新表单值', this.curFieldName, this.selected);
      // 1. 检查当前选中的 item，是否存在于 searchList 中
      let isValid = false;
      if (Array.isArray(this.selected)) {
        let len = this.selected.length;
        this.selected.forEach(s => {
          const has = this.searchList
            .some(item => item.id === s.id);
          if (has) len--;
        });
        isValid = len === 0;
      } else {
        isValid = this.searchList
          .some(item => item.id === this.selected.id);
      }
      // 2. 设置表单值
      if (isValid || isEmpty(this.selected)) {
        this.setFieldValue({
          name: this.curFieldName,
          value: this.selected,
        });
      } else {
        this.selected = this.curFieldName === 'assistantNos' ? [] : {};
      }
      // 3. 关闭搜索列表
      this.showSearchSelector = false;
    },

    onValueChange(name, value) {
      console.log('更新表单值', name, value);
      this.setFieldValue({
        name,
        value,
      });
    },

    onSubmitSuccess(values) {
      if (this.showErrorMessage) {
        return;
      }

      console.log('可以提交了');
      this.checkScheduleConflict()
        .then(query => {
          // 可以提交了
          this.postCreateSchedule(query);
        })
        .catch(this.openConfirmDialog);
    },

    onSubmitFail(values, errorMsgs) {
      console.log('提交失败了', values, errorMsgs);
    },

    onPopupClose() {
      this.setShowAdd(false);
      this.resetForm();
      this.curFieldName = '';
    },
  },
};
</script>

<style lang="postcss">
.block-add-schedule {

  .vis-standard-popup__content {
    position: relative;
    max-height: 592px !important;
    background: #f7f8fa;
  }

  .vis-standard-popup__buttons {
    margin-bottom: 0;
    margin-bottom: constant(safe-area-inset-bottom) !important;
    margin-bottom: env(safe-area-inset-bottom) !important;
  }

  &__container {
    height: 100%;
    padding-bottom: 10px;

    .form-card {
      margin: 10px;
      border-radius: 6px;
      background: #fff;
    }

    .info {
      position: absolute;
      bottom: 0;
      width: 100%;
      font-size: 13px;
      line-height: 32px;
      color: #ed6a0c;
      text-align: center;
      background: #fffbe8;
    }
  }

  .main-btn {
    color: #fff;
    background: #00b389;
  }

  .no-result {
    margin-top: 80px;
    font-size: 14px;
    line-height: 18px;
    color: #aaabad;
    text-align: center;
  }
}
</style>
