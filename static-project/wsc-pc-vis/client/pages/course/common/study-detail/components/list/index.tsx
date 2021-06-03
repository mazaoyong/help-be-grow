import React, { FC } from 'react';
import { EasyList } from '@youzan/ebiz-components';
import { IStudyDetailListProps } from '../../types';
import { IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';

const { List, EasyGrid } = EasyList;

const StudyDetailListFC: FC<IStudyDetailListProps> = (props) => {
  const { onFetch } = props;

  const listColumns: IEasyGridColumn<any>[] = [
    {
      title: '课程名称',
      name: 'courseName',
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
      }
    },
    {
      title: '首次学习时间',
      name: 'firstLearnTime',
      bodyRender({ firstLearnTime }) {
        return firstLearnTime || '-';
      }
    },
    {
      title: '首次完课时间',
      name: 'firstFinishTime',
      bodyRender({ firstFinishTime }) {
        return firstFinishTime || '-';
      }
    },
    {
      title: '学习进度',
      name: 'learnProgress',
      bodyRender({ learnProgress = 0 }) {
        return `${learnProgress}%`;
      },
    }
  ];

  return <List mode='none' defaultFilter={{ pageSize: 20 }} onSubmit={onFetch}>
    <EasyGrid
      // pageable={pageShow}
      paginationType={'lite'}
      columns={listColumns}
    />
  </List>;
};

export default StudyDetailListFC;
