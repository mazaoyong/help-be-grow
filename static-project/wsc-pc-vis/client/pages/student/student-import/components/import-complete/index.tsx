import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { hashHistory, withRouter, WithRouterProps } from 'react-router';
import { Button, Icon, Notify, Dialog } from 'zent';
import { Dialog as EbizDialog } from '@youzan/ebiz-components';
import get from 'lodash/get';

import { findTaskProgress } from '../../api/import';
import { getByTaskId, prepareReimport } from '../../api/result';
import PollingDialog from '../polling-dialog';
import { dialogIdMap, IMPORT_TYPE } from '../../constants';
import './styles.scss';

const { openDialog: openEbizDialog } = EbizDialog;
const { closeDialog } = Dialog;

const ImportComplete: FC<WithRouterProps> = props => {
  const [taskId, setTaskId] = useState<number>();
  const [failCount, setFailCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [branchKdtId, setBranchKdtId] = useState(0);
  const [importType, setImportType] = useState(IMPORT_TYPE.byCourse);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (!(props.params && props.params.id) || !(props.location)) return;

    const branchKdtId = get(props.location, 'query.kdtId');
    setTaskId(Number(props.params.id));
    setBranchKdtId(branchKdtId);

    getByTaskId({ taskId: Number(props.params.id) })
      .then(res => {
        const { importStage, importType, expectRowNum, failedRowNum } = res;
        if (importStage !== 60 && importStage !== 1 && importStage !== 2) {
          hashHistory.push('list');
          return;
        }
        setImportType(importType);
        setTotal(expectRowNum);
        setFailCount(failedRowNum);
      })
      .catch(e => {
        Notify.error(e || '获取任务信息失败，请稍后刷新重试');
        hashHistory.push('list');
      });

    return () => {
      closeDialog(dialogIdMap.reimport);
    };
  }, [props.params, props.location]);

  const handleReimport = useCallback(() => {
    setBtnLoading(true);
    prepareReimport({ taskId })
      .then(() => {
        const dialogId = dialogIdMap.reimport;
        openEbizDialog(PollingDialog, {
          dialogId,
          className: 'polling-dialog-wrapper',
          style: { minWidth: '280px' },
          mask: true,
          closeBtn: false,
          maskClosable: false,
          data: {
            pollingRequest: findTaskProgress,
            requestParams: {
              query: [{
                taskId,
                importStage: 30, // 校验中
              }],
            },
            quant: failCount,
            nextPage: `add${taskId ? `/${taskId}` : ''}/step=2?error=1&type=${importType}${branchKdtId ? `&kdtId=${branchKdtId}` : ''}`,
            type: '校验',
          }
        });
      })
      .catch(e => {
        Notify.error(e || '网络错误，请稍后重试');
      })
      .finally(() => {
        setBtnLoading(false);
      });
  }, [taskId, importType, failCount, branchKdtId]);

  const text = useMemo(() => (
    <div className="import-complete-text">
      {failCount
        ? <>
          <span>本次导入{total}条学员数据，{total - failCount > 0 ? `${total - failCount}条导入成功，` : null}{failCount}条导入失败。</span>
          <span>可点击重新导入失败数据，查看导入失败的数据和失败原因，调整后重新导入</span>
        </>
        : <span>本次成功导入{total - failCount}条学员数据</span>
      }
    </div>
  ), [total, failCount]);

  const actionButton = useMemo(() => (
    <div className="import-complete-button">
      {failCount
        ? <Button
          type="primary"
          onClick={handleReimport}
          loading={btnLoading}
        >重新导入失败数据</Button>
        : <Button
          type="primary"
          onClick={() => { window.open(`https://www.youzan.com/v4/vis/edu/page/stuimport#/record/${taskId}?type=${importType}`, '_blank'); }}
        >查看导入记录</Button>
      }
    </div>
  ), [failCount, taskId, importType, btnLoading, handleReimport]);

  const bottomActions = useMemo(() => {
    if (failCount === total) return;
    return (
      <div className="import-complete-bottomactions">
        {failCount
          ? <span
            className="action"
            onClick={() => { window.open(`https://www.youzan.com/v4/vis/edu/page/stuimport#/record/${taskId}?type=${importType}`, '_blank'); }}
          >查看导入记录</span>
          : null
        }
        <span
          className="action"
          onClick={() => { hashHistory.push(`add/step=1`); }}
        >继续导入</span>
      </div>
    );
  }, [total, failCount, taskId, importType]);

  return (
    <div className="import-complete-page">
      <Icon type="check-circle" />
      <span className="title">导入完成</span>
      {text}
      {actionButton}
      {bottomActions}
    </div>
  );
};

export default withRouter<{}, {}>(ImportComplete);
