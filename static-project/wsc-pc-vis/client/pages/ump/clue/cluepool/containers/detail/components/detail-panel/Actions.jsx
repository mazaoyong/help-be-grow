import React, { useMemo, useCallback } from 'react';
import { Dialog, Notify, Sweetalert } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';

import { isEduHqStore } from '@youzan/utils-shop';
import { get } from 'lodash';

import store from '../../store';
import { Dialog as ebizDialog } from '@youzan/ebiz-components';
import DistributeCluesDialog from '../../../../components/distribute-clues-dialog';
import GiveupCluesDialog from '../../../../components/giveup-clue-dialog';
import TransferCluesDialog from '../../../../components/transfer-clue-dialog';
import DeleteClueDialog from '../../../../components/delete-clue-dialog';
import RestoreClueDialog from '../../../../components/restore-clue-dialog';

import { useWillUnmount } from '../../../../utils/hooks';
import { takeCluesAPI, permanentlyDeleteCluesAPI } from '../../../../api';

const { closeDialog } = Dialog;
const { openDialog } = ebizDialog;
const DistributeCluesDialogID = 'DistributeCluesDialogID';
const GiveupCluesDialogID = 'GiveupCluesDialogID';
const TransferCluesDialogID = 'TransferCluesDialogID';
const AuditionDialogID = 'AuditionDialogID';
const DeleteDialogID = 'DeleteDialogID';
const RestoreDialogID = 'RestoreDialogID';
const HardDeleteDialogID = 'HardDeleteDialogID';

const Actions = ({ owners, clueId }) => {
  const storeState = store.useStoreState();
  const isOwner = useMemo(
    () => owners.filter(({ userId }) => userId === _global.userId).length > 0,
    [owners],
  );
  const isShopAdmin = useMemo(
    () =>
      storeState.kdtId === window._global.kdtId &&
      storeState.roleId === 1 &&
      storeState.owners.length > 0,
    [storeState],
  );

  // 是否属于当前用户店铺
  const isOwnStore = useMemo(() => _global.kdtId === storeState.kdtId, [storeState.kdtId]);
  const isDeleted = useMemo(() => storeState.phase === 8, [storeState.phase]);

  useWillUnmount(() => {
    closeDialog(DistributeCluesDialogID);
    closeDialog(GiveupCluesDialogID);
    closeDialog(TransferCluesDialogID);
    closeDialog(AuditionDialogID);
    closeDialog(DeleteDialogID);
    closeDialog(RestoreDialogID);
    closeDialog(HardDeleteDialogID);
  });

  // 分配线索弹窗
  const onDistributeClues = useCallback(() => {
    const dialogRef = openDialog(DistributeCluesDialog, {
      dialogId: DistributeCluesDialogID,
      title: '分配线索',
      data: {
        clueIds: [clueId],
      },
      style: {
        width: '350px',
      },
    });

    dialogRef
      .afterClosed()
      .then(() => {
        location.href = `${_global.url.v4}/vis/ump/clue/all#/detail/${clueId}`;
        store.getDetail();
      })
      .catch(() => {});
  }, [clueId]);

  // 领取线索
  const takeClues = useCallback(() => {
    store.setGlobalLoading(true);
    takeCluesAPI([clueId])
      .then(({ failInfos = [] }) => {
        if (failInfos.length > 0) {
          Notify.error(get(failInfos, '0.message') || '领取失败');
        } else {
          Notify.success('领取成功');
        }
        location.href = `${_global.url.v4}/vis/ump/clue/mine#/detail/${clueId}`;
        store.getDetail();
      })
      .catch(msg => {
        store.setGlobalLoading(false);
        Notify.error(msg || '领取失败');
      });
  }, [clueId]);

  // 放弃线索弹窗
  const onGirveupClues = useCallback(() => {
    const dialogRef = openDialog(GiveupCluesDialog, {
      dialogId: GiveupCluesDialogID,
      title: '放弃线索',
      data: {
        clueIds: [clueId],
      },
      style: {
        width: '450px',
      },
    });

    dialogRef
      .afterClosed()
      .then(() => {
        location.href = `${_global.url.v4}/vis/ump/clue/pool#/detail/${clueId}`;
        store.getDetail();
      })
      .catch(() => {});
  }, [clueId]);

  // 转让线索弹窗
  const onTransferClue = useCallback(() => {
    const dialogRef = openDialog(TransferCluesDialog, {
      dialogId: TransferCluesDialogID,
      title: '转让线索',
      data: {
        clueIds: [clueId],
      },
      style: {
        width: '500px',
      },
    });

    dialogRef
      .afterClosed()
      .then(() => {
        location.href = `${_global.url.v4}/vis/ump/clue/all#/detail/${clueId}`;
        store.getDetail();
      })
      .catch(() => {});
  }, [clueId]);

  // 删除线索弹窗
  const deleteClues = useCallback(() => {
    const dialogRef = openDialog(DeleteClueDialog, {
      dialogId: DeleteDialogID,
      title: '删除线索',
      data: {
        clueIds: [clueId],
        hasLaterAlloc: false,
      },
      style: {
        width: '468px',
      },
    });
    dialogRef
      .afterClosed()
      .then(() => {
        location.href = `${_global.url.v4}/vis/ump/clue/recycle#/detail/${clueId}`;
        store.getDetail();
      })
      .catch(err => {
        if (err) {
          Notify.error(err);
        }
      });
  }, [clueId]);

  // 还原线索弹窗
  const restoreClues = useCallback(() => {
    const dialogRef = openDialog(RestoreClueDialog, {
      dialogId: RestoreDialogID,
      data: {
        clueIds: [clueId],
        hasBranch: false,
      },
      title: '还原线索',
      style: {
        width: '515px',
      },
    });

    dialogRef
      .afterClosed()
      .then(params => {
        if (params.restoreType === 0) {
          // 回到公海池
          location.href = `${_global.url.v4}/vis/ump/clue/pool#/detail/${clueId}`;
        } else {
          if (params.userId === window._global.userId) {
            // 回到我的线索
            location.href = `${_global.url.v4}/vis/ump/clue/mine#/detail/${clueId}`;
          } else {
            // 回到全部线索
            location.href = `${_global.url.v4}/vis/ump/clue/all#/detail/${clueId}`;
          }
        }
        store.getDetail();
      })
      .catch(err => {
        if (err) {
          Notify.error(err);
        }
      });
  }, [clueId]);

  // 永久删除线索弹窗
  const hardDeleteClues = useCallback(() => {
    Sweetalert.confirm({
      content: <p>永久删除后，线索将无法恢复，确定永久删除吗？</p>,
      title: '删除线索',
      confirmText: '确定',
      closeBtn: true,
      onConfirm: () => {
        return permanentlyDeleteCluesAPI([clueId]).then(data => {
          if (data.failedCount > 0) {
            Notify.error(
              `${data.successCount}条线索删除成功，${data.failedCount}条删除失败，请重新处理`,
            );
          } else {
            Notify.success('删除成功');
            location.href = `${_global.url.v4}/vis/ump/clue/recycle`;
          }
        });
      },
    });
  }, [clueId]);

  // 已被删除的线索，逻辑独立
  if (isDeleted) {
    // 总部不能还原或永久删除校区的线索，后端也做了限制
    if (isEduHqStore && storeState.kdtId !== window._global.kdtId) {
      return null;
    }

    return (
      <>
        <hr color="#EBEDF0" />
        <section className="clue-detail__panel__actions">
          <SamButton type="primary" name="还原" onClick={restoreClues}>
            还原
          </SamButton>
          <SamButton type="primary" name="永久删除" onClick={hardDeleteClues}>
            永久删除
          </SamButton>
        </section>
      </>
    );
  }

  return (
    <>
      {/* {(isOwner || owners.length === 0) && ()} */}
      <hr color="#EBEDF0" />
      <section className="clue-detail__panel__actions">
        {((isOwner && isOwnStore) || isShopAdmin) &&
          (owners.length > 0 && (
            <>
              <SamButton type="primary" name="转让" onClick={onTransferClue}>
                转让线索
              </SamButton>
              <SamButton type="primary" name="放弃" onClick={onGirveupClues}>
                放弃线索
              </SamButton>
            </>
          ))}
        {isOwnStore && owners.length === 0 && (
          <>
            <SamButton name="分配" type="primary" onClick={onDistributeClues}>
              分配跟进人
            </SamButton>
            <SamButton name="领取" type="primary" onClick={takeClues}>
              领取
            </SamButton>
            {storeState.phase === 7 && (
              <SamButton name="删除" type="primary" onClick={deleteClues}>
                删除
              </SamButton>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Actions;
