import React from 'react';
import { useArthurModel } from '@youzan/arthur-scheduler-react';
import { BreadcrumbNav } from '@youzan/react-components';
import get from 'lodash/get';
import { DETAIL_TAB } from '../../constants';

const homeworkInWhitelist = _global.nodeEnv === 'qa' || get(_global, 'whitelist.homework', false);

export default function(WrappedComponent, tabIndex) {
  return (props) => {
    const { model: viewHomeworkModel } = useArthurModel('viewHomework', '督学互动');
    const { available: homeworkAvaliable } = viewHomeworkModel;

    const params = props.params || {};
    const eduClassId = params.eduClassId;
    const eduCourseId = params.eduCourseId;
    const kdtId = params.kdtId;
    const navs = [
      {
        id: DETAIL_TAB.STUDENT,
        name: '学员',
        href: `#/detail/${eduClassId}/${eduCourseId}/${kdtId}/student`,
      },
      {
        id: DETAIL_TAB.PANEL,
        name: '课表',
        href: `#/detail/${eduClassId}/${eduCourseId}/${kdtId}/panel`,
      },
      {
        id: DETAIL_TAB.RECORD,
        name: '上课记录',
        href: `#/detail/${eduClassId}/${eduCourseId}/${kdtId}/record`,
      },
    ];

    if (homeworkAvaliable && homeworkInWhitelist) {
      navs.push({
        id: DETAIL_TAB.HOMEWORK,
        name: '作业',
        href: `#/detail/${eduClassId}/${eduCourseId}/${kdtId}/homework`,
      });
    }
    return (
      <div className="nav-wrapper">
        <BreadcrumbNav
          className="nav-wrapper__navbar"
          navs={navs}
          activeNav={tabIndex}
          hasBottomBorder
        />
        <WrappedComponent {...props} />
      </div>
    );
  };
};
