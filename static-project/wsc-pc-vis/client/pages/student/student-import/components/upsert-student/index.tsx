import { DatePicker, DateRangePicker } from '@zent/compat';
import React, { FC, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Button,
  FormInputField,
  FormNumberInputField,
  Notify,
  BlockLoading,
  Validators,
  ValidateOption,
} from 'zent';
import FormSelectField from 'components/zent-legacy/form/field/FormSelectField';
import { ZentForm } from 'zent/es/form/ZentForm';
import { IOption, IPageRequest } from '@youzan/ebiz-components/es/types/select';
import { isEduChainStore, isEduHqStore, isEduSingleStore, isEduBranchStore } from '@youzan/utils-shop';
import { EasyFormArchive, Select } from '@youzan/ebiz-components';
import date from '@youzan/utils/date';
import get from 'lodash/get';

import Period from '../period';
import { saveRowData, getRowData } from './requests';
import { getCourseList, getClassList, getSingleShopStaffList, getChainStaffList } from '../../api/confirm';
import { parseRowFields } from '../../utils/parse-row-fields';
import { upsertStudentDefaultValue, IMPORT_TYPE, gridNumberFields } from '../../constants';

import { IUpsertStudentProps, IUpsertStudentForm } from '../../types';
import './styles.scss';

const { EasyForm } = EasyFormArchive;

const { parseDate, compare, travel } = date;

const VALIDATE_OPTION = ValidateOption.IncludeUntouched | ValidateOption.IncludeChildrenRecursively;

const UpsertStudent: FC<IUpsertStudentProps> = props => {
  const { importType, onClose, onSave, rowId, taskId = 0, branchKdtId = 0 } = props;
  const ref = useRef<ZentForm<any>>();

  const [loading, toggleLoading] = useState(false);
  const [data, setData] = useState<IUpsertStudentForm | object>({});
  const [submitLoading, toggleSubmitLoading] = useState(false);

  useEffect(() => {
    if (rowId) {
      toggleLoading(true);

      getRowData({
        taskId,
        rowId,
      })
        .then(res => {
          if (res && res.rowFieldMap) {
            const formData = parseRowFields(res.rowFieldMap);

            let formObj = {};
            for (let key in formData) {
              formObj[formData[key].name] = formData[key].value;
            }
            setData(formObj);
            const newFormObj = {
              ...formObj,
              courseCounselor: [get(formObj, 'courseCounselorId') || ''], // 课程顾问的value要取后端传来的id，且要转化为数字
            };
            ref.current && ref.current.patchValue(newFormObj);
            ref.current && ref.current.ctx.form.validate(VALIDATE_OPTION);
          }
        })
        .catch(e => {
          Notify.error(e || '获取表单数据失败');
          setData(upsertStudentDefaultValue);
        })
        .finally(() => {
          toggleLoading(false);
        });
    }
  }, [rowId, taskId]);

  const fetchStaffOptions = (query: string, pageRequest: IPageRequest):
  Promise<{ options: IOption[]; pageInfo: IPageRequest; }> => {
    const getStaffList = isEduChainStore ? getChainStaffList : getSingleShopStaffList;

    const request = isEduHqStore
      ? {
        keyword: query,
        targetKdtId: branchKdtId || _global.kdtId,
        pageNo: pageRequest.current
      }
      : {
        keyword: query,
        pageNo: pageRequest.current
      };

    return getStaffList(request).then(data => {
      const { items = [], paginator = {} } = data;

      const options = items.map(item => ({ text: item.name, value: String(item.adminId) }));
      const pageInfo = {
        current: paginator.page || 1,
        total: paginator.totalCount,
      };
      return {
        options,
        pageInfo,
      };
    });
  };

  const fetchCourseOptions = useCallback(
    (
      name: string,
      pageRequest: IPageRequest,
    ): Promise<{ options: IOption[]; pageInfo: IPageRequest }> => {
      return getCourseList({
        kdtId: branchKdtId || _global.kdtId,
        name,
        isTrial: 0,
        pageSize: pageRequest.pageSize || 20,
        pageNumber: pageRequest.current || 1,
      }).then(data => {
        const { content = [], pageable, total } = data;
        const options = content.map(course => ({
          text: course.name,
          value: course.name,
        }));

        if (pageable.pageNumber === 1) {
          options.unshift({
            text: '0（通用课时包）',
            value: '0',
          });
        }

        return {
          options,
          pageInfo: {
            current: pageable.pageNumber || 1,
            total: total || 0,
          },
        };
      });
    },
    [branchKdtId],
  );

  const fetchClassOptions = useCallback((query: string, pageRequest) => {
    const eduClassNameQuery = {
      className: query,
      kdtId: branchKdtId || _global.kdtId,
    };

    return getClassList({
      eduClassNameQuery,
      pageRequest: {
        pageNumber: pageRequest.current,
        pageSize: pageRequest.pageSize,
      },
    }).then(({ content = [], total, pageable }) => {
      const options = content.map(klass => ({
        text: get(klass, 'eduClassName'),
        value: get(klass, 'eduClassName'),
      }));

      return {
        options,
        pageInfo: {
          current: pageable.pageNumber || 1,
          total: total || 0,
        },
      };
    });
  }, [branchKdtId]);

  const fields = useMemo(
    () => [
      {
        name: 'studentName',
        label: '学员姓名：',
        type: 'field',
        required: true,
        component: FormInputField,
        props() {
          return {
            props: {
              placeholder: '20字以内',
            },
          };
        },
        validators: [Validators.required('请输入学员姓名'), Validators.maxLength(20, '最多20个字')],
      },
      {
        name: 'mobile',
        label: '家长/学员手机号：',
        type: 'field',
        required: true,
        component: FormInputField,
        props() {
          return {
            props: {
              placeholder: '请输入',
            },
          };
        },
        validators: [
          Validators.required('请输入家长/学员手机号'),
          Validators.pattern(/^1\d{10}$/, '请输入正确的手机号'),
        ],
      },
      {
        name: 'className',
        importType: 'class',
        label: '班级：',
        required: true,
        component: Select,
        props() {
          const defaultValue = get(data, 'className[0]'); // select默认为数组格式
          return {
            placeholder: '请选择',
            filter: true,
            mode: 'async',
            fetchOnMounted: true,
            fetchOptions: fetchClassOptions,
            showAdd: true,
            showRefresh: true,
            onAdd: () => {
              window.open(`//www.youzan.com/v4/vis/edu/page/educlass#/list`, '_blank');
            },
            defaultOptions: defaultValue
              ? [{
                text: defaultValue,
                value: defaultValue,
              }]
              : [],
          };
        },
        validators: [Validators.required('请选择班级')],
      },
      {
        name: 'courseName',
        importType: 'course',
        label: '课程：',
        required: true,
        component: Select,
        props() {
          const defaultValue = get(data, 'courseName[0]'); // select默认为数组格式
          return {
            placeholder: '请选择',
            filter: true,
            mode: 'async',
            fetchOnMounted: true,
            fetchOptions: fetchCourseOptions,
            showAdd: !isEduBranchStore,
            showRefresh: !isEduBranchStore,
            onAdd: () => {
              window.open(`//www.youzan.com/v4/vis/edu/page/educourse#/add`, '_blank');
            },
            defaultOptions: defaultValue
              ? [{
                text: defaultValue === '0' ? '0（通用课时包）' : get(data, 'courseName'),
                value: defaultValue,
              }]
              : [],
          };
        },
        validators: [Validators.required('请选择课程')],
      },
      {
        name: 'courseRealPay',
        label: '实付金额：',
        type: 'field',
        required: true,
        component: FormNumberInputField,
        props() {
          return {
            props: {
              addonBefore: '￥',
              min: 0,
              decimal: 2,
            },
          };
        },
        validators: [
          Validators.required('请输入实付金额')
        ],
      },
      {
        name: 'payTool',
        label: '付款方式：',
        type: 'field',
        required: true,
        component: FormSelectField,
        props() {
          return {
            props: {
              width: '185px',
              data: [
                { value: '现金支付', text: '现金支付' },
                { value: '标记付款-自有支付宝', text: '标记付款-自有支付宝' },
                { value: '标记付款-自有微信支付', text: '标记付款-自有微信支付' },
                { value: '标记付款-自有pos刷卡', text: '标记付款-自有POS刷卡' },
              ],
            },
          };
        },
        validators: [Validators.required('请选择付款方式')],
      },
      {
        name: 'enrollTime',
        label: '报名日期：',
        required: true,
        component: DatePicker,
        validators: [
          Validators.required('请选择报名时间'),
          (value: string) => {
            if (!value) {
              return {
                name: 'empty-date',
                message: '请选择报名时间',
              };
            }
            if (value < '1970-01-01') {
              return {
                name: 'invalid-date',
                message: '日期不能早于1970-01-01',
              };
            }
            return null;
          },
        ],
      },
      {
        name: 'period',
        importType: 'course',
        label: '课时：',
        className: 'period-field',
        component: Period,
        helpDesc: '课时和有效期必须至少填写一项',
        defaultValue: ['', ''],
        validators: [
          (value, ctx) => {
            const { validDate } = ctx.getSectionValue();
            const emptyPeriod = !value || (!value[0] && !value[1]);
            const emptyValidDate = !validDate || (!validDate[0] && !validDate[1]); // 有效期为空

            if (validDate && validDate[0] && validDate[1] && emptyPeriod) {
              return null;
            }
            if (emptyPeriod && emptyValidDate) {
              return {
                name: 'empty-period-and-validDate',
                message: '课时和有效期必须至少填写一项',
              };
            }
            if (value && Number(value[1]) <= 0) {
              return {
                name: 'zero-period',
                message: '购买课时需大于0',
              };
            }
            if (value && Number(value[0]) < 0) {
              return {
                name: 'zero-period',
                message: '剩余课时需大于等于0',
              };
            }
            if (value && !value[1] && value[0]) {
              return {
                name: 'empty-period-start',
                message: '请输入购买课时',
              };
            }
            if (value && !value[0] && value[1]) {
              return {
                name: 'empty-period-end',
                message: '请输入剩余课时',
              };
            }
            if (value && Number(value[1]) < Number(value[0])) {
              return {
                name: 'remaining-period-should-be-greater-than-purchased',
                message: '剩余课时需少于等于购买课时',
              };
            }
            return null;
          },
        ],
        watch: [
          {
            dep: 'validDate',
            fn: (_, form) => {
              if (form.model.children.validDate && form.model.children.period) {
                if (form.model.children.validDate.isTouched) {
                  form.model.children.period.isTouched = true;
                }
                form.model.children.period.validate();
              }
            },
          },
        ],
      },
      {
        name: 'validDate',
        importType: 'course',
        label: '有效期：',
        className: 'validDate-field',
        component: DateRangePicker,
        helpDesc: '课时和有效期必须至少填写一项',
        defaultValue: ['', ''],
        props() {
          return {
            props: {
              type: 'split',
            },
          };
        },
        validators: [
          (value, ctx) => {
            const { period } = ctx.getSectionValue();
            const [startDate = '', endDate = ''] = value;

            const emptyValidDate = !value || (!startDate && !endDate); // 有效期为空
            const emptyPeriod = !period || (!period[0] && !period[1]); // 课时为空

            if (emptyValidDate && emptyPeriod) {
              return {
                name: 'empty-validDate-and-period',
                message: '课时和有效期必须至少填写一项',
              };
            }
            if (!emptyValidDate && startDate && !endDate) {
              return {
                name: 'empty-validDate-end',
                message: '请选择结束日期',
              };
            }
            if (!emptyValidDate && endDate && !startDate) {
              return {
                name: 'empty-validDate-start',
                message: '请选择开始日期',
              };
            }
            if (!emptyValidDate && startDate > endDate) {
              return {
                name: 'greater-endDate',
                message: '结束时间不能早于开始时间',
              };
            }
            if (!emptyValidDate && (startDate < '1970-01-01' || endDate < '1970-01-01')) {
              return {
                name: 'invalid-date',
                message: '日期不能早于1970-01-01',
              };
            }
            if (!emptyValidDate && !compare([travel(1, parseDate(startDate, 'YYYY-MM-DD')), parseDate(endDate, 'YYYY-MM-DD')], 999, 'year')) {
              return {
                name: 'invalid-validDate',
                message: '有效期不能超过999年',
              };
            }
            return null;
          },
        ],
        watch: [
          {
            dep: 'period',
            fn: (_, form) => {
              if (form.model.children.period && form.model.children.validDate) {
                if (form.model.children.period.isTouched) {
                  form.model.children.validDate.isTouched = true;
                }
                form.model.children.validDate.validate();
              }
            },
          },
        ],
      },
      {
        name: 'courseCounselor',
        label: '课程顾问：',
        component: Select,
        props() {
          const defaultText = get(data, 'courseCounselor[0]'); // select默认为数组格式
          const defaultValue = get(data, 'courseCounselorId');
          return {
            placeholder: '请选择',
            filter: true,
            mode: 'async',
            fetchOnMounted: true,
            fetchOptions: fetchStaffOptions,
            showAdd: true,
            showRefresh: true,
            onAdd: () => {
              isEduSingleStore
                ? window.open(`//www.youzan.com/v4/setting/staff#/create`, '_blank')
                : window.open(`//www.youzan.com/v4/setting/chainstaff#/staff/add`, '_blank');
            },
            defaultOptions: defaultValue && defaultText
              ? [{
                text: defaultText,
                value: defaultValue,
              }]
              : [],
          };
        },
      },
    ],
    [data, fetchClassOptions, fetchCourseOptions, fetchStaffOptions],
  );

  const config = useMemo(
    () =>
      importType === IMPORT_TYPE.byCourse
        ? fields.filter(field => field.importType !== 'class')
        : fields.filter(field => field.importType !== 'course'),
    [importType, fields],
  );

  const onSubmit = ctx => {
    const values = ctx.getValue();

    toggleSubmitLoading(true);

    gridNumberFields.map(fieldName => {
      if (Array.isArray(values[fieldName])) {
        const field = values[fieldName].map(subField => {
          return parseInt(subField) === Number(subField) ? String(parseInt(subField)) : subField;
        });
        values[fieldName] = field;
      } else {
        values[fieldName] =
          parseInt(values[fieldName]) === Number(values[fieldName])
            ? String(parseInt(values[fieldName]))
            : values[fieldName];
      }
    });

    saveRowData({
      fields: values,
      taskId,
      rowId,
    })
      .then(res => {
        if (res === true) {
          return new Promise((resolve) => setTimeout(() => {
            toggleSubmitLoading(false);
            onSave();
            Notify.success('保存成功');
            resolve(void 0);
          }, 1000)); // 新建、修改的保存等待后端校验数据1秒
        }
      })
      .catch(e => {
        toggleSubmitLoading(false);
        Notify.error(e || '网络错误，请稍后重试');
      });
  };

  return (
    <div className="upsert-student-dialog">
      <BlockLoading loading={loading}>
        <EasyForm
          layout="horizontal"
          ref={form => {
            ref.current = form;
          }}
          config={config}
          onSubmit={onSubmit}
        >
          <div className="upsert-student-dialog-footer">
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              保存
            </Button>
          </div>
        </EasyForm>
      </BlockLoading>
    </div>
  );
};

export default UpsertStudent;
