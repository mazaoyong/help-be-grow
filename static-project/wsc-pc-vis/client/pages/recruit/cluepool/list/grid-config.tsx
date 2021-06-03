import { Pop } from '@zent/compat';
import React from 'react';
import { Tag, ITagProps, ClampLines } from 'zent';
import formatDate from 'zan-utils/date/formatDate';
import type { IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import { arrayColumnWrapper } from 'fns/chain';
import {
  isEduHqStore, // 是否是教育总店
} from '@youzan/utils-shop';

import { IPartialFindAllResponse } from '../api/list';
import { CluePageType } from './utils/use-fetch-list';

type ResponseRowDataAssert<U extends CluePageType> = U extends 'pool'
  ? IPartialFindAllResponse
  : IPartialFindAllResponse;

interface ILearnStatusInfoType {
  status: number;
  title: string;
  theme?: ITagProps['theme'];
}
const learnStatusInfo: ILearnStatusInfoType[] = [
  {
    status: 1,
    title: '在读',
    theme: 'green',
  },
  {
    status: 2,
    title: '结业',
    theme: 'grey',
  },
  {
    status: 3,
    title: '试听',
    theme: 'yellow',
  },
  {
    status: 4,
    title: '',
  },
];

const showStatus = (learnStatus) => {
  if (learnStatus === 0) return null;
  const statusInfo = learnStatusInfo.find((item) => item.status === learnStatus);
  if (!statusInfo) return null;
  const { title, theme } = statusInfo;
  if (!title) return null;
  return (
    <Tag theme={theme} outline>
      {title}
    </Tag>
  );
};

const defaultPhaseOptions = [
  {
    value: 0,
    text: '全部',
  },
  {
    value: 1,
    text: '待分配',
  },
  {
    value: 2,
    text: '待跟进',
  },
  {
    value: 3,
    text: '待邀约',
  },
  {
    value: 4,
    text: '待试听',
  },
  {
    value: 5,
    text: '已试听',
  },
  {
    value: 6,
    text: '已成交',
  },
  {
    value: 7,
    text: '已放弃',
  },
  {
    value: 8,
    text: '已删除',
  },
];

// 基础配置项
const prefixBaseConfig = (pageType: CluePageType) =>
  arrayColumnWrapper<IEasyGridColumn<ResponseRowDataAssert<typeof pageType>>>([
    {
      title: '姓名',
      fixed: 'left',
      width: '152px',
      forbidCustom: true,
      bodyRender: (row) => (
        <>
          <a
            className="cursor-link clue-name"
            href={`#/detail/${row.clueId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.name || '-'}
          </a>
          <br />
          <a
            className="cursor-link clue-name"
            href={`#/detail/${row.clueId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.telephone} {showStatus(row.learnStatus)}
          </a>
        </>
      ),
    },
    {
      title: '阶段',
      width: '80px',
      name: 'phase',
      forbidCustom: true,
      bodyRender: (row) => defaultPhaseOptions[row.phase].text,
    },
    {
      title: '来源',
      chainState: !isEduHqStore,
      bodyRender: (row) => row.source
        ? <ClampLines lines={2} popWidth={200} text={[row.source.groupName, row.source.name].join('-')} />
        : '-',
    },
    {
      title: '来源',
      width: '200px',
      chainState: isEduHqStore,
      bodyRender: (row) => row.source
        ? <ClampLines lines={2} popWidth={200} text={[row.source.groupName, row.source.name].join('-')} />
        : '-',
    },
    {
      title: '标签',
      width: '160px',
      bodyRender: (row) => {
        const { tags = [] } = row;
        const mapTagToEl = (tag, index) => (
          <Tag key={index} className="edu-clue-pool-tag" outline theme="blue">
            {tag.name}
          </Tag>
        );
        if (tags.length === 0) {
          return '-';
        }
        if (tags.length < 3) {
          return tags.map(mapTagToEl);
        }
        return (
          <Pop
            trigger="hover"
            position="bottom-right"
            content={
              <div className="edu-clue-pool-tag-tail">
                {tags.map((tail, index) => (
                  <div key={index}>{tail.name}</div>
                ))}
              </div>
            }
          >
            <div>
              {tags.slice(0, 2).map(mapTagToEl)}
              <span className="edu-clue-pool-tag-etc">···</span>
            </div>
          </Pop>
        );
      },
    },
    {
      title: '回访时间',
      width: '120px',
      name: 'revisitTime',
      needSort: true,
      bodyRender: (row) =>
        row.revisitTime ? formatDate(row.revisitTime, 'YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '试听时间',
      width: '120px',
      name: 'lastArrangedAt',
      needSort: true,
      bodyRender: (row) =>
        row.lastArrangedAt ? formatDate(row.lastArrangedAt, 'YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: '创建时间',
      width: '120px',
      name: 'createdAt',
      needSort: true,
      bodyRender: (row) => formatDate(row.createdAt, 'YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '所属校区',
      width: '120px',
      chainState: isEduHqStore,
      name: 'ownerSchoolName',
    },
  ]);
const suffixBaseConfig = (pageType: CluePageType) =>
  arrayColumnWrapper<IEasyGridColumn<ResponseRowDataAssert<typeof pageType>>>([
    {
      title: '最近动态',
      width: '200px',
      needSort: true,
      textAlign: 'right',
      name: 'recordUpdatedAt',
      bodyRender: (row) => {
        return (
          <>
            <div>{formatDate(row.recordUpdatedAt, 'YYYY-MM-DD HH:mm:ss')}</div>
            <div>{row.recordDesc}</div>
          </>
        );
      },
    },
  ]);

const allColumns = (pageType: CluePageType) =>
  prefixBaseConfig(pageType).concat(
    [
      {
        title: '课程顾问',
        chainState: !isEduHqStore,
        bodyRender: (row) => (row.owners && row.owners[0] && row.owners[0].name) || '-',
      },
    ] as unknown as IEasyGridColumn<ResponseRowDataAssert<typeof pageType>>,
    suffixBaseConfig(pageType),
  );

const columns = (pageType: CluePageType) =>
  prefixBaseConfig(pageType).concat(suffixBaseConfig(pageType));

const getGridColumns = (pageType: CluePageType) => {
  return pageType === 'all' ? allColumns(pageType) : columns(pageType);
};
export default getGridColumns;
