import React, { ReactNode } from 'react';
import { Link as SamLink } from '@youzan/sam-components';
import { EasyList } from '@youzan/ebiz-components';
import { IEasyGridColumn, ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';
import { format } from 'date-fns';
import { SubmitStatus } from '../../types';
import { Avatar } from 'zent';
import { getStudentDetailUrl } from '@ability-center/student/get-student-detail-url';

import { SCORE_MULTIPLIER, SAM_NAME } from '../../../../constants';
import { formatTimeDuration } from '../../../../utils';
import { Operations } from '@youzan/react-components';

import openCollectionInfoDialog from './collection-info-dialog';
import './style.scss';
const { DatePickerTypes } = EasyList;

export const filterConfig: ICombinedFilterConf[][] = [
  [
    {
      name: 'userName',
      label: '学员姓名：',
      type: 'Input',
      inheritProps: {
        placeholder: '输入学员姓名',
      },
    },
    {
      name: 'submittedStatus',
      label: '提交状态：',
      type: 'Select',
      defaultValue: String(SubmitStatus.ALL),
      options: [
        {
          text: '全部',
          value: String(SubmitStatus.ALL),
        },
        {
          text: '未提交',
          value: String(SubmitStatus.UN_SUBMIT),
        },
        {
          text: '已提交',
          value: String(SubmitStatus.SUBMITED),
        },
      ]
    }
  ],
  [
    {
      name: 'timeType',
      label: '考试时间：',
      type: 'Select',
      defaultValue: '1',
      options: [
        {
          text: '考试开始时间',
          value: '1'
        },
        {
          text: '考试结束时间',
          value: '2'
        },
      ],
      inheritProps: {
        width: 140,
        autoWidth: true
      }
    },
    {
      name: 'dateRange',
      type: DatePickerTypes.DateRangeQuickPicker,
      inheritProps: {
        canClear: false,
        valueType: 'number',
        format: 'YYYY-MM-DD HH:mm:ss',
        className: 'statspage__students--filter-time-selector'
      },
    }
  ]
];

enum GenderEnums {
  UNKNOWN = 0,
  MALE,
  FEMALE,
}

const defaultAvatar: Record<GenderEnums, string> = {
  [GenderEnums.UNKNOWN]:
    'https://b.yzcdn.cn/public_files/2019/03/23/1ab34592f489f63f1552424dfcc5fbd9.png',
  [GenderEnums.MALE]:
    'https://b.yzcdn.cn/public_files/2019/03/23/1ab34592f489f63f1552424dfcc5fbd9.png',
  [GenderEnums.FEMALE]:
    'https://b.yzcdn.cn/public_files/2019/03/23/f84ffa850a63c65f3127b571da7ae068.png',
};

const submitStatusMap = {
  [SubmitStatus.UN_SUBMIT]: '未提交',
  [SubmitStatus.SUBMITED]: '已提交'
};

export const columnsConfig: IEasyGridColumn[] = [
  {
    title: '学员姓名',
    fixed: true,
    bodyRender: ({ examUser }) => {
      const { name, role, userId, mobile, avatar, gender = 0 } = examUser || null;
      let link = '';
      switch (role) {
        case 1: // 学员
          link = getStudentDetailUrl({ studentId: userId });
          break;
        case 0: // 客户
          link = `/v4/scrm/customer/manage#/detail?yzUid=${userId}`;
          break;
        default:
          break;
      }
      return (
        <div className="statistic-student__wrap">
          <Avatar src={avatar || defaultAvatar[gender]} className="avatar" size={48} />
          <div className="statistic-student__info">
            <a href={link} target='_blank' rel="noopener noreferrer">
              {name}
            </a>
            <div className="statistic-student__mobile">{mobile}</div>
          </div>
        </div>
      );
    },
  },
  {
    title: '提交状态',
    bodyRender({ submitStatus }) {
      return submitStatusMap[submitStatus] || '-';
    }
  },
  {
    title: '考试开始时间',
    bodyRender: ({ examStartTime }) => {
      if (!examStartTime) {
        return '-';
      }
      return transferTime(examStartTime);
    },
  },
  {
    title: '考试结束时间',
    bodyRender: ({ examEndTime, submitStatus }) => {
      if (submitStatus === SubmitStatus.UN_SUBMIT || !examEndTime) {
        return '-';
      }
      return transferTime(examEndTime);
    },
  },
  {
    title: '总分',
    name: '2',
    needSort: true,
    bodyRender: scoreBodyRender('totalScore')
  },
  {
    title: '非问答题得分',
    name: '3',
    needSort: true,
    bodyRender: scoreBodyRender('objectiveScore')
  },
  {
    title: '问答题得分',
    name: '4',
    needSort: true,
    bodyRender: scoreBodyRender('subjectiveScore')
  },
  {
    title: '用时',
    bodyRender: ({ joinDuration, submitStatus }) => {
      if (submitStatus === SubmitStatus.UN_SUBMIT || typeof joinDuration !== 'number') {
        return '-';
      }
      return formatTimeDuration(joinDuration, true);
    },
  },
  {
    title: '操作',
    textAlign: 'right',
    fixed: 'right',
    width: 200,
    bodyRender: ({ isReviewed, examTemplateId, answerPaperId, open, userExamId, submitStatus }) => {
      const items: ReactNode[] = [];

      if (submitStatus === SubmitStatus.SUBMITED) {
        items.push(
          <SamLink
            name={SAM_NAME.REVIEW}
            rel="noopener noreferrer"
            href={`#/review/${examTemplateId}/detail/${answerPaperId}`}>
            {isReviewed ? '批阅详情' : '批阅'}
          </SamLink>
        );
      }

      if (open) {
        items.push(
          <a onClick={() => { openCollectionInfoDialog(userExamId); }}>
            报名信息
          </a>
        );
      }

      if (items.length === 0) {
        return '-';
      }

      return <Operations id={answerPaperId} items={items} />;
    }
  },
];

function transferTime(timestamp: number): ReactNode {
  const [date, time] = format(timestamp, 'YYYY-MM-DD HH:mm:ss').split(' ');
  return (<>{date}<br />{time}</>);
}

function formatScore(score?: number): string {
  if (typeof score !== 'number' || score < 0) {
    return '-';
  }
  return (score / SCORE_MULTIPLIER).toFixed(2);
}

function scoreBodyRender(key: string) {
  return (data: any) => {
    if (!data.isReviewed && key !== 'objectiveScore') {
      return '-';
    }
    const score = data[key];
    return formatScore(score);
  };
}
