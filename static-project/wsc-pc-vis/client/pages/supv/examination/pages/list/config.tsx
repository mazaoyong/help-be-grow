import { Pop } from '@zent/compat';
/* eslint-disable react/jsx-key */
import React from 'react';
import { Link as SamLink } from '@youzan/sam-components';
import { ExamStatus, ExamValidityType, ReviewStatus } from '../../types';
import { EasyList } from '@youzan/ebiz-components';
import { IEasyGridColumn, ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';
import { Operations } from '@youzan/react-components';
import { format } from 'date-fns';
import get from 'lodash/get';
import { IExamListEntity } from '../../api';
import openSubscribeDialog from '../../components/subscribe-dialog';

import { SAM_NAME } from '../../constants';

const { DatePickerTypes } = EasyList;

const statusOptions = [
  {
    text: '全部',
    value: '-1',
  },
  {
    text: '已发布',
    value: '' + ExamStatus.PUB,
  },
  {
    text: '未发布',
    value: '' + ExamStatus.UNPUB,
  },
];

export const filterConfig: ICombinedFilterConf[] = [
  {
    name: 'name',
    label: '考试名称：',
    type: 'Input',
    inheritProps: {
      placeholder: '输入考试名称',
    },
  },
  {
    name: 'status',
    label: '考试状态：',
    type: 'Select',
    options: statusOptions,
    defaultValue: -1,
  },
  {
    name: 'timeRange',
    label: '创建时间：',
    type: DatePickerTypes.DateRangeQuickPicker,
    inheritProps: {
      canClear: false,
      valueType: 'number',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
];

export const columns: (obj: any) => IEasyGridColumn<IExamListEntity>[] = ({
  setShareVisible,
  setShareUrl,
  setPreviewVisible,
  setPreviewUrl,
  onDelete,
  onUpdate,
}) => [
  {
    title: '考试名称',
    name: 'title',
    width: 200,
    bodyRender: (data) => {
      return (
        <Pop content={data.title} trigger="hover" wrapperClassName="ellipsis-2">
          {data.title}
        </Pop>
      );
    },
  },
  {
    title: '关联课程',
    width: 120,
    nowrap: true,
    bodyRender: (data) => {
      const text = get(data, 'courseTitle');
      return text ? (
        <Pop content={text} trigger="hover" wrapperClassName="ellipsis">
          {text}
        </Pop>
      ) : (
        '-'
      );
    },
  },
  {
    title: '考试状态',
    width: 120,
    bodyRender: (data) => {
      return data.status === ExamStatus.PUB ? '已发布' : '未发布';
    },
  },
  {
    title: '创建时间',
    width: 180,
    bodyRender: (data) => {
      return format(data.createdAt, 'YYYY-MM-DD HH:mm:ss'); // data.createdAt
    },
  },
  {
    title: '考试有效期',
    width: 160,
    bodyRender: (data) => {
      const { validityType, startTime = 0, endTime = 0 } = data.validity;
      if (validityType === ExamValidityType.FOREVER) {
        return '长期有效';
      } else if (validityType === ExamValidityType.TIME_LIMIT) {
        return `${format(startTime, 'YYYY-MM-DD HH:mm:ss')} 至 ${format(
          endTime,
          'YYYY-MM-DD HH:mm:ss',
        )}`;
      }
    },
  },
  {
    title: '未批阅',
    width: 120,
    bodyRender: (data) => {
      const { id, unReviewNum } = data;
      return (
        <a rel="noopener noreferrer" className="cursor-link" href={`#/review/${id}?status=${ReviewStatus.NOT_REVIEWED}`}>
          {unReviewNum}
        </a>
      );
    },
  },
  {
    title: '已批阅',
    width: 120,
    bodyRender: (data) => {
      const { id, reviewNum } = data;
      return (
        <a rel="noopener noreferrer" className="cursor-link" href={`#/review/${id}?status=${ReviewStatus.REVIEWED}`}>
          {reviewNum}
        </a>
      );
    },
  },
  {
    title: '操作',
    fixed: 'right',
    textAlign: 'right',
    bodyRender: (data) => {
      const { id } = data;
      const items = [
        {
          component: (
            <SamLink name={SAM_NAME.REVIEW} href={`#/review/${id}`}>
              批阅
            </SamLink>
          ),
          show: true,
        },
        {
          component: (
            <a
              rel="noopener noreferrer"
              onClick={() => {
                setShareVisible(true);
                setShareUrl(
                  `https://h5.youzan.com/wscvis/supv/examination/detail?examId=${id}&kdt_id=${_global.kdtId}`,
                );
              }}
            >
              分享
            </a>
          ),
          show: true,
        },
        {
          component: (
            <a rel="noopener noreferrer" href={`#/stats/${id}`}>
              数据
            </a>
          ),
          show: data.reviewNum > 0 || data.unReviewNum > 0,
        },
        {
          component: (
            <SamLink name={SAM_NAME.EDIT_EXAM} href={`#/edit/${id}`}>
              编辑
            </SamLink>
          ),
          show: true,
        },
        {
          component: (
            <SamLink
              name={SAM_NAME.EDIT_EXAM}
              rel="noopener noreferrer"
              onClick={() => {
                document.body.click();
                // 如果插件不可用，提示订购
                if (data.status === ExamStatus.UNPUB && !get(_global, 'pluginInfo.canBeUsed', false)) {
                  return openSubscribeDialog();
                }

                const status = data.status === ExamStatus.UNPUB ? ExamStatus.PUB : ExamStatus.UNPUB;
                onUpdate(id, status);
              }}
            >
              {data.status === ExamStatus.UNPUB ? '发布' : '停用'}
            </SamLink>
          ),
          show: true,
        },
        {
          component: (
            <a
              rel="noopener noreferrer"
              onClick={() => {
                document.body.click();
                setPreviewVisible(true);
                setPreviewUrl(
                  `https://h5.youzan.com/wscvis/supv/examination/answer/preview?examId=${id}&kdt_id=${_global.kdtId}`,
                );
              }}
            >
              预览
            </a>
          ),
          show: true,
        },
        {
          component: (
            <Pop
              trigger="click"
              content={
                <div>
                  <div>删除后将不可恢复，已参与考试的学员</div>
                  数据将无法查询。确定删除吗？
                </div>
              }
              onConfirm={() => {
                document.body.click();
                onDelete(id);
              }}
              confirmText="删除"
              position="top-right"
              className="pop-delete"
            >
              <SamLink name={SAM_NAME.EDIT_EXAM} rel="noopener noreferrer">
                删除
              </SamLink>
            </Pop>
          ),
          show: true,
        },
      ];
      return <Operations items={items.filter((item) => item.show).map((item) => item.component)} />;
    },
  },
];
