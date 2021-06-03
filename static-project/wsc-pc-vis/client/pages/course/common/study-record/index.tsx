/*****************
 * 学习记录
 */
import React, { FC, useMemo, useLayoutEffect } from 'react';
import StatisticsBlock from './blocks/statistics';
import StudyTrendBlock from './blocks/chart';
import StudyListWrapper from './blocks/list';
// import { withRouter, WithRouterProps, history } from 'react-router';
import './style.scss';

const StudyRecord: FC<{}> = () => {
  const courseType = useMemo<number>(() => {
    return +getParamName('courseType');
  }, [ ]);

  const courseId = useMemo<number>(() => {
    return +getParamName('courseId');
  }, [ ]);

  useLayoutEffect(() => {
    // 此样式放在css中会影响其他页面
    const $conatiner = document.getElementsByClassName('app-inner');
    if ($conatiner && $conatiner.length) {
      $conatiner[0].setAttribute('style', 'padding: 0!important');
    }
  }, []);

  return <div className='study-record__page'>
    <StatisticsBlock courseType={courseType} courseId={courseId}/>
    <div className='study-record__split'/>
    <StudyTrendBlock courseType={courseType} courseId={courseId}/>
    <div className='study-record__split'/>
    <StudyListWrapper courseType={courseType} courseId={courseId}/>
  </div>;
};

const getParamName: (attr: string) => string = (attr) => {
  const match = RegExp(`[?&]${attr}=([^&]*)`).exec(window.location.href);
  return match ? decodeURIComponent(match[1]) : '';
};

export default StudyRecord;
