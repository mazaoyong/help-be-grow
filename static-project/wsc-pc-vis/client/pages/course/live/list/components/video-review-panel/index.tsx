import React, { useContext, useMemo } from 'react';
import { Icon } from 'zent';
import formatLargeNumber from '@youzan/utils/money/formatLargeNumber';
import { isHqStore, isBranchStore } from '@youzan/utils-shop';
import { CampusContext } from 'components/campus-filter/campus-provider';
import { BRANCH_STORE_NAME } from 'constants/chain';
import ReviewPanel, { IDataItem } from './review-panel';
import { getVideoTimeSurplusData } from '../../../common';
import { ILiveVideoSurvey } from '../video-record/types';

interface IProps {
  survey: ILiveVideoSurvey;
}

const getRechargeTips = (targetKdtId: number) => {
  if (isHqStore && targetKdtId === _global.kdtId) {
    return `暂不支持给总部充值，可以上方「${BRANCH_STORE_NAME}范围」切换${BRANCH_STORE_NAME}后给${BRANCH_STORE_NAME}充值`;
  }
  if (isBranchStore) {
    return `暂不支持${BRANCH_STORE_NAME}充值，请联系总部处理`;
  }

  return '';
};

const getBasicData = (survey: ILiveVideoSurvey, targetKdtId: number): IDataItem[] => {
  const data: IDataItem[] = [
    {
      title: '观看IP数',
      value: formatLargeNumber(survey.watchIpCount),
    },
    {
      title: '观看时长(分钟)',
      value: formatLargeNumber(survey.watchDuration),
    },
    {
      title: '人均观看时长(分钟)',
      value: formatLargeNumber(+survey.perWatchTime),
    },
  ];

  const timeSurplusData = getVideoTimeSurplusData({
    status: survey.status,
    surplusTime: survey.surplusWatchTime,
  });

  const rechargeTips = getRechargeTips(targetKdtId);
  // 通用支持充值的判断逻辑 && 非总部在总部视角 && 非校区
  const allowRecharge = Boolean(timeSurplusData.rechargeUrl) && !rechargeTips;

  data.push({
    title: '剩余观看时长(分钟)',
    tips: timeSurplusData.tips,
    value: allowRecharge ? (
      <a href={timeSurplusData.rechargeUrl} target="_blank" rel="noopener noreferrer">
        <span>{timeSurplusData.value}</span>
        <Icon type="right" />
      </a>
    ) : (
      <span>{timeSurplusData.value}</span>
    ),
    valueTips: timeSurplusData.rechargeUrl ? rechargeTips : '',
  });
  return data;
};

const VideoReviewPanel: React.FC<IProps> = (props) => {
  const { targetKdtId } = useContext(CampusContext);
  const data = useMemo(() => getBasicData(props.survey, targetKdtId), [props.survey, targetKdtId]);
  return <ReviewPanel data={data} />;
};

export default VideoReviewPanel;
