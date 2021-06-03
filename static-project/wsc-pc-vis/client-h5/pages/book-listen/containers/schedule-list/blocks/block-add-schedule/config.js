import { TYPE_ENUMS } from '@youzan/vis-ui/es/dynamic-form';
import { isEduSingleStore, isEduHqStore } from '@youzan/utils-shop';
import { versionWrapper } from '@/vis-shared/configs/version/fns';

export const fixedFields = [
  {
    name: 'name',
    label: '课节名称',
    type: TYPE_ENUMS.TEXT,
    placeholder: '最多输入20字',
    required: true,
    maxLength: '20',
  },
  {
    name: 'date',
    label: '开课日期',
    type: TYPE_ENUMS.DATE,
    placeholder: '请选择开课日期',
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      } else if (type === 'day') {
        return `${val}日`;
      }
      return val;
    },
    required: true,
  },
  {
    name: 'timerange',
    label: '上课时间',
    type: TYPE_ENUMS.TIME_RANGE,
    placeholder: ['请选择上课开始时间', '请选择上课结束时间'],
    required: true,
  },
  {
    name: 'maxAppointNum',
    label: '上课人数',
    type: TYPE_ENUMS.DIGIT,
    placeholder: '用于限制本节课人数',
    required: true,
    maxLength: '5',
  },
];

const _customFields = [
  {
    name: 'teacherNo',
    label: '老师',
    placeholder: '请选择老师',
  },
  {
    name: 'assistantNos',
    label: '助教',
    placeholder: '请选择助教',
  },
  {
    name: 'classroomNo',
    label: '教室',
    placeholder: '请选择教室',
  },
];

if (isEduSingleStore) {
  _customFields.unshift({
    name: 'addressId',
    label: '上课地点',
    placeholder: '请选择上课地点',
  });
}
if (isEduHqStore) {
  _customFields.unshift({
    name: 'kdtId',
    label: '上课校区',
    placeholder: '请选择上课校区（必填）',
    required: true,
    errorMessage: '请选择上课校区',
  });
}

export const customFields = versionWrapper('scheduleFormFields', _customFields);
