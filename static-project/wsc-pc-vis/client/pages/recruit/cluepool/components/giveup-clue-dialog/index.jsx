import { Select } from '@zent/compat';
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { hashHistory } from 'react-router';
import { Button, Notify } from 'zent';
import cx from 'classnames';
import { Dialog } from '@youzan/ebiz-components';
import { findTransferReasonPageByQueryAPI, giveUpCluesAPI } from '../../api';
import './style.scss';
import SamWrapper from '../sam-wrapper';

const { DialogFooter } = Dialog;
/**
 * 放弃线索
 *
 * @param {import("@youzan/ebiz-components").IDialogChildrenProps} param
 * @return {JSX.Element}
 */
const GiveupCluesDialog = ({ dialogref, data }) => {
  const { clueIds = [], multi = false, hasNoRight = false } = data;
  // loading
  const [loading, setLoading] = useState(false);
  // 教验
  const [check, setCheck] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [options, setOptions] = useState([]);

  // 获取放弃原因
  const handleRefreshGiveUp = useCallback(() => {
    findTransferReasonPageByQueryAPI({
      query: {
        applyTransferClue: 2,
        applyDeleteClue: 2,
        applyGiveUpClue: 1,
      },
      pageRequest: {
        countEnabled: true,
        pageNumber: 1,
        pageSize: 10000,
      },
    })
      .then((res = {}) => {
        setOptions(res.content || []);
      })
      .catch(msg => {
        Notify.error(msg || '网络错误');
      });
  }, []);

  const onSubmit = useCallback(() => {
    if (selected === -1) {
      setCheck(true);
    } else {
      setLoading(true);
      // const selectedReason = options.filter(({ reasonId }) => reasonId === selected)[0];
      giveUpCluesAPI(clueIds, selected)
        .then(({ failedCount }) => {
          if (failedCount > 0) {
            Notify.error(`有${failedCount}条线索放弃失败，请重新再试`);
          } else {
            if (multi) {
              if (hasNoRight) {
                Notify.success(`已成功放弃${clueIds.length}条线索，无法放弃不属于自己的线索`);
              } else {
                Notify.success(`已成功放弃${clueIds.length}条线索`);
              }
            } else {
              Notify.success('放弃成功');
            }
            hashHistory.push('list');
          }
          dialogref.submit();
        })
        .catch(msg => {
          setLoading(false);
          Notify.error(msg || '放弃线索失败');
        });
    }
  }, [clueIds, dialogref, selected, multi, hasNoRight]);

  const wrapClassName = useMemo(
    () =>
      cx({
        'select-wrap': true,
        'has-error': check,
      }),
    [check],
  );

  useEffect(() => {
    handleRefreshGiveUp();
  }, [handleRefreshGiveUp]);

  return (
    <div className="dialog-content give-up-content">
      <div className={wrapClassName}>
        <label className="zent-form__control-label" style={{ width: '85px' }}>
          <em className="zent-form__required">*</em>放弃原因：
        </label>
        <Select
          width="180px"
          optionText="reason"
          optionValue="reason"
          data={options}
          value={selected}
          onChange={(_, s) => {
            setCheck(false);
            setSelected(s.value);
          }}
        />
        <SamWrapper name="编辑放弃">
          <div className="tags-dialog__link-group">
            <a onClick={handleRefreshGiveUp}>刷新</a>
            <a href="/v4/vis/edu/page/clue/transfer" target="_blank" rel="noopener noreferrer">添加放弃原因</a>
          </div>
        </SamWrapper>
        {check && <p className="zent-form__error-desc">请选择放弃原因</p>}
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

export default GiveupCluesDialog;
