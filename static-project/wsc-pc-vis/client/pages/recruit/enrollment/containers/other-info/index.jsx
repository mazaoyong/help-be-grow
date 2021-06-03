
import { Form } from '@zent/compat';
import React, { useContext, useMemo } from 'react';
import useStaffList from '@ability-center/common/use-staff-list';
import useCurrentStaff from '@ability-center/common/use-current-staff';
import { Context as UserContext } from '../../contexts/user';

const { FormDatePickerField, FormInputField, FormSelectField } = Form;

const cur = Date.now();

export default function OtherInfo() {
  const [options] = useStaffList();
  const [staffInfo] = useCurrentStaff();

  const { state: userState } = useContext(UserContext);

  const seller = useMemo(() => ({
    sellerName: userState.item && userState.item.ownerName,
    sellerId: userState.item && userState.item.ownerId,
  }), [userState]);

  const orderMode = userState && userState.mode === 'order';

  return (
    <div>
      <FormDatePickerField
        name="orderSumbitDate"
        value={cur}
        label="收款日期："
        placeholder="请选择收款日期"
        autoComplete="off"
        valueType="number"
        helpDesc="如果是按收款后生效的课程，则从该收款日期开始算有效期"
        asyncValidation={(values, value) => {
          if (value) return Promise.resolve();
          return Promise.reject('请选择收款日期');
        }}
        width="180px"
      />
      <FormInputField
        name="cashierName"
        label="收银员："
        disabled={true}
        value={staffInfo.name}
        width="180px"
      />
      <FormSelectField
        name="seller"
        label="课程顾问："
        disabled={orderMode}
        placeholder="请选择"
        popupClassName="edu-enrollment-other-seller"
        filter={(item, keyword) => item.text.includes(keyword)}
        value={seller}
        data={options}
        width="180px"
      />
      <FormInputField
        name="comment"
        label="备注："
        type="textarea"
        width="275px"
        maxLength={200}
        showCount
      />
    </div>
  );
}
