import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'zent';
import { checkClueMerge } from '../../../../api';
import store from '../../store';
import { isEduHqStore } from '@youzan/utils-shop';
import MergeInfoDialog from './MergeInfoDialog';
import './styles.scss';

function UpgradeTip() {
  const [canTransfer, setCanTransfer] = useState(false);
  const [data, setData] = useState([]);
  const { clueId, identityNo, owners } = store.useStoreState();
  useEffect(() => {
    if (!identityNo) return;
    checkClueMerge({
      clueId,
      identityNo,
    }).then(_data => {
      // data数据表示学员里与线索匹配的信息，按道理没有匹配信息就代表不可转化
      if (_data && _data.length > 0) {
        setCanTransfer(true);
        setData(_data);
      }
    });
  }, [clueId, identityNo]);
  const transferToStudent = () => {
    let ownerProps = {};
    if (owners && owners.length > 0) {
      ownerProps = {
        ownerId: owners[0].userId,
        ownerName: owners[0].name,
      };
    }
    MergeInfoDialog.open('提示', {
      data,
      identityNo,
      ...ownerProps,
    });
  };
  // 总部不支持，只有单店和校区
  if (!canTransfer || isEduHqStore) return null;
  return (
    <Alert
      className="upgrade-tip"
      type="warning"
      extraContent={
        <Button type="primary" onClick={transferToStudent}>
          转为学员
        </Button>
      }
    >
      学员已报名过正式课程，可以手动转为在读或结业学员
    </Alert>
  );
}

export default UpgradeTip;
