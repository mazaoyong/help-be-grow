import { Pop } from '@zent/compat';
import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { Dialog, Button, Notify } from 'zent';
import { dialogIdMap, estimateValidateTime } from '../../constants';
import { Operations } from '@youzan/react-components';
import { get } from 'lodash';

import { batchDeleteRequest } from './requests';
import { IRowFieldMap } from '../../types';

import DuplicateList from '../duplicate-list';
import ConflictList from '../conflict-list';

const { openDialog, closeDialog } = Dialog;

function isConflictItem(item) {
  return get(item, 'row.rowValidateInfos[0].validateCode') === 102003;
}

export default function useColumns({
  importType,
  taskId,
  branchKdtId,
  getPageValidateSummary,
  open,
  upsertDialogOpen,
  setUpsertDialogOpen,
  columns,
  studentProfile,
  areaOptions,
}) {
  // 弹窗
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState<boolean>(false);
  const [conflictDialogOpen, setConflictDialogOpen] = useState<boolean>(false);

  // 查看重复数据
  const inspectDuplicated = useCallback(
    (dataSignCode: string) => {
      if (!taskId || !importType || duplicateDialogOpen) return;
      setDuplicateDialogOpen(true);
      const dialogId = dialogIdMap.duplicateList;
      openDialog({
        dialogId,
        title: `查看相同数据`,
        className: 'duplicate-data-dialog',
        children: (
          <DuplicateList
            dataColumns={columns}
            taskId={taskId}
            dataSignCode={dataSignCode}
            importType={importType}
            upsertDialogOpen={upsertDialogOpen}
            setUpsertDialogOpen={setUpsertDialogOpen}
            branchKdtId={branchKdtId}
            studentProfile={studentProfile}
            areaOptions={areaOptions}
          />
        ),
        footer: (
          <div>
            <Button type="primary" onClick={() => closeDialog(dialogId)}>
              返回列表
            </Button>
          </div>
        ),
        onClose: () => {
          getPageValidateSummary({ taskId });
          setDuplicateDialogOpen(false);
        },
      });
    },
    [
      taskId,
      importType,
      duplicateDialogOpen,
      columns,
      upsertDialogOpen,
      setUpsertDialogOpen,
      branchKdtId,
      studentProfile,
      getPageValidateSummary,
      areaOptions,
    ],
  );

  // 查看冲突数据
  const inspectConflict = useCallback(
    (dataSignCode: string, rowId: number) => {
      if (!taskId || !importType || conflictDialogOpen) return;
      setConflictDialogOpen(true);
      const dialogId = dialogIdMap.conflictList;
      openDialog({
        dialogId,
        title: `查看冲突数据`,
        children: (
          <ConflictList
            dataColumns={columns}
            taskId={taskId}
            dataSignCode={dataSignCode}
            importType={importType}
            upsertDialogOpen={upsertDialogOpen}
            setUpsertDialogOpen={setUpsertDialogOpen}
            branchKdtId={branchKdtId}
            rowId={rowId}
            studentProfile={studentProfile}
            areaOptions={areaOptions}
          />
        ),
        footer: (
          <div>
            <Button type="primary" onClick={() => closeDialog(dialogId)}>
              返回列表
            </Button>
          </div>
        ),
        onClose: () => {
          getPageValidateSummary({ taskId });
          setConflictDialogOpen(false);
        },
      });
    },
    [
      taskId,
      importType,
      conflictDialogOpen,
      columns,
      upsertDialogOpen,
      setUpsertDialogOpen,
      branchKdtId,
      studentProfile,
      areaOptions,
      getPageValidateSummary,
    ],
  );

  // 删除
  const handleDelete = useCallback(
    (id: number) => {
      if (!taskId) {
        Notify.error('未选择导入任务');
        return;
      }
      return batchDeleteRequest({
        rowIds: [id],
        taskId,
      })
        .then(res => {
          if (res) {
            const { failCount = 0, successCount = 0 } = res;
            return new Promise(resolve =>
              setTimeout(() => {
                if (successCount === 1) {
                  Notify.success(`删除成功`);
                } else if (failCount === 1) {
                  Notify.error('删除失败');
                }
                getPageValidateSummary({ taskId });
                resolve(null);
              }, estimateValidateTime),
            );
          }
        })
        .catch(e => {
          Notify.error(e || '删除失败，请稍后重试');
        });
    },
    [taskId, getPageValidateSummary],
  );

  const { totalColumns, dataColumns } = useMemo(() => {
    let dataColumns = columns;
    const totalColumns = dataColumns.concat({
      title: '操作',
      name: 'operation',
      width: 200,
      fixed: 'right',
      textAlign: 'right',
      bodyRender: item => {
        let errCount = 0;
        let errText: string | ReactElement = '';
        for (let field of Object.values(item.rowFieldMap) as IRowFieldMap[]) {
          if (field && field.rowFieldValidateInfo) {
            errCount++;
          }
        }
        if (errCount > 0) {
          errText = <span className="list-error-msg">{`${errCount}处错误，请修改`}</span>;
        } else {
          const { row } = item;
          const validateInfoArr = get(row, 'rowValidateInfos') || [];
          const errMsg = validateInfoArr.map(item => item.message).join(';'); // 现只有一个字段

          if (validateInfoArr.some(item => item.validateCode === 102001)) {
            // 相同数据
            errText = <span className="list-error-msg">本次导入存在相同数据</span>;
          } else if (isConflictItem(item)) {
            errText = <span className="list-warn-msg">与已存在学员数据冲突</span>;
          } else {
            errText = <span className="list-error-msg">{errMsg}</span>;
          }
        }
        const operationList = [
          <span
            key="modify"
            className="action"
            onClick={() => open('修改', item.taskId, item.row.rowId, item)}
          >
            修改
          </span>,
          <Pop
            key="delete"
            className="pop-delete-confirm action"
            position="top-right"
            trigger="click"
            content={<p>删除后将不可恢复，确定删除？</p>}
            confirmText="确定"
            cancelText="取消"
            onConfirm={() => handleDelete(item.id)}
          >
            <span className="action">删除</span>
          </Pop>,
        ];
        if (isConflictItem(item)) {
          operationList.push(
            <span
              key="check-inspectConflict"
              className="action"
              onClick={() => inspectConflict(item.dataSignCode, item.row.rowId)}
            >
              查看冲突数据
            </span>,
          );
        } else if (get(item, 'row.rowValidateInfos[0].validateCode') === 102001) {
          operationList.push(
            <span
              key="check-duplicate"
              className="action"
              onClick={() => inspectDuplicated(item.dataSignCode)}
            >
              查看相同数据
            </span>,
          );
        }

        return (
          <div className="upload-confirm-list-operations">
            <Operations items={operationList} />
            {errText}
          </div>
        );
      },
    });

    return { totalColumns, dataColumns };
  }, [columns, handleDelete, inspectConflict, inspectDuplicated, open]);

  return { columns: totalColumns, dataColumns };
}
