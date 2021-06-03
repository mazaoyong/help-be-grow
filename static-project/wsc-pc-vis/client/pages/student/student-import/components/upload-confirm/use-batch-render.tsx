import { Pop } from '@zent/compat';
import React, { useCallback } from 'react';
import { Button, Notify } from 'zent';
import { estimateValidateTime, estimateValidateTimePerData, IMPORT_TYPE } from '../../constants';
import BatchUpdateFooter from '../batch-update-footer';
import BatchUpdateFormFooter from '../batch-update-form-footer';
import { batchDeleteRequest } from './requests';

export default function useBatchRender({
  importType,
  taskId,
  selected,
  setSelected,
  branchKdtId,
  getPageValidateSummary,
  current,
  setCurrent,
  dataColumns,
}) {
  const onBatchDelete = useCallback(() => {
    if (!taskId) {
      Notify.error('未选择导入任务，请返回重试');
      return;
    }
    if (!selected || !selected.length) {
      Notify.error('请至少选择一条数据');
      return;
    }

    return batchDeleteRequest({
      rowIds: selected,
      taskId,
    })
      .then(res => {
        if (res) {
          const { failCount = 0, successCount = 0 } = res;
          return new Promise(resolve =>
            setTimeout(
              () => {
                if (!failCount) {
                  Notify.success(`批量删除成功`);
                } else if (!successCount) {
                  Notify.error('批量删除失败，请重新处理');
                } else {
                  Notify.error(`${successCount}条数据删除成功，${failCount}条删除失败，请重新操作`);
                }
                setSelected([]);

                if (current === 1) {
                  getPageValidateSummary({ taskId });
                } else {
                  setCurrent(1);
                }
                resolve(null);
              },
              selected.length > 3
                ? estimateValidateTimePerData * selected.length
                : estimateValidateTime,
            ),
          );
        }
      })
      .catch(e => {
        Notify.error(e || '网络错误，请稍后重试');
      });
  }, [taskId, selected, setSelected, current, getPageValidateSummary, setCurrent]);

  function renderFooter() {
    if (importType === IMPORT_TYPE.byStudentInfo) {
      return (
        <BatchUpdateFormFooter
          importType={importType}
          taskId={taskId || 0}
          selected={selected}
          setSelected={setSelected}
          getPageValidateSummary={getPageValidateSummary}
          branchKdtId={branchKdtId}
          columns={dataColumns}
        ></BatchUpdateFormFooter>
      );
    }
    return (
      <BatchUpdateFooter
        importType={importType}
        taskId={taskId || 0}
        selected={selected}
        setSelected={setSelected}
        getPageValidateSummary={getPageValidateSummary}
        branchKdtId={branchKdtId}
      />
    );
  }

  const batchComponent = () => (
    <>
      <span className="span-select-all">当前页全选</span>
      <span className="span-select-number">已选{selected.length || 0}项</span>
      <span className="span-label">批量操作</span>
      <Pop
        className="pop-delete-confirm"
        position="top-right"
        trigger="click"
        content={<p>删除后将不可恢复，确定删除？</p>}
        onConfirm={onBatchDelete}
      >
        <Button className="batch-delete">删除</Button>
      </Pop>
      {renderFooter()}
    </>
  );
  return { batchComponent };
}
