import { Pop } from '@zent/compat';
import React, { FC, useMemo } from 'react';
import { Button } from 'zent';
import { Select, EasyList } from '@youzan/ebiz-components';
import { IStudyListProps } from '../../types';
import './style.scss';
import { IFilterProps, IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import ExportRecordLink, { EXPORT_RECORD_TYPES } from '@ability-center/ump/export-record';
// import formatDate from '@youzan/utils/date/formatDate';

const { List, EasyGrid, Filter } = EasyList;

const StudyDetailListFC: FC<IStudyListProps> = (props) => {
  const { onFetch, onExport, selectFetchOption, courseId, courseType, onSelect, onReset } = props;

  const listConfig = useMemo<IFilterProps['config']>(() => {
    return [
      {
        name: 'name',
        label: '客户：',
        type: 'Custom',
        renderField: Select,
        defaultValue: [],
        inheritProps: {
          className: '',
          filter: true,
          width: '260px',
          mode: 'async',
          onSelect,
          fetchOnOpened: true,
          fetchOptions: selectFetchOption,
        },
      },
    ];
  }, [selectFetchOption]);

  const listColumns = useMemo<IEasyGridColumn<any>[]>(
    () => [
      {
        title: '客户名称',
        name: 'userName',
        width: '168px',
        bodyRender({ userName, userId }) {
          return (
            <Pop trigger="hover" className="study-record__pop" content={userName}>
              <a
                className="study-record__username"
                href={`${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${userId}`}
              >
                {userName}
              </a>
            </Pop>
          );
        },
      },
      {
        title: '学习次数',
        name: 'learnNumber',
      },
      {
        title: '学习时长(分钟)',
        name: 'learnDuration',
        bodyRender({ learnDuration = 0 }) {
          return (learnDuration / 60).toFixed(2);
        },
      },
      {
        title: '首次学习时间',
        name: 'firstLearnTime',
        bodyRender({ firstLearnTime }) {
          return firstLearnTime || '-';
        },
      },
      {
        title: '最近学习时间',
        name: 'lastLearnTime',
        bodyRender({ lastLearnTime }) {
          return lastLearnTime || '-';
        },
        hide: +courseType === 2,
      },
      {
        title: '首次完课时间',
        name: 'firstFinishTime',
        bodyRender({ firstFinishTime }) {
          return firstFinishTime || '-';
        },
        hide: +courseType === 1,
      },
      {
        title: '完成课程数',
        name: 'finishCourseCount',
        bodyRender({ finishCourseCount = 0, userName, userId, courseAlias }) {
          return (
            <a
              href={`${_global.url.v4}/vis/course/column/detail?courseAlias=${courseAlias}&userId=${userId}&courseId=${courseId}&userName=${userName}`}
            >
              {finishCourseCount}
            </a>
          );
        },
        hide: +courseType === 2, // 内容隐藏, 专栏显示
      },
      {
        title: '学习进度',
        name: 'learnProgress',
        bodyRender({ learnProgress = 0 }) {
          return `${learnProgress}%`;
        },
      },
    ],
    [courseId, courseType],
  );

  return (
    <List mode="none" defaultFilter={{ pageSize: 20 }} onSubmit={onFetch}>
      <Filter
        config={listConfig}
        onReset={onReset}
        actionsOption={{
          beforeReset: (
            <>
              <Button onClick={onExport} className="study-record__export">
                导出
              </Button>
              <ExportRecordLink
                target="_blank"
                rel="noopener noreferrer"
                exportType={EXPORT_RECORD_TYPES.COLUMN_STUDY_RECORD}
              >
                查看已导出的列表
              </ExportRecordLink>
            </>
          ),
        }}
      />
      <EasyGrid paginationType={'lite'} columns={listColumns.filter((item) => !item['hide'])} />
    </List>
  );
};

export default StudyDetailListFC;
