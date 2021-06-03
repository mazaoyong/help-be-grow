import { Select } from '@zent/compat';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Button, Notify } from 'zent';
import { Dialog } from '@youzan/ebiz-components';
import cx from 'classnames';

import { distributeCluesAPI, findPagePowerStaffs } from '../../api';
import './style.scss';

const { DialogFooter } = Dialog;

/**
 * 分配线索
 *
 * @param {import("@youzan/ebiz-components").IDialogChildrenProps} param
 * @return {JSX.Element}
 */
const DistributeCluesDialog = ({ dialogref, data }) => {
  const { clueIds = [] } = data;
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    findPagePowerStaffs()
      .then(data => {
        setOptions(data);
      }).catch(msg => {
        Notify.error(msg || '网络错误');
      });
  }, []);

  const onSubmit = useCallback(() => {
    if (selected === -1) {
      setCheck(true);
    } else {
      setLoading(true);
      distributeCluesAPI({
        clueIds: clueIds,
        userId: selected,
        targetKdtId: _global.kdtId,
        receiveType: 1,
      })
        .then(({ failedCount }) => {
          if (failedCount > 0) {
            Notify.error(`有${failedCount}条线索分配失败，请重新再试`);
          } else {
            Notify.success('分配成功');
          }
          dialogref.submit();
        })
        .catch(msg => {
          setLoading(false);
          Notify.error(msg || '分配失败');
        });
    }
  }, [clueIds, dialogref, selected]);

  const handleSelectChange = (value) => {
    setSelected(value);
    setCheck(false);
  };

  const wrapClassName = useMemo(() => (
    cx({
      'select-wrap': true,
      'has-error': check,
    })
  ), [check]);

  return (
    <div className="dialog-content">
      <div className={wrapClassName}>
        <label className="zent-form__control-label" style={{ width: '70px' }}><em className="zent-form__required">*</em>跟进人：</label>
        <Select
          data={options}
          optionValue="adminId"
          optionText="name"
          width="180px"
          value={selected}
          onChange={(_, s) => handleSelectChange(s.value)}
          filter={(item, keyword) => item.name.indexOf(keyword) > -1}
        />
        {check && <p className="zent-form__error-desc">请选择跟进人</p>}
      </div>
      <DialogFooter>
        <Button onClick={() => dialogref.close()}>取消</Button>
        <Button type="primary" loading={loading} onClick={onSubmit}>保存</Button>
      </DialogFooter>
    </div>
  );
};

export default DistributeCluesDialog;
