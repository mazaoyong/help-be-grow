
import React, { ReactElement } from 'react';
import { endOfYesterday } from 'date-fns';
import { ITeacherInfo, IStatistics, ITeacherFilter, IShopFucntion } from '../interface';
import { getCurrentMonth, getLastMonth, getLastWeek, getCurrentWeek } from '../time-utils';
import { arrayColumnWrapper, isInStoreCondition } from 'fns/chain';
import ValuntaryAsyncSelect from 'components/valuntary-async-select/ValuntaryAsyncSelect';
import { Link as SamLink } from '@youzan/sam-components';
import { ScheduleNewDialog } from '../../../../new-dialogs';

interface ITeacherData {
  statistics: Partial<IStatistics>;
  teacher: Partial<ITeacherInfo>;
}

export function teacherColumns() : any[] {
  return arrayColumnWrapper([
    {
      title: '老师姓名',
      bodyRender({ teacher = {} }: ITeacherData): ReactElement {
        return <a href={`${window._global.url.v4}/vis/edu/page/teachers#/detail/course?teacherNo=${teacher.resource ? teacher.resource.resourceNo : ''}&targetKdtId=${teacher.resource ? teacher.resource.kdtId : ''}&teacherId=${teacher.resource ? teacher.resource.bizId : ''}`}>{teacher.staffName}</a>;
      },
    },
    {
      title: '联系方式',
      bodyRender({ teacher = {} }: ITeacherData): string {
        return teacher.mobile || '-';
      },
    },
    {
      title: '所属校区',
      chainState: isInStoreCondition({
        supportEduHqStore: true,
      }),
      bodyRender({ teacher = {} }: ITeacherData): string {
        return teacher.shopName || '-';
      },
    },
    {
      title: '上课次数',
      bodyRender({ statistics = {} }: ITeacherData): string {
        return `${statistics.teachClassCount}` || '-';
      },
    },
    {
      title: '实到人次/应到人次',
      bodyRender({ statistics = {} }: ITeacherData): string {
        return `${statistics.actualStudentCount}/${statistics.shouldStudentCount}`;
      },
    },
    {
      title: '学员消耗课时',
      bodyRender({ statistics = {} }: ITeacherData): string {
        if (typeof statistics.consumeAssetNum === 'number') {
          const consumeTime = statistics.consumeAssetNum / 100;
          return consumeTime.toFixed(2);
        }
        return '-';
      },
    },
    {
      title: '试听人次',
      bodyRender({ statistics = {}, teacher = {} }: ITeacherData): ReactElement {
        return <a onClick={() => window.open(`${window._global.url.v4}/vis/edu/page/appointment#/list?teacherName=${teacher.staffName}&courseType=0`)}>{statistics.tryAttendCount}</a>;
      },
    },
    {
      title: '操作',
      textAlign: 'right',
      bodyRender({ teacher = {} }: ITeacherData): ReactElement {
        return <>
          <SamLink name='查看' onClick={() => {
            ScheduleNewDialog.open('新建日程', {
              kdtId: teacher.resource ? teacher.resource.kdtId : '',
              query: {
                teacherNo: teacher.resource ? teacher.resource.resourceNo : -1,
                teacherName: teacher.staffName,
              },
            });
          }}>排课</SamLink>
          <span style={{ color: '#DCDEE0' }}>{` | `}</span>
          <SamLink name='编辑' href={isInStoreCondition({ supportEduChainStore: true }) ? `${window._global.url.v4}/setting/chainstaff#/staff/edit/${teacher.resource ? teacher.resource.bizId : ''}` : `${window._global.url.v4}/setting/staff#/edit/${teacher.resource ? `${teacher.resource.bizId}/TEACHER` : ''}`}>编辑</SamLink>
        </>;
      },
    },
  ]);
};

export const teacherOptions: (props: IShopFucntion) => any[] =
({ onShopSelected, getDefaultEduShopOption, getShopOptions }) => arrayColumnWrapper([
  {
    type: 'Input',
    name: 'keyword',
    label: '老师：',
    props: {
      width: 165,
      placeholder: '老师姓名/联系方式',
    },
  },
  {
    type: 'Custom',
    name: 'kdtId',
    label: '上课校区：',
    chainState: isInStoreCondition({
      supportEduHqStore: true,
    }),
    component: ValuntaryAsyncSelect,
    className: 'valuntary-async-select-option',
    onSearch: (keyword) => {
      return { name: keyword };
    },
    valueChange: onShopSelected,
    format: (data) => Promise.resolve(data.target),
    defaultOption: getDefaultEduShopOption(),
    create: false,
    refresh: false,
    getOptions: getShopOptions,
    placeholder: '全部',
    hideClose: true,
    width: 165,
  },
  {
    type: 'DateRangeQuickPicker',
    name: 'dateRange',
    label: '上课时间：',
    props: {
      max: endOfYesterday(),
      valueType: 'date',
      format: 'YYYY-MM-DD HH:mm',
      preset: [{
        text: '本月',
        value: getCurrentMonth(),
      }, {
        text: '上月',
        value: getLastMonth(),
      }, {
        text: '本周',
        value: getCurrentWeek(),
      }, {
        text: '上周',
        value: getLastWeek(),
      }],
    },
  },
]);

export const defaultTeacherOptions: ITeacherFilter = {
  dateRange: getCurrentMonth(),
  keyword: '',
  kdtId: '',
};
