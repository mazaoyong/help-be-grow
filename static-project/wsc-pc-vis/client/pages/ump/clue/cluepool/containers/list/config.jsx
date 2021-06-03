import { Pop } from '@zent/compat';
import React from 'react';
import { Tag } from 'zent';
import formatDate from 'zan-utils/date/formatDate';
import { arrayColumnWrapper } from 'fns/chain';

import {
  isEduHqStore, // 是否是教育总店
} from '@youzan/utils-shop';

const pathRegEx = /\/([0-9a-zA-Z]*)#/.exec(window.location.href);
const path = (pathRegEx && pathRegEx[1]) || '';

export const defaultValue = {
  tags: [],
  phase: 0,
  other: {
    type: 'recordDateRange',
    dateRange: [],
  },
};

export const allPhaseOptions = [
  {
    value: 0,
    text: '全部',
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
    value: 6,
    text: '已成交',
  },
];

export const poolPhaseOptions = [
  {
    value: 0,
    text: '全部',
  },
  {
    value: 1,
    text: '待分配',
  },
  {
    value: 7,
    text: '已放弃',
  },
];

export const minePhaseOptions = [
  {
    value: 0,
    text: '全部',
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
    value: 6,
    text: '已成交',
  },
];

export const defaultPhaseOptions = [
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

export const allColumns = arrayColumnWrapper([
  {
    title: '姓名',
    fixed: 'left',
    width: '100px',
    bodyRender: row => (
      <a href={`#/detail/${row.clueId}`} target="_blank" rel="noopener noreferrer">
        {row.name || '-'}
      </a>
    ),
  },
  {
    title: '手机号',
    width: '100px',
    bodyRender: row => (
      <a href={`#/detail/${row.clueId}`} target="_blank" rel="noopener noreferrer">
        {row.telephone}
      </a>
    ),
  },
  {
    title: '创建时间',
    width: '125px',
    name: 'createdAt',
    needSort: true,
    bodyRender: row => formatDate(row.createdAt, 'YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '阶段',
    width: '100px',
    name: 'phase',
    bodyRender: row => defaultPhaseOptions[row.phase].text,
  },
  {
    title: '来源',
    chainState: !isEduHqStore,
    bodyRender: row => (row.source && [row.source.groupName, row.source.name].join('-')) || '-',
  },
  {
    title: '来源',
    chainState: isEduHqStore,
    bodyRender: row => (row.source && [row.source.groupName, row.source.name].join('-')) || '-',
  },
  {
    title: '所属校区',
    chainState: isEduHqStore,
    name: 'ownerSchoolName',
  },
  {
    title: '跟进人',
    width: '100px',
    chainState: !isEduHqStore,
    bodyRender: row => (row.owners && row.owners[0] && row.owners[0].name) || '-',
  },
  {
    title: '标签',
    width: '60px',
    bodyRender: row => {
      const tags = [].concat(row.tags || []);
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
      const tails = tags.splice(2);
      return (
        <Pop
          trigger="hover"
          position="bottom-left"
          content={
            <div className="edu-clue-pool-tag-tail">
              {tails.map((tail, index) => (
                <div key={index}>{tail.name}</div>
              ))}
            </div>
          }
        >
          <div>
            {tags.map(mapTagToEl)}
            <span className="edu-clue-pool-tag-etc">...</span>
          </div>
        </Pop>
      );
    },
  },
  {
    title: '回访时间',
    width: '125px',
    name: 'revisitTime',
    needSort: true,
    bodyRender: row => (row.revisitTime ? formatDate(row.revisitTime, 'YYYY-MM-DD HH:mm:ss') : '-'),
  },
  {
    title: '最近动态',
    width: '225px',
    needSort: true,
    textAlign: 'right',
    name: 'recordUpdatedAt',
    bodyRender: row => {
      return (
        <>
          <div>{formatDate(row.recordUpdatedAt, 'YYYY-MM-DD HH:mm:ss')}</div>
          <div>{row.recordDesc}</div>
        </>
      );
    },
  },
]);

export const columns = arrayColumnWrapper([
  {
    title: '姓名',
    fixed: 'left',
    width: '100px',
    bodyRender: row => (
      <a href={`#/detail/${row.clueId}`} target="_blank" rel="noopener noreferrer">
        {row.name || '-'}
      </a>
    ),
  },
  {
    title: '手机号',
    width: '100px',
    bodyRender: row => (
      <a href={`#/detail/${row.clueId}`} target="_blank" rel="noopener noreferrer">
        {row.telephone}
      </a>
    ),
  },
  {
    title: '创建时间',
    width: '125px',
    needSort: true,
    name: 'createdAt',
    bodyRender: row => formatDate(row.createdAt, 'YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: '阶段',
    width: '100px',
    bodyRender: row => defaultPhaseOptions[row.phase].text,
  },
  {
    title: '来源',
    chainState: !isEduHqStore,
    bodyRender: row => (row.source && [row.source.groupName, row.source.name].join('-')) || '-',
  },
  {
    title: '来源',
    chainState: isEduHqStore,
    bodyRender: row => (row.source && [row.source.groupName, row.source.name].join('-')) || '-',
  },
  {
    title: '所属校区',
    chainState: isEduHqStore && path === 'pool',
    name: 'ownerSchoolName',
  },
  {
    title: '标签',
    bodyRender: row => {
      const tags = [].concat(row.tags || []);
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
      const tails = tags.splice(2);
      return (
        <Pop
          trigger="hover"
          position="bottom-left"
          content={
            <div className="edu-clue-pool-tag-tail">
              {tails.map((tail, index) => (
                <div key={index}>{tail.name}</div>
              ))}
            </div>
          }
        >
          <div>
            {tags.map(mapTagToEl)}
            <span className="edu-clue-pool-tag-etc">...</span>
          </div>
        </Pop>
      );
    },
  },
  {
    title: '回访时间',
    width: '125px',
    name: 'revisitTime',
    needSort: true,
    bodyRender: row => (row.revisitTime ? formatDate(row.revisitTime, 'YYYY-MM-DD HH:mm:ss') : '-'),
  },
  {
    title: '最近动态',
    width: '225px',
    needSort: true,
    textAlign: 'right',
    name: 'recordUpdatedAt',
    bodyRender: row => {
      return (
        <>
          <div>{formatDate(row.recordUpdatedAt, 'YYYY-MM-DD HH:mm:ss')}</div>
          <div>{row.recordDesc}</div>
        </>
      );
    },
  },
]);
