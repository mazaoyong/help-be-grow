/*****************
 * 学习记录 —— 学员详情
 */
import React, { FC, useMemo } from 'react';
import StatisticsWrapper from './blocks/statistics';
import StudyDetailList from './blocks/list';
import './style.scss';

const StudyDetail: FC<{}> = () => {
  const courseAlias = useMemo<string>(() => {
    return getParamName('courseAlias');
  }, []);

  const courseId = useMemo<number>(() => {
    return +getParamName('courseId');
  }, []);

  const userId = useMemo<number>(() => {
    return +getParamName('userId');
  }, []);

  const userName = useMemo<string>(() => {
    return getParamName('userName');
  }, []);

  return (<>
    <StatisticsWrapper courseAlias={courseAlias} courseId={courseId} userId={userId} userName={userName}/>
    <StudyDetailList courseAlias={courseAlias} courseId={courseId} userId={userId} userName={userName}/>
  </>);
};

const getParamName: (attr: string) => string = (attr) => {
  const match = RegExp(`[?&]${attr}=([^&]*)`).exec(window.location.href);
  return match ? decodeURIComponent(match[1]) : '';
};

export default StudyDetail;
