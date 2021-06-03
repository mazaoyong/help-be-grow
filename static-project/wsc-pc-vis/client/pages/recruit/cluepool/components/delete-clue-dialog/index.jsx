import { Select } from '@zent/compat';
import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { hashHistory } from 'react-router';
import { Button, Notify } from 'zent';
import { isEduHqStore } from '@youzan/utils-shop';
import { Divider, BlankLink } from '@youzan/react-components';
import cx from 'classnames';
import { Dialog } from '@youzan/ebiz-components';
import { findTransferReasonPageByQueryAPI, deleteCluesAPI } from '../../api';
import './style.scss';

const { DialogFooter } = Dialog;

/**
 * 删除线索
 *
 * @param {import("@youzan/ebiz-components").IDialogChildrenProps} param -
 * @return {JSX.Element} -
 */
const GiveupCluesDialog = ({ dialogref, data }) => {
  const { clueIds = [], hasUnTreated = false } = data;
  // loading
  const [loading, setLoading] = useState(false);
  // 校验
  const [check, setCheck] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [reasonId, setReasonId] = useState(-1);
  const [options, setOptions] = useState([]);

  // 获取删除原因
  const loadOptions = useCallback(() => {
    return findTransferReasonPageByQueryAPI({
      query: {
        applyTransferClue: 2,
        applyDeleteClue: 1,
        applyGiveUpClue: 2,
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

  useEffect(() => {
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = useCallback(() => {
    if (reasonId === -1) {
      setCheck(true);
    } else {
      setLoading(true);
      deleteCluesAPI(clueIds, selected, reasonId)
        .then(({ failedCount, successCount }) => {
          if (failedCount > 0) {
            Notify.error(`有${failedCount}条线索删除失败，请重新再试`);
          } else {
            let noticeContent = '';
            if (hasUnTreated) {
              if (isEduHqStore) {
                noticeContent = `成功删除${successCount}条线索，待分配和校区线索无法删除`;
              } else {
                noticeContent = `成功删除${successCount}条线索，待分配线索无法删除`;
              }
            } else {
              noticeContent = '删除成功';
            }
            Notify.success(noticeContent);
            hashHistory.push('list');
          }
          dialogref.submit();
        })
        .catch(msg => {
          setLoading(false);
          Notify.error(msg || '删除线索失败');
        });
    }
  }, [clueIds, dialogref, hasUnTreated, selected, reasonId]);

  const wrapClassName = useMemo(
    () =>
      cx({
        'select-wrap': true,
        'has-error': check,
      }),
    [check],
  );

  const refresh = useCallback(() => {
    loadOptions().then(() => {
      Notify.success('已刷新');
    });
  }, [loadOptions]);

  const items = [
    <BlankLink href={`${window._global.url.v4}/vis/edu/page/clue/transfer#/`} key={0}>
      新建
    </BlankLink>,
    <a href="javascript:;" key={1} onClick={refresh}>
      刷新
    </a>,
  ];

  return (
    <div className="dialog-content delete-content">
      <div className={wrapClassName}>
        <label className="zent-form__control-label" style={{ width: '85px' }}>
          <em className="zent-form__required">*</em>删除原因：
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
            setReasonId(s.reasonId);
          }}
        />
        <Divider items={items} />
        {check && <p className="zent-form__error-desc">请选择删除原因</p>}
      </div>
      <DialogFooter>
        <Button onClick={() => dialogref.close()}>取消</Button>
        <Button type="primary" loading={loading} onClick={onSubmit}>
          确定
        </Button>
      </DialogFooter>
    </div>
  );
};

export default GiveupCluesDialog;
