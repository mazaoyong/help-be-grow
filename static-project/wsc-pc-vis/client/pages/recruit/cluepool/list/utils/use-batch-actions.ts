import React from 'react';
import { Notify } from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import { isEduHqStore } from '@youzan/utils-shop';
import { IListContext } from '@youzan/ebiz-components/es/types/easy-list';

import { takeCluesAPI, IPartialFindAllResponse } from '../../api/list';
import { IMethodsProxy } from './use-batch-components';
import { CluePageType } from './use-fetch-list';

import TakeClueToHq from '../../components/take-clue-to-hq';
import DeleteClues from '../../components/delete-clue-dialog';
import AbandonClues from '../../components/giveup-clue-dialog';
import DistributeClues from '../../components/distribute-clues-dialog';
import openTransferClueDialog from '../../components/transfer-clue-dialog';
import DistributeClue2School from '../../components/distribute-clues-to-school-dialog';

const isAdmin = window._global.userRoleId === 1;
const { openDialog } = Dialog;

interface IUseBatchActions {
  pageType: CluePageType;
  listContext: React.MutableRefObject<IListContext | null>;
}
type UseBatchActionReturnType = IMethodsProxy<IPartialFindAllResponse, CluePageType>;

/**
 * @author chenzihao
 * @description
 * 这个`custom hook`主要用于根据一些必要的入参，生成线索列表页会用到的一些方法
 * 代替原有页面中的`useCallback`来包裹申明的方法，思路类似于redux集中声明actions，
 * 修改以下文件需要遵循一下规范：
 * 1. 尽量不要修改原有的方法（如果需要修复bug的情况除外）
 * 2. 新功能应该是一个新的方法
 * 3. 所有的方法都应该被`useCallback`包裹，**且`deps`一般情况下允许自己声明**
 * 4. 每个方法，请简单说明下这个方法的用途
 * @param {IUseBatchActions} params 一些用声明方法所必须的入参
 * @return {UseBatchActionReturnType}
 */
const useBatchActions = (params: IUseBatchActions): UseBatchActionReturnType => {
  const { pageType, listContext } = params;

  // 刷新列表和重置已经选择的选项
  const _refreshListAndResetSelectedRows = React.useCallback(() => {
    if (listContext.current) {
      listContext.current.action.refresh();
      listContext.current.globalState.selectedRowKeys = [];
    }
  }, [listContext]);
  // 处理错误的时候的Notify
  const _handleError = React.useCallback((err: Error) => {
    if (err) {
      Notify.error(err);
    }
  }, []);

  // 领取线索到总部
  const masterTakeClue2Hq = React.useCallback(
    (selectedData: IPartialFindAllResponse[]) => {
      openDialog(TakeClueToHq, {
        dialogId: 'takeHq',
        title: '领取到总部',
        data: {
          clueIds: selectedData.map((data) => data.clueId),
        },
        style: {
          width: '450px',
        },
      })
        .afterClosed()
        .then(_refreshListAndResetSelectedRows)
        .catch(_handleError);
    },
    [_handleError, _refreshListAndResetSelectedRows],
  );

  // 总部分配线索
  const masterDistributeClue = React.useCallback(
    (selectedData: IPartialFindAllResponse[]) => {
      openDialog(DistributeClue2School, {
        dialogId: 'distributeSchool',
        title: '分配给校区',
        data: {
          clueIds: selectedData.map((data) => data.clueId),
        },
        style: {
          width: '350px',
        },
      })
        .afterClosed()
        .then(_refreshListAndResetSelectedRows)
        .catch(_handleError);
    },
    [_handleError, _refreshListAndResetSelectedRows],
  );

  // 校区单店领取线索
  const takeClue = React.useCallback(
    (selectedData: IPartialFindAllResponse[]) => {
      const clueIds = selectedData.map((data) => data.clueId);
      takeCluesAPI(clueIds)
        .then(({ failedCount }) => {
          _refreshListAndResetSelectedRows();
          if (failedCount && failedCount > 0) {
            Notify.error(`有${failedCount}条线索领取失败，请重新再试`);
          } else {
            Notify.success('领取成功！请进入我的线索查看');
          }
        })
        .catch(_handleError);
    },
    [_handleError, _refreshListAndResetSelectedRows],
  );

  // 校区单店分配线索
  const distributeClue = React.useCallback(
    (selectedData: IPartialFindAllResponse[]) => {
      openDialog(DistributeClues, {
        dialogId: 'distribute',
        title: '分配线索',
        data: {
          clueIds: selectedData.map((data) => data.clueId),
        },
        style: {
          width: '350px',
        },
      })
        .afterClosed()
        .then(_refreshListAndResetSelectedRows)
        .catch(_handleError);
    },
    [_handleError, _refreshListAndResetSelectedRows],
  );

  // 将入参中的线索中自己的线索过滤出来
  const _filterOwnClues = React.useCallback(
    (clues: IPartialFindAllResponse[]) => {
      const needCheck = pageType === 'all';
      const clueIds = clues.map((item) => item.clueId);
      let ownClueIds: number[] = [];
      let hasTip = false;

      if (!isAdmin && needCheck) {
        const userId = window._global.userId;
        ownClueIds = clues
          .filter((item) => {
            return item.owners.length > 0 && item.owners[0].userId === userId;
          })
          .map((item) => item.clueId);
        if (ownClueIds.length === 0) {
          Notify.error('没有找到属于自己的线索，请重新选择');
          return;
        }
        if (ownClueIds.length !== clueIds.length) {
          hasTip = true;
          return { clueIds: ownClueIds, hasTip };
        }
      }
      return { clueIds, hasTip };
    },
    [pageType],
  );

  // 转移线索
  const transferClue = React.useCallback(
    (selectedData: IPartialFindAllResponse[]) => {
      const res = _filterOwnClues(selectedData);
      if (!res) return;

      const { clueIds, hasTip } = res;
      openTransferClueDialog(clueIds, true, hasTip)
        .afterClosed()
        .then(_refreshListAndResetSelectedRows)
        .catch(_handleError);
    },
    [_filterOwnClues, _handleError, _refreshListAndResetSelectedRows],
  );

  // 放弃线索
  const abandonClue = React.useCallback(
    (selectedData: IPartialFindAllResponse[]) => {
      const res = _filterOwnClues(selectedData);
      if (!res) return;

      const { clueIds, hasTip } = res;
      openDialog(AbandonClues, {
        dialogId: 'giveup',
        title: '放弃线索',
        data: {
          clueIds,
          multi: true,
          hasNoRight: hasTip,
        },
        style: {
          width: '450px',
        },
      })
        .afterClosed()
        .then(_refreshListAndResetSelectedRows)
        .catch(_handleError);
    },
    [_filterOwnClues, _handleError, _refreshListAndResetSelectedRows],
  );

  // 删除线索
  const deleteClue = React.useCallback(
    (selectedData: IPartialFindAllResponse[]) => {
      const allowList = selectedData.filter(
        (item) => item.phase === 7 && item.kdtId === window._global.kdtId,
      );

      if (allowList.length === 0) {
        if (isEduHqStore) {
          Notify.error('待分配或校区线索无法删除');
        } else {
          Notify.error('待分配线索无法删除，请选择已放弃线索');
        }
        return;
      }

      // 对既不是待分配线索也不是校区线索的线索做处理
      const clueIds = allowList.map((item) => item.clueId);
      openDialog(DeleteClues, {
        dialogId: 'deleteClues',
        title: '删除线索',
        data: {
          clueIds,
          hasUnTreated: allowList.length < selectedData.length,
        },
        style: {
          width: '468px',
        },
      })
        .afterClosed()
        .then(_refreshListAndResetSelectedRows)
        .catch(_handleError);
    },
    [_handleError, _refreshListAndResetSelectedRows],
  );

  const actions = React.useMemo<UseBatchActionReturnType>(
    () => ({
      masterTakeClue2Hq,
      masterDistributeClue,
      takeClue,
      distributeClue,
      transferClue,
      abandonClue,
      deleteClue,
    }),
    [
      abandonClue,
      deleteClue,
      distributeClue,
      masterDistributeClue,
      masterTakeClue2Hq,
      takeClue,
      transferClue,
    ],
  );

  return actions;
};

export default useBatchActions;
