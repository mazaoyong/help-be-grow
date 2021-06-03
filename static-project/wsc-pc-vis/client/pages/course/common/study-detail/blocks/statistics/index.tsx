import React, { FC, useState, useEffect } from 'react';
import { IDetailStatistics, IStudyDetailPageProps } from '../../types';
import StatisticsFC from '../../components/statistics';
import { getUserOverview } from '../../api';
import { Notify } from 'zent';

const defaultStatistics: IDetailStatistics = {
  finishCourseCount: 0, // 完成课程数
  learnProgress: 0, // 学习进度
  learnDuration: 0, // 学习时长
  learnNumber: 0, // 学习次数
};

const StatisticsWrapper: FC<IStudyDetailPageProps> = (props) => {
  const { userId, courseAlias, courseId, userName } = props;
  const [statistics, setStatistics] = useState<IDetailStatistics>(defaultStatistics);

  useEffect(() => {
    getUserOverview({
      query: {
        userId,
        courseAlias,
        courseId,
      }
    }).then((resp: IDetailStatistics) => {
      if (resp) {
        setStatistics({ ...resp, learnDuration: +(resp.learnDuration / 60).toFixed(2) });
      }
    }).catch(err => Notify.error(err));
  }, [ userId, courseAlias, courseId ]);

  return <div className='study-detail__block'>
    <p className='study-detail__title'>{userName}的学习记录</p>
    <StatisticsFC {...statistics}/>
  </div>;
};

export default StatisticsWrapper;
