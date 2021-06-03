import React, { ReactElement } from 'react';
import { TCourseData } from '../interface';
import { SELL_STATUS } from '../../constants';

type TCourseDefaultValue = {
  courseTitle: string,
  courseType: number | string,
}

export function courseColumns() : any[] {
  return [
    {
      title: '线下课名称',
      bodyRender(data: Partial<TCourseData>): ReactElement {
        return <a href={data.shortenUrl || ''}>{data.title}</a>;
      },
    },
    {
      title: '线下课类型',
      bodyRender(data: Partial<TCourseData>): string {
        return data.courseType ? '正式课' : '体验课';
      },
    },
    {
      title: '适用课程',
      bodyRender(data: Partial<TCourseData>): string {
        return data.applyCourseName || '-';
      },
    },
    {
      title: '名额',
      bodyRender(data: Partial<TCourseData>): string {
        return `${data.totalStock}` || '-';
      },
    },
    {
      title: '出售状态',
      textAlign: 'right',
      bodyRender(data: Partial<TCourseData>): string {
        return typeof data.sellStatus === 'number' ? SELL_STATUS[data.sellStatus + 1] : '-';
      },
    },
  ];
};

export const courseOptions: any[] = [
  {
    type: 'Input',
    name: 'courseTitle',
    label: '线下课名称：',
    props: {
      placeholder: '请输入线下课名称',
    },
  },
  {
    type: 'Select',
    name: 'courseType',
    label: '线下课类型：',
    data: [
      {
        value: '',
        text: '全部',
      },
      {
        value: '0',
        text: '体验课',
      },
      {
        value: '1',
        text: '正式课',
      },
    ],
  },
];

export const defaultCourseOptions: Partial<TCourseDefaultValue> = {
  courseTitle: '',
  courseType: '',
};
