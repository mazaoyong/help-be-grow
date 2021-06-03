import React, { FC, useCallback, useState, useMemo, ReactNode } from 'react';
import { EasyList } from '@youzan/ebiz-components';
import { IEasyGridColumn, IFormatData } from '@youzan/ebiz-components/es/types/easy-list';
import { format } from 'date-fns';
import { findLittlePage } from './api';
import { ICourseListProps } from './types';

const { EasyGrid, List } = EasyList;
const CourseList: FC<ICourseListProps> = (props) => {
  const { isbatch, ...restProps } = props;
  const [ pageShow, setPageShow ] = useState<boolean>(false);

  const onFetch = useCallback<(params: any) => Promise<IFormatData>>((params) => {
    const { pageSize = 5, sortBy = 'created_at', sortType, page = 1 } = params;
    return findLittlePage({ pageRequest: {
      pageNumber: page,
      pageSize,
      sort: { orders: [{ direction: (sortType || 'DESC').toLocaleUpperCase(), property: sortBy }] },
    },
    query: restProps }).then((resp) => {
      const { content = [], pageable = {}, total = 0 } = resp || {};
      if (total > pageSize && !pageShow) {
        setPageShow(true);
      } else if (total <= pageSize && pageShow) {
        setPageShow(false);
      }
      return {
        dataset: content,
        pageInfo: {
          page: pageable.pageNumber || 1,
          pageSize: pageSize,
          total: total,
        },
      };
    });
  }, []);

  const listColumns = useMemo<IEasyGridColumn[]>(() => {
    let tempColumns: IEasyGridColumn[] = [...columns];
    if (!isbatch) {
      tempColumns = tempColumns.filter((item) => item.name !== 'studentName');
    }
    return tempColumns;
  }, [isbatch]);

  return <List mode='none' defaultFilter={{ pageSize: 5 }} onSubmit={onFetch}>
    <EasyGrid
      pageable={pageShow}
      paginationType={'lite'}
      columns={listColumns}
    />
  </List>;
};

const wrapText : (text: string) => ReactNode = (text = '') => {
  if (text.length <= 10) {
    return <p>{text}</p>;
  } else {
    const firstP = text.slice(0, 10);
    const secondP = text.slice(10);
    return <>
      <p>{firstP}</p>
      <p>{secondP.length > 10 ? `${secondP.slice(0, 8)}..` : secondP}</p>
    </>;
  }
};

const columns: IEasyGridColumn[] = [
  {
    title: '上课日期',
    name: 'start_time',
    bodyRender({ startTime, endTime }) {
      return (<>
        <p>{startTime ? format(startTime, 'YYYY-MM-DD') : '-'}</p>
        <p>{`${startTime ? format(startTime, 'HH:mm') : ''} - ${endTime ? format(endTime, 'HH:mm') : ''}`}</p>
      </>);
    },
    needSort: true,
  },
  {
    title: '学员',
    name: 'studentName',
    bodyRender({ studentName = '', studentId }) {
      return <a href={`https://www.youzan.com/v4/vis/edu/page/student#/detail/${studentId}`} target="_blank" rel="noopener noreferrer">{studentName}</a>; // 这里考虑复用组件抽离入组件库，没有用_global.url.v4
    },
  },
  {
    title: '课节名称',
    bodyRender({ lessonName = '', lessonNo, kdtId }) {
      return <a href={`https://www.youzan.com/v4/vis/edu/page/schedule#/detail?lessonNo=${lessonNo}&kdtId=${kdtId}`} target="_blank" rel="noopener noreferrer">{wrapText(lessonName)}</a>; // 这里考虑复用组件抽离入组件库，没有用_global.url.v4
    },
  },
  {
    title: '教室',
    bodyRender({ classroomName }) {
      return wrapText(classroomName || '-');
    },
  },
  {
    title: '老师',
    bodyRender({ teacherName }) {
      return teacherName || '-';
    },
  },
  {
    title: '冻结课时',
    textAlign: 'right',
    bodyRender({ lockNum = 0 }) {
      return !lockNum ? '-' : lockNum / 100;
    },
  },
];

export default CourseList;
