import { Pop } from '@zent/compat';
import React, { FC, useState, useEffect } from 'react';
import { IStatistics, IStudyRecordPageProps } from '../../types';
import StatisticsFC from '../../components/statistics';
import { getOverview } from '../../api';
import { Notify, Icon } from 'zent';
import formatDate from '@youzan/utils/date/formatDate';
import './style.scss';

const defaultStatistics: IStatistics = {
  learnCount: 0,
  applyCount: 0,
  avgLearnDuration: 0,
  finishLessonRate: 0,
  finishedLessonCount: 0,
  totalLearnDuration: 0
};

const StatisticsBlock: FC<IStudyRecordPageProps> = (props) => {
  const { courseType, courseId } = props;
  const [statistics, setStatistics] = useState<IStatistics>(defaultStatistics);

  useEffect(() => {
    getOverview({
      courseType,
      courseId
    }).then((resp: IStatistics) => {
      if (resp) {
        setStatistics({ ...resp, avgLearnDuration: Number((resp.avgLearnDuration / 60).toFixed(2)) });
      }
    }).catch(err => Notify.error(err));
  }, [courseType, courseId]);

  return <div className='study-record__block'>
    <p className='study-record__title study-record__notice'><span>学习概况</span><span className='study-record__update'>数据更新时间：{`${formatDate(new Date(), 'YYYY年MM月DD日')}: 00:00`}<Pop content='每日凌晨更新截至前一日的数据' trigger='hover'><Icon className='study-record__icon' type='help-circle' /></Pop></span></p>
    <StatisticsFC {...statistics}/>
  </div>;
};

export default StatisticsBlock;
