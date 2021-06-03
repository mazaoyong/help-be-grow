import { Select } from '@zent/compat';
import React, { useCallback, useState, useMemo } from 'react';
import { Button, Notify, Radio } from 'zent';
import cx from 'classnames';
import { useDidMount } from '../../utils/hooks';
import { Dialog } from '@youzan/ebiz-components';
import { findPagePowerStaffs, distributeCluesAPI } from '../../api';
import './style.scss';

const RadioGroup = Radio.Group;
const { DialogFooter } = Dialog;

/**
 * 领取到总部
 *
 * @param {import("@youzan/ebiz-components").IDialogChildrenProps} param
 * @return {JSX.Element}
 */
const TakeClueToHq = ({ dialogref, data }) => {
  const { clueIds = [] } = data;
  // loading
  const [loading, setLoading] = useState(false);
  // 教验
  const [check, setCheck] = useState(false);
  const [receiveType, setReceiveType] = useState(0);
  const [staff, setStaff] = useState(-1);
  const [options, setOptions] = useState([]);

  // 获取店铺员工列表
  useDidMount(() => {
    findPagePowerStaffs(_global.shopInfo.rootKdtId)
      .then(data => {
        setOptions(data);
      }).catch(msg => {
        Notify.error(msg || '网络错误');
      });
  }, []);

  const onRadioChange = useCallback((evt) => {
    setReceiveType(evt.target.value);
    setCheck(false);
  }, []);

  const onSelectChange = useCallback((select) => {
    setStaff(select.value);
    setCheck(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (receiveType === 1 && staff === -1) {
      setCheck(true);
      return;
    }
    setLoading(true);
    const req = {
      clueIds: clueIds,
      targetKdtId: _global.kdtId,
      receiveType,
    };

    if (staff !== -1) {
      req.userId = staff;
    }

    distributeCluesAPI(req)
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
  }, [clueIds, dialogref, receiveType, staff]);

  const wrapClassName = useMemo(() => (
    cx({
      'content-wrap': true,
      'has-error': check,
    })
  ), [check]);

  return (
    <div className="dialog-content">
      <div className={wrapClassName}>
        <label className="zent-form__control-label"><em className="zent-form__required">*</em>选择分配方式：</label>
        <div className="radio-wrap">
          <RadioGroup value={receiveType} onChange={onRadioChange}>
            <Radio value={0}>分配到总部公海池</Radio>
            <div className="staff-box">
              <Radio value={1}>分配给总部员工</Radio>
              <Select
                data={options}
                optionValue="adminId"
                optionText="name"
                width="125px"
                placeholder="请选择员工"
                value={staff}
                onChange={(_, s) => onSelectChange(s)}
                filter={(item, keyword) => item.name.indexOf(keyword) > -1}
              />
            </div>
            {check && <p className="zent-form__error-desc has-error">请选择员工</p>}
          </RadioGroup>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => dialogref.close()}>取消</Button>
        <Button type="primary" loading={loading} onClick={onSubmit}>保存</Button>
      </DialogFooter>
    </div>
  );
};

export default TakeClueToHq;
