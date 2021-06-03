import React, { FC } from 'react';
import { format } from 'date-fns';

export interface IAssetTipProps {
  assetInfo: any;
}

// 销售类型
const SellType = {
  custom: 0, // 自定义
  classHour: 1, // 按课时
  dateRange: 2, // 按时间段
  period: 3, // 按期
};

// 有效期类型
const PeriodType = {
  forever: 1, // 永久有效期
  other: 2, // 多少天后生效
};

// 生效类型
const EffectiveType = {
  signIn: 1, // 签到后生效
};

// 生效状态
const Status = {
  noExperiod: 0, // 未设置有效期
  non: 1, // 未生效
  already: 2, // 已生效
  bad: 3, // 已失效
};

const AssetTip: FC<IAssetTipProps> = ({ assetInfo }) => {
  if (!assetInfo) {
    return null;
  }
  const { courseProductDTO, userAssetDTO } = assetInfo;
  const { validityPeriodType, sellType, courseEffectiveType } = courseProductDTO;
  const { status, dataRange, remaining = 0 } = userAssetDTO;
  const { startTime = 0, endTime = 0 } = dataRange;
  const startDate = format(startTime, 'YYYY-MM-DD');
  const experiedDate = format(endTime, 'YYYY-MM-DD');
  const messageComp = [
    `剩余${remaining / 100}课时`,
    `${experiedDate}到期`,
    '首次上课签到后生效',
    `开班时间(${startDate} 至 ${experiedDate})`,
    `课程${startDate}生效`,
  ];

  const getMessageByIdx: (...idx: number[]) => string[] = (...idx) => {
    return idx.map(index => messageComp[index]);
  };

  let message: string[] = [];

  if (sellType === SellType.classHour) {
    if (validityPeriodType === PeriodType.forever) {
      message = getMessageByIdx(0);
    } else if (validityPeriodType === PeriodType.other) {
      if (courseEffectiveType === EffectiveType.signIn) {
        if (status === Status.already) {
          message = getMessageByIdx(0);

          if (endTime) {
            message = getMessageByIdx(0, 1);
          }
        } else {
          message = getMessageByIdx(0, 2);
        }
      } else {
        message = getMessageByIdx(0, 1);
      }
    }
  } else if (sellType === SellType.period) {
    message = getMessageByIdx(3);
  } else {
    if (status === Status.already) {
      message = getMessageByIdx(1);
    } else if (status === Status.non) {
      message = getMessageByIdx(4, 1);
    } else if (status === Status.noExperiod) {
      if (courseEffectiveType === EffectiveType.signIn) {
        message = getMessageByIdx(2);
      }
    }
  }
  return <div className="appointment-dialog-content__asset-tip">{message.join('，')}</div>;
};

export default AssetTip;
