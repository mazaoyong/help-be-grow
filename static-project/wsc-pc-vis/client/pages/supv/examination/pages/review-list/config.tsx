import React from 'react';
import { ReviewStatus } from '../../types';
import { EasyList } from '@youzan/ebiz-components';
import { Avatar } from 'zent';
import { IEasyGridColumn, ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';
// import { Operations } from '@youzan/react-components';
import { format } from 'date-fns';
import { Link } from 'react-router';

import { getStudentDetailUrl } from '@ability-center/student/get-student-detail-url';

import { SCORE_MULTIPLIER, GENDER } from '../../constants';

import { findPagePowerStaffs } from '../../api';

const { DatePickerTypes } = EasyList; ;

export const statusTabs = [
  {
    label: `全部`,
    value: '0',
  },
  {
    label: `未批阅`,
    value: String(ReviewStatus.NOT_REVIEWED),
  },
  {
    label: `已批阅`,
    value: String(ReviewStatus.REVIEWED),
  },
];

// 每次筛选列表的 Tab 实时更新分类数量
export const generateStatusTabs = ({
  notReviewCount, reviewedCount, totalCount
}) => {
  const counts = [totalCount, notReviewCount, reviewedCount];
  return statusTabs.map((item, idx) =>
    ({ ...item, label: `${item.label} ${counts[idx]}` }));
};

export const filterConfig: ICombinedFilterConf[] = [
  {
    name: 'examUserName',
    label: '学员姓名：',
    type: 'Input',
    inheritProps: {
      placeholder: '输入学员姓名',
    },
  },
  {
    name: 'reviewerId',
    label: '批阅人：',
    type: 'Select',
    defaultValue: -1,
    options() {
      return findPagePowerStaffs().then(res => {
        // @todo: 处理接口报错
        const options = res.map(item => {
          return {
            text: item.name,
            value: item.adminId,
            mobile: item.account
          };
        });
        options.unshift({
          text: '全部',
          value: -1,
          mobile: ''
        });

        return options;
      });
    },
    inheritProps: {
      filter: (item, keyword) => {
        return item.text.includes(keyword) || item.mobile.includes(keyword);
      },
    },
  },
  {
    name: 'submitDateRange',
    label: '提交时间：',
    type: DatePickerTypes.DateRangeQuickPicker,
    inheritProps: {
      canClear: false,
      valueType: 'number',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
];

export const columns: (examTemplateId:string)=> IEasyGridColumn[] = (examTemplateId) => [
  {
    title: '学员',
    bodyRender: ({ examUser: user = {} }) => {
      const { role, avatar, name, mobile, userId, gender } = user;
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
        <div className="review-list__table--user">
          <a className="review-list__table--user-info-name" href={link} target='_blank' rel="noopener noreferrer">
            <Avatar
              style={{
                width: '48px',
                height: '48px'
              }}
              src={avatar || getStudentAvatar(gender)}
            />
          </a>
          <div className="review-list__table--user-info">
            <a className="review-list__table--user-info-name" href={link} target='_blank' rel="noopener noreferrer">
              { name }
            </a>
            <div className="review-list__table--user-info-mobile">
              { mobile }
            </div>
          </div>
        </div>
      );
    },
  },
  {
    title: '成绩',
    bodyRender({ score, status }) {
      if (status !== 2) {
        return '-';
      }
      return score >= 0 ? (score / SCORE_MULTIPLIER).toFixed(2) : '-';
    }
  },
  {
    title: '提交时间',
    bodyRender: ({ submitTime }) => {
      if (!submitTime) {
        return '-';
      }
      return format(submitTime, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '批阅状态',
    bodyRender: ({ status }) => {
      return (statusTabs[status] && statusTabs[status].label) || '-';
    },
  },
  {
    title: '批阅人',
    bodyRender: ({ reviewer }) => {
      if (!reviewer) {
        return '-';
      }
      return <>{reviewer.name || '-'}<br />{reviewer.mobile || '-'}</>;
    },
  },
  {
    title: '操作',
    textAlign: 'right',
    bodyRender: ({ status, answerPaperId, submitTime }) => {
      if (!submitTime) {
        return '-';
      }
      return (
        <Link rel="noopener noreferrer" to={`/review/${examTemplateId}/detail/${answerPaperId}`}>
          {status === 1 ? '批阅' : '查看' }
        </Link>
      );
    },
  },
];

function getStudentAvatar(gender) {
  switch (gender) {
    case GENDER.MALE:
      return 'https://b.yzcdn.cn/public_files/2019/03/23/1ab34592f489f63f1552424dfcc5fbd9.png';
    case GENDER.FEMALE:
      return 'https://b.yzcdn.cn/public_files/2019/03/23/f84ffa850a63c65f3127b571da7ae068.png';
    default:
      return 'https://b.yzcdn.cn/public_files/2019/03/23/1ab34592f489f63f1552424dfcc5fbd9.png';
  }
}
