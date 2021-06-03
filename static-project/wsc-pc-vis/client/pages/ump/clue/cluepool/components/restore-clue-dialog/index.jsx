
import { Form } from '@zent/compat';
import React, { useCallback, useState, useEffect } from 'react';
import { Button, Notify, Radio } from 'zent';
import { Dialog } from '@youzan/ebiz-components';

import { findPagePowerStaffs, restoreCluesAPI } from '../../api';
import './style.scss';

const { FormRadioGroupField, FormSelectField, createForm } = Form;
const { DialogFooter } = Dialog;

const RestoreForm = ({ dialogref, data, handleSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [restoreType, setRestoreType] = useState(0);
  const [staffs, setStaffs] = useState([]);
  const { hasBranch, clueIds = [] } = data;

  // 获取员工列表
  const loadStaff = useCallback(() => {
    findPagePowerStaffs()
      .then(data => {
        const staffs = data.map(item => ({ value: item.adminId, text: item.name }));
        setStaffs(staffs);
      })
      .catch(err => {
        Notify.error(err);
      });
  }, []);

  useEffect(() => {
    loadStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRestoreTypeChange = useCallback(e => {
    setRestoreType(e.target.value);
  }, []);

  // 提交还原线索
  const onSubmit = useCallback(
    params => {
      if (clueIds.length === 0) {
        Notify.error('请至少选择一条线索');
        return;
      }
      setLoading(true);
      restoreCluesAPI(clueIds, params.restoreType, params.userId)
        .then(data => {
          if (data.failedCount > 0) {
            Notify.error(
              `${data.successCount}条线索还原成功，${data.failedCount}条还原失败，请重新处理`,
            );
          } else {
            if (hasBranch) {
              Notify.success(`成功还原${data.successCount}条总部线索，校区线索无法还原`);
            } else {
              Notify.success('还原成功');
            }
          }
          dialogref.submit(params);
        })
        .catch(err => {
          Notify.error(err);
          setLoading(false);
        });
    },
    [dialogref, hasBranch, clueIds],
  );

  return (
    <Form horizontal onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: 0 }}>
      <FormRadioGroupField
        name="restoreType"
        label="还原方式："
        required
        validations={{ required: true }}
        validationErrors={{ required: '请选择还原方式' }}
        value={restoreType}
        onChange={onRestoreTypeChange}
      >
        <Radio value={0}>进入公海池</Radio>
        <Radio value={1}>分配给员工</Radio>
      </FormRadioGroupField>
      {restoreType === 1 && (
        <FormSelectField
          name="userId"
          label="选择员工："
          required
          data={staffs}
          validations={{ required: true }}
          validationErrors={{ required: '请选择员工' }}
          filter={(item, keyword) => {
            return item.text.indexOf(keyword) > -1;
          }}
        />
      )}
      <DialogFooter>
        <Button onClick={() => dialogref.close()}>取消</Button>
        <Button type="primary" loading={loading} htmlType="submit">
          确定
        </Button>
      </DialogFooter>
    </Form>
  );
};

const WrappedForm = createForm()(RestoreForm);

const RestoreCluesDialog = props => {
  return (
    <div className="edu__clue-restore-clues-dialog">
      <WrappedForm {...props} />
    </div>
  );
};

export default RestoreCluesDialog;
