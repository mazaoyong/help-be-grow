import React from 'react';
import { Dialog } from 'zent';
import { RewardTypeMap } from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';
import RewardRecord, { IRewardRecordProps } from './content';
import { getUuid } from './utils';

const { openDialog } = Dialog;

const RewardRecordDialog = ({ rewardType, ...props }: IRewardRecordProps) => {
  const dialogId = String(getUuid());
  openDialog({
    dialogId,
    title: `${RewardTypeMap[rewardType]}奖励`,
    children: <RewardRecord rewardType={rewardType} {...props} />,
    maskClosable: false,
  });
};

export default RewardRecordDialog;
