import { isInStoreCondition } from 'fns/chain';
import { chunk } from 'lodash';
import { StudentFilterSelector, selectAllStudent } from '@ability-center/student';
import { CourseFilterSelector, selectAllCourse } from '@ability-center/course';
import {
  EduClassFilterSelector,
  TeacherFilterSelector,
  selectAllEduClass,
  selectAllTeacher,
} from '@ability-center/edu-course';
import { ShopChoose } from '@ability-center/shop/shop-choose';

import type {
  ICombinedFilterConf,
  FilterConfigType,
} from '@youzan/ebiz-components/es/types/easy-list';
import type { IUseSigninListModelRes } from './types';

const _defaultKdtId = _global.kdtId;
function watchKdtId(value: any, ctx: any) {
  ctx.set({ targetKdtId: value || _defaultKdtId });
}
function watchKdtIdAndRestVal(resetVal: any) {
  return function(value: any, ctx: any) {
    ctx.set({
      value: resetVal,
      targetKdtId: value || _defaultKdtId,
    });
  };
}

export const getFilterConfig = (): IUseSigninListModelRes['filterConfig'] => {
  // 连锁逻辑
  const chainSupportOnlyHq = isInStoreCondition({
    supportHqStore: true,
  });
  // 单店逻辑
  const chainSupportOnlySingle = isInStoreCondition({
    supportSingleStore: true,
  });
  // prettier-ignore
  const courseConsumePosName = /** 如果是教育单店 */ chainSupportOnlySingle
    ? 'addressId'
    : /** 如果是连锁总部 */ chainSupportOnlyHq
      ? 'kdtId'
      : null;
  const courseConsumePosFilterItem: ICombinedFilterConf | null = courseConsumePosName
    ? {
      type: 'Custom',
      name: courseConsumePosName,
      label: chainSupportOnlySingle ? '上课地点：' : '上课校区：',
      renderField: ShopChoose,
      inheritProps: {
        create: false,
        refresh: false,
        placeholder: '全部',
      },
    }
    : null;
  const filterItems = ([
    {
      /** 2020-12-04 studentId -> userId */
      name: 'userId',
      label: '学员姓名：',
      type: 'Custom',
      renderField: StudentFilterSelector,
      defaultValue: 'all',
      inheritProps: {
        targetKey: 'userId',
        defaultOptions: [selectAllStudent],
      },
      watch: { kdtId: watchKdtId },
    },
    {
      /** 2020-12-04 courseId -> eduCourseId */
      name: 'eduCourseId',
      label: '课程名称：',
      type: 'Custom',
      renderField: CourseFilterSelector,
      defaultValue: 'all',
      inheritProps: {
        defaultOptions: [selectAllCourse],
      },
      watch: { kdtId: watchKdtIdAndRestVal('all') },
    },
    {
      name: 'lessonName',
      label: '课节内容：',
      type: 'Input',
      inheritProps: {
        placeholder: '',
      },
    },
    courseConsumePosFilterItem,
    {
      name: 'classId',
      label: '上课班级：',
      type: 'Custom',
      renderField: EduClassFilterSelector,
      defaultValue: 'all',
      inheritProps: {
        defaultOptions: [selectAllEduClass],
      },
      watch: { kdtId: watchKdtIdAndRestVal('all') },
    },
    {
      name: 'teacherId',
      label: '上课老师：',
      type: 'Custom',
      renderField: TeacherFilterSelector,
      defaultValue: 'all',
      inheritProps: {
        defaultOptions: [selectAllTeacher],
      },
      watch: { kdtId: watchKdtIdAndRestVal('all') },
    },
    {
      type: 'Select',
      name: 'signInStatus',
      label: '签到状态：',
      defaultValue: 'all',
      options: [
        {
          value: 'all',
          text: '全部',
        },
        {
          value: '0',
          text: '已签到',
        },
        {
          value: '1',
          text: '请假',
        },
        {
          value: '2',
          text: '未到',
        },
      ],
    },
  ] as FilterConfigType).filter((item) => item !== null);

  return chunk(filterItems, 3) as FilterConfigType;
};
