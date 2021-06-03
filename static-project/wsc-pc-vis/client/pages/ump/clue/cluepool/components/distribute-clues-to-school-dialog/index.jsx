import { Select } from '@zent/compat';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Button, Notify } from 'zent';
import cx from 'classnames';
import { Dialog } from '@youzan/ebiz-components';
import { findListAllCampusAPI, distributeCluesAPI } from '../../api';
import './style.scss';

const { DialogFooter } = Dialog;
/**
 * 分配给校区
 *
 * @param {import("@youzan/ebiz-components").IDialogChildrenProps} param
 * @return {JSX.Element}
 */
const DistributeCluesToSchoolDialog = ({ dialogref, data }) => {
  const { clueIds = [] } = data;
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    findListAllCampusAPI()
      .then((res = []) => {
        setOptions(res);
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
        targetKdtId: selected,
      }).then(({ failedCount }) => {
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

  const wrapClassName = useMemo(() => (
    cx({
      'distrubute-wrap': true,
      'has-error': check,
    })
  ), [check]);

  const handleSelectChange = (value) => {
    setSelected(value);
    setCheck(false);
  };

  return (
    <div className="dialog-content">
      <div className={wrapClassName}>
        <label className="zent-form__control-label">
          <em className="zent-form__required">*</em>分配给校区：
        </label>
        <Select
          data={options}
          optionValue="kdtId"
          optionText="shopName"
          width="180px"
          value={selected}
          onChange={(_, s) => handleSelectChange(s.value)}
        />
        {check && <p className="zent-form__error-desc" style={{ marginLeft: '85px' }}>请选择校区</p>}
      </div>
      <DialogFooter>
        <Button onClick={() => dialogref.close()}>取消</Button>
        <Button type="primary" loading={loading} onClick={onSubmit}>保存</Button>
      </DialogFooter>
    </div>
  );
};

export default DistributeCluesToSchoolDialog;
