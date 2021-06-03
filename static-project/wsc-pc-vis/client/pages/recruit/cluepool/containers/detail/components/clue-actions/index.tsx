import React, { useMemo, useCallback, useState } from 'react';
import { Dialog, Notify, Sweetalert } from 'zent';
import { Button as SamButton } from '@youzan/sam-components';

import { ShowWrapper } from 'fns/chain';
import { isEduHqStore, isEduSingleStore, isEduBranchStore, isEduShop } from '@youzan/utils-shop';
import { get } from 'lodash';

import store from '../../store';
import { Dialog as ebizDialog } from '@youzan/ebiz-components';
import DistributeCluesDialog from '../../../../components/distribute-clues-dialog';
import GiveupCluesDialog from '../../../../components/giveup-clue-dialog';
import TakeClueToHq from '../../../../components/take-clue-to-hq';
import DeleteClueDialog from '../../../../components/delete-clue-dialog';
import RestoreClueDialog from '../../../../components/restore-clue-dialog';

import { useWillUnmount } from '../../../../utils/hooks';
import { takeCluesAPI, createPreAppointmentForClue, permanentlyDeleteCluesAPI } from '../../../../api';
import DistributeCluesToSchoolDialog from '../../../../components/distribute-clues-to-school-dialog';
import openAddDialog from '../../../../components/add-dialog';
import { ChangeSource, openTransferClueDialog } from '@ability-center/clue';
import './styles.scss';
// import AuditionFreeTimeDialog from '../../../../components/audition-free-time-dialog';
import { makeAppointment } from '@ability-center/appointment';
import VersionWrapper from 'fns/version';
import getPath from '../../utils/get-path';
import { hashHistory } from 'react-router';
import { navigateToEnrollment, EnrollmentSource } from '@ability-center/assets';

const { closeDialog } = Dialog;
const { openDialog } = ebizDialog;
const DistributeCluesDialogID = 'DistributeCluesDialogID';
const GiveupCluesDialogID = 'GiveupCluesDialogID';

const TakeClueToHqID = 'TakeClueToHqID';
const AuditionDialogID = 'AuditionDialogID';
const DeleteDialogID = 'DeleteDialogID';
const RestoreDialogID = 'RestoreDialogID';
const HardDeleteDialogID = 'HardDeleteDialogID';
const path = getPath();

const Actions = ({ owners, clueId }) => {
  const storeState = store.useStoreState();
  const {
    source,
    identityNo
  } = storeState;
  const isOwner = useMemo(
    () => owners.filter(({ userId }) => userId === _global.userId).length > 0,
    [owners]
  );
  const isShopAdmin = useMemo(
    () =>
      storeState.kdtId === window._global.kdtId &&
      storeState.roleId === 1 &&
      storeState.owners.length > 0,
    [storeState]
  );

  // 线索是否属于总部
  const isOwnHq = useMemo(() => _global.shopInfo.rootKdtId === storeState.kdtId, [
    storeState.kdtId
  ]);

  // 是否属于当前用户店铺
  const isOwnStore = useMemo(() => _global.kdtId === storeState.kdtId, [storeState.kdtId]);
  const isDeleted = useMemo(() => storeState.phase === 8, [storeState.phase]);

  // 是否是系统来源
  const isSystemSource = useMemo<boolean>(() => !!source && +source.sourceType !== 2, [source]);

  const handleEdit = useCallback(() => {
    openAddDialog('mine', () => {
      store.updateStudent();
      store.getDetail();
    }, {
      clueId: clueId,
      isEdit: true,
      identityNo
    });
  }, [clueId, identityNo]);

  useWillUnmount(() => {
    closeDialog(DistributeCluesDialogID);
    closeDialog(GiveupCluesDialogID);
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
        clueIds: [clueId]
      },
      style: {
        width: '350px'
      }
    });

    dialogRef
      .afterClosed()
      .then(() => {
        if (path === 'pool') {
          hashHistory.push('/list');
          return;
        }
        location.href = `${_global.url.v4}/vis/edu/page/clue/all#/detail/${clueId}`;
        store.getDetail();
      })
      .catch(() => {});
  }, [clueId]);

  // 分配给其它校区
  const handleDistributeCluesToSchool = useCallback(() => {
    const dialogRef = openDialog(DistributeCluesToSchoolDialog, {
      dialogId: DistributeCluesDialogID,
      title: '分配给校区',
      data: {
        clueIds: [clueId]
      },
      style: {
        width: '350px'
      }
    });

    dialogRef
      .afterClosed()
      .then(() => {
        location.href = `${_global.url.v4}/vis/edu/page/clue/pool#/detail/${clueId}`;
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
        if (path === 'pool') {
          hashHistory.push('/list');
          return;
        }
        location.href = `${_global.url.v4}/vis/edu/page/clue/mine#/detail/${clueId}`;
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
        clueIds: [clueId]
      },
      style: {
        width: '450px'
      }
    });

    dialogRef
      .afterClosed()
      .then(() => {
        if (path === 'mine') {
          hashHistory.push('/list');
        } else {
          location.href = `${_global.url.v4}/vis/edu/page/clue/pool#/detail/${clueId}`;
          store.getDetail();
        }
      })
      .catch(() => {});
  }, [clueId]);

  // 转让线索弹窗
  const onTransferClue = useCallback(() => {
    const dialogRef = openTransferClueDialog(clueId);
    dialogRef
      .afterClosed()
      .then(() => {
        if (path === 'mine') {
          hashHistory.push('/list');
        } else {
          location.href = `${_global.url.v4}/vis/edu/page/clue/all#/detail/${clueId}`;
          store.getDetail();
        }
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
        hasLaterAlloc: false
      },
      style: {
        width: '468px'
      }
    });
    dialogRef
      .afterClosed()
      .then(() => {
        if (path === 'pool') {
          hashHistory.push('/list');
          return;
        }
        location.href = `${_global.url.v4}/vis/edu/page/clue/recycle#/detail/${clueId}`;
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
        hasBranch: false
      },
      title: '还原线索',
      style: {
        width: '515px'
      }
    });

    dialogRef
      .afterClosed()
      .then((params: any) => {
        // @see https://xiaolv.qima-inc.com/#/demand/search?show=true&ids=41862
        if (path === 'recycle') {
          hashHistory.push('/');
          return;
        }
        if (params.restoreType === 0) {
          // 回到公海池
          location.href = `${_global.url.v4}/vis/edu/page/clue/pool#/detail/${clueId}`;
        } else {
          if (params.userId === window._global.userId) {
            // 回到我的线索
            location.href = `${_global.url.v4}/vis/edu/page/clue/mine#/detail/${clueId}`;
          } else {
            // 回到全部线索
            location.href = `${_global.url.v4}/vis/edu/page/clue/all#/detail/${clueId}`;
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
              `${data.successCount}条线索删除成功，${data.failedCount}条删除失败，请重新处理`
            );
          } else {
            Notify.success('删除成功');
            location.href = `${_global.url.v4}/vis/edu/page/clue/recycle`;
          }
        }).catch(errMsg => {
          Notify.error(errMsg);
        });
      }
    });
  }, [clueId]);

  // 领取到总部
  const handleTakeToHq = useCallback(() => {
    const dialogRef = openDialog(TakeClueToHq, {
      dialogId: TakeClueToHqID,
      title: '领取到总部',
      data: {
        clueIds: [clueId]
      },
      style: {
        width: '450px'
      }
    });

    dialogRef
      .afterClosed()
      .then(() => {
        location.href = `${_global.url.v4}/vis/edu/page/clue/all#/detail/${clueId}`;
        store.getDetail();
      })
      .catch(() => {});
  }, [clueId]);

  const openChangeSourceDialog = () => {
    ChangeSource.open('修改来源', {
      clueId,
      identityNo,
      source,
      onAddSuccess: () => {
        store.updateStudent();
        store.getDetail();
      }
    });
  };

  const [preAppointmentLoading, setPreAppointmentLoading] = useState(false);

  // 办理试听
  const createPreAppointment = useCallback(() => {
    // const auditionSetting = storeState.auditionSetting;
    const dataItemInfo = storeState.attributes.map(
      ({ attributeId, attributeValue, attributesTitle, attributeType }) => ({
        itemId: attributeId,
        itemType: attributeType,
        itemName: attributesTitle,
        itemValue: attributeValue
      })
    );

    setPreAppointmentLoading(true);
    createPreAppointmentForClue({
      dataItemInfo,
      userId: storeState.userId || null,
      name: storeState.name,
      telephone: storeState.telephone,
      clueId
    })
      .then(data => {
        const { studentId, stuName } = data;
        makeAppointment.open({
          defaultData: {
            studentId,
            studentName: stuName,
            kdtId: storeState.kdtId
          },
          type: 'create-try',
          callback: () => {
            window.location.reload();
          }
        });
      })
      .catch(msg => {
        Notify.error(msg || '网络错误');
      })
      .finally(() => {
        setPreAppointmentLoading(false);
      });
  }, [storeState.attributes, storeState.name, storeState.telephone, storeState.userId, storeState.kdtId, clueId]);

  // 已被删除的线索，逻辑独立
  if (isDeleted) {
    // 总部不能还原或永久删除校区的线索，后端也做了限制
    if (isEduHqStore && storeState.kdtId !== window._global.kdtId) {
      return null;
    }

    return (
      <>
        <section className="clue-detail__actions">
          <SamButton name="还原" onClick={restoreClues}>
            还原
          </SamButton>
          <SamButton name="永久删除" onClick={hardDeleteClues}>
            永久删除
          </SamButton>
        </section>
      </>
    );
  }

  return (
    <>
      {/* {(isOwner || owners.length === 0) && ()} */}
      <section className="clue-detail__actions">
        {((isOwner && isOwnStore) || isShopAdmin) &&
          (owners.length > 0 && (
            <>
              { /* 微商城去掉办理试听和报名按钮 */ }
              <ShowWrapper isInStoreCondition={ isEduShop && !isEduHqStore}>
                <SamButton
                  type="primary"
                  name="办理试听"
                  loading={preAppointmentLoading}
                  onClick={createPreAppointment}
                >
                  办理试听
                </SamButton>
              </ShowWrapper>
              { /* 这两个条件已经限定在教育店铺了 */ }
              <ShowWrapper isInStoreCondition={isEduBranchStore || isEduSingleStore}>
                <VersionWrapper name="recruit-detail-action">
                  <SamButton
                    name="办理报名"
                    href={navigateToEnrollment({ clueId, source: EnrollmentSource.offline })}
                    target="_blank"
                  >
                    办理报名
                  </SamButton>
                </VersionWrapper>
              </ShowWrapper>
              {isOwnHq && (
                <ShowWrapper isInStoreCondition={isEduHqStore}>
                  <SamButton name="分配" type="primary" onClick={handleDistributeCluesToSchool}>
              分配给校区
                  </SamButton>
                </ShowWrapper>
              )}
              {isOwner &&
                isOwnStore &&
                !isDeleted &&
                (
                  <SamButton onClick={handleEdit}>
                    编辑
                  </SamButton>
                )}
              {!isOwner &&
                isShopAdmin &&
                !isDeleted &&
                (
                  <SamButton name="编辑" onClick={handleEdit}>
                    编辑
                  </SamButton>
                )}
              <SamButton name="转让" onClick={onTransferClue}>
                转让
              </SamButton>
              {
                !isSystemSource &&
                <SamButton name="编辑" onClick={openChangeSourceDialog}>
                  修改来源
                </SamButton>
              }
              <SamButton name="放弃" onClick={onGirveupClues}>
                放弃
              </SamButton>
            </>
          ))}
        {!isOwnHq && (
          <>
            <ShowWrapper isInStoreCondition={isEduHqStore}>
              <>
                <SamButton name="分配" type="primary" onClick={handleDistributeCluesToSchool}>
                  分配给其它校区
                </SamButton>
                <SamButton name="领取" onClick={handleTakeToHq}>
                  领取
                </SamButton>
              </>
            </ShowWrapper>
          </>
        )}
        {isOwnStore && owners.length === 0 && (
          <>
            <SamButton name="分配" type="primary" onClick={onDistributeClues}>
              分配
            </SamButton>
            <SamButton name="领取" onClick={takeClues}>
              领取
            </SamButton>
            {storeState.phase === 7 && (
              <SamButton name="删除" onClick={deleteClues}>
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
