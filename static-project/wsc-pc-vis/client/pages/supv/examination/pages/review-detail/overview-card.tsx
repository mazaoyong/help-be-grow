import React, { FC } from 'react';

import { format } from 'date-fns';

import { formatTimeDuration } from '../../utils';

interface IOverviewCardProps {
  title: string;
  totalScore: number;
  startTime: number;
  submitTime: number;
  username: string;
}

const OverviewCard: FC<IOverviewCardProps> = ({ title, totalScore, startTime, submitTime, username }) => {
  const [date, time] = format(submitTime, 'YYYY-MM-DD HH:mm:ss').split(' ');
  const duration = formatTimeDuration(submitTime - startTime);

  return (<div className="review-detail__aside--overview-card">
    <header>
      {title}
    </header>
    <dl className="review-detail__aside--overview-card-body">
      <div className="review-detail__aside--overview-card-body-item">
        <dt>学员姓名：</dt>
        <dd>{username}</dd>
      </div>
      <div className="review-detail__aside--overview-card-body-item">
        <dt>考试成绩： </dt>
        <dd>
          <span className="review-detail__aside--overview-card-body-score">
            {Number(totalScore).toFixed(2)}
          </span>
              分
        </dd>
      </div>
      <div className="review-detail__aside--overview-card-body-item">
        <dt>交卷时间：</dt>
        <dd>{date}<br />{time}</dd>
      </div>
      <div className="review-detail__aside--overview-card-body-item">
        <dt>考试用时：</dt>
        <dd>{duration}</dd>
      </div>
    </dl>
  </div>);
};

export default OverviewCard;
