import React, { FC, useState, useEffect, useCallback } from 'react';
import { Button, InlineLoading, Notify, Dialog } from 'zent';
import { Dialog as EbizDialog } from '@youzan/ebiz-components';
import { IDialogChildrenProps } from '@youzan/ebiz-components/es/types/dialog/types';
import { hashHistory } from 'react-router';

import { dialogIdMap } from '../../constants';
import './styles.scss';

type IdialogState = 0 | 1 | 2; // 0：初始状态，1：2秒后更换新弹窗，2：选择”继续等待“后
type IPollingDialogType = '导入' | '校验';

const { openDialog, closeDialog } = Dialog;
const { DialogBody } = EbizDialog;

const getEstTime = (quant: number, type: IPollingDialogType) => {
  // 每条数据校验/导入时间（秒）
  const pollingSecondMap = {
    导入: 0.5,
    校验: 0.1,
  };

  const unit = Math.ceil(1 / pollingSecondMap[type]) || 1; // 1秒钟能够校验/导入多少数据量
  const base = 12; // 导入完成后执行tsp任务的时间

  if (quant < (60 - base) * unit) {
    return `${Math.floor(quant / unit) + base}秒`;
  } else if (quant < unit * 60 * 60) { // 1小时内
    const newQuant = base * unit + quant; // 增加的tsp任务执行时间等价于增加的数据条数
    return `${Math.floor(newQuant / (60 * unit))}分${newQuant % (60 * unit)
      ? `${Math.floor((newQuant % (60 * unit)) / unit)}秒`
      : '钟'}`;
  } else {
    return '1小时';
  };
};

const PollingDialog: FC<IDialogChildrenProps<object | null, any>> = props => {
  const { data, dialogref } = props;
  const { pollingRequest, requestParams, nextPage, type = '校验', onReturn = () => {}, quant = 0 } = data;

  const [dialogState, setDialogState] = useState<IdialogState>(0);
  const [progress, setProgress] = useState<number>(0);

  let isPolling = false;

  useEffect(() => {
    setTimeout(() => {
      // 根据taskId发起一次查询请求
      pollingRequest(requestParams)
        .then(res => {
          // 单个任务请求结果
          if (res && Array.isArray(res) && res.length === 1) {
            const { progressValue, code, message } = res[0];
            if ([348402004, 348402005, 348402006].includes(code)) {
              Notify.error(message || '网络错误，请稍后重试');
              dialogref.close();
              return;
            }
            if (progressValue === 100) {
              dialogref.close();
              nextPage && hashHistory.push(nextPage);
            } else {
              setDialogState(1);
              setProgress(progressValue);
            };
          }
        })
        .catch(e => {
          Notify.error(e || '网络错误，请稍后重试');
          dialogref.close();
        });
    }, 1500);

    return () => {
      isPolling = false;
      dialogref.close();
    };
  }, [pollingRequest, requestParams]);

  const polling = useCallback(() => {
    if (!isPolling) {
      return;
    }
    pollingRequest(requestParams)
      .then(res => {
        // 单个任务请求结果
        if (res && Array.isArray(res) && res.length === 1) {
          const { progressValue } = res[0];
          if (progressValue === 100) {
            dialogref.close();
            isPolling = false;
            nextPage && hashHistory.push(nextPage);
          } else {
            setProgress(progressValue);
            setTimeout(() => {
              polling();
            }, 2000); // 2秒间隔
          };
        }
      })
      .catch(e => {
        Notify.error(e || '网络错误，请稍后重试');
        dialogref.close();
      });
  }, [pollingRequest, requestParams, isPolling]);

  const onWaiting = useCallback(() => {
    setDialogState(2);
    isPolling = true;
    polling();
  }, [polling]);

  useEffect(() => {
    if (dialogState === 1) {
      const dialogId = dialogIdMap.confirmDialog;
      openDialog({
        dialogId,
        className: 'polling-confirm-wrapper',
        style: { minWidth: '280px' },
        title: '提示',
        children: <span className="desc">数据{type}预计需{getEstTime(quant, type)}，你可以继续等待，或返回列表后台为你持续{type}。</span>,
        footer: <>
          <Button onClick={() => {
            closeDialog(dialogId);
            dialogref.close();
            hashHistory.push('/list');
            onReturn();
          }}>
            返回列表
          </Button>
          <Button type="primary" onClick={() => {
            closeDialog(dialogId);
            onWaiting();
          }}>
            继续等待
          </Button>
        </>,
        onClose: () => {
          closeDialog(dialogId);
        },
        maskClosable: false,
      });
    }
    return () => {
      closeDialog(dialogIdMap.confirmDialog);
    };
  }, [dialogState, quant, type]);

  return (
    <div className="polling-dialog">
      <DialogBody>
        <InlineLoading loading icon="circle" iconSize={26} />
        <p className="progress-title">数据{type}中{dialogState === 2 ? `，已完成${progress}%。` : ''}</p>
        <p className="progress-text">关闭页面后，后台将继续进行校验</p>
      </DialogBody>
    </div>
  );
};

export default PollingDialog;
