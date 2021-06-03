import React, { FC, useEffect, useState } from 'react';

import { Dialog } from '@youzan/ebiz-components';

import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog';

import { getUserExamCollectionInfo } from '../../../../api';

import { BlockLoading } from 'zent';

import { RecordDetail } from '@ability-center/clue/record-detail';

const { openDialog } = Dialog;

const DialogContent:FC<IDialogChildrenProps<void, {userExamId:number}>> = ({ data: { userExamId }, dialogref }) => {
  const [infoData, setInfoData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    getUserExamCollectionInfo(userExamId).then(resp => {
      setInfoData(resp);
      setLoading(false);
    });
  }, [userExamId]);
  return loading ? <BlockLoading loading={loading} />
    : <RecordDetail dialogref={dialogref} data={{ attributes: infoData, scene: 'examination' }} />;
};

export default function openCollectionInfoDialog(userExamId:number) :void {
  openDialog(DialogContent, {
    title: '报名信息',
    mask: true,
    data: {
      userExamId
    }
  });
}
