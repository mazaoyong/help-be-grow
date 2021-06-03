import { Select } from '@zent/compat';
import React, { useCallback, useState, useEffect } from 'react';
import { Button, Notify } from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import cx from 'classnames';
import { findPagePowerStaffs, findTransferReasonPageByQueryAPI, transferCluesAPI } from '../../api';
import './style.scss';
import SamWrapper from '../sam-wrapper';

const { DialogFooter } = Dialog;
/**
 * 转让线索
 *
 * @param {import("@youzan/ebiz-components").IDialogChildrenProps} param
 * @return {JSX.Element}
 */
const TransferCluesDialog = ({ dialogref, data }) => {
  const { clueIds = [] } = data;
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [targetUserId, setTargetUserId] = useState(-1);
  const [reason, setReason] = useState(-1);
  const [targetOptions, setTargetOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);

  const handleRefreshStaffs = useCallback(() => {
    findPagePowerStaffs()
      .then(data => {
        setTargetOptions(data);
      })
      .catch(msg => {
        Notify.error(msg || '网络错误');
      });
  }, []);

  const handleRefreshReason = useCallback(() => {
    findTransferReasonPageByQueryAPI({
      query: {
        applyTransferClue: 1,
        applyGiveUpClue: 2,
        applyDeleteClue: 2,
      },
      pageRequest: {
        countEnabled: true,
        pageNumber: 1,
        pageSize: 10000,
      },
    })
      .then((res = {}) => {
        setReasonOptions(res.content || []);
      })
      .catch(msg => {
        Notify.error(msg || '网络错误');
      });
  }, []);

  const onSubmit = useCallback(() => {
    if (targetUserId === -1 || reason === -1) {
      setCheck(true);
      return;
    }

    setLoading(true);
    const selectedReason = reasonOptions.filter(({ reasonId }) => reasonId === reason)[0];
    transferCluesAPI({
      clueIds: clueIds,
      reason: selectedReason.reason,
      targetUserId,
    })
      .then(({ failedCount }) => {
        if (failedCount > 0) {
          Notify.error(`有${failedCount}条线索转让失败，请重新再试`);
        } else {
          Notify.success('转让成功');
        }
        dialogref.submit();
      })
      .catch(msg => {
        setLoading(false);
        Notify.error(msg || '转让失败');
      });
  }, [clueIds, dialogref, reason, reasonOptions, targetUserId]);

  const getWrapClassName = useCallback(
    error =>
      cx({
        'select-wrap': true,
        'has-error': check && error,
      }),
    [check],
  );

  useEffect(() => {
    handleRefreshReason();
    handleRefreshStaffs();
  }, [handleRefreshReason, handleRefreshStaffs]);

  return (
    <div className="transfer-dialog-content">
      <div className={getWrapClassName(targetUserId === -1)}>
        <label className="zent-form__control-label">
          <em className="zent-form__required">*</em>请选择接收人：
        </label>
        <Select
          data={targetOptions}
          optionValue="adminId"
          optionText="name"
          width="180px"
          value={targetUserId}
          onChange={(_, s) => {
            setCheck(false);
            setTargetUserId(s.value);
          }}
          filter={(item, keyword) => item.name.includes(keyword)}
        />
        {check && targetUserId === -1 && <p className="zent-form__error-desc">请选择接收人</p>}
      </div>
      <div className={getWrapClassName(reason === -1)}>
        <label className="zent-form__control-label">
          <em className="zent-form__required">*</em>转让原因：
        </label>
        <Select
          data={reasonOptions}
          width="180px"
          optionText="reason"
          optionValue="reasonId"
          value={reason}
          onChange={(_, s) => {
            setCheck(false);
            setReason(s.value);
          }}
        />
        <SamWrapper name="编辑转让">
          <div className="tags-dialog__link-group">
            <a onClick={handleRefreshReason}>刷新</a>
            <a href="/v4/vis/ump/clue/transfer" target="_blank" rel="noopener noreferrer">添加转让原因</a>
          </div>
        </SamWrapper>
        {check && reason === -1 && <p className="zent-form__error-desc">请选择转让原因</p>}
      </div>
      <DialogFooter>
        <Button onClick={() => dialogref.close()}>取消</Button>
        <Button type="primary" loading={loading} onClick={onSubmit}>
          保存
        </Button>
      </DialogFooter>
    </div>
  );
};

export default TransferCluesDialog;
