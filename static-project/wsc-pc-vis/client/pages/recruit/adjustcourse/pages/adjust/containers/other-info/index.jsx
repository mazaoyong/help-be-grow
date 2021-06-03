import React from 'react';
import { Form } from '@zent/compat';
import useStaffList from '@ability-center/common/use-staff-list';
import useCurrentStaff from '@ability-center/common/use-current-staff';

const { FormDatePickerField, FormInputField, FormSelectField } = Form;

const cur = Date.now();

export default function OtherInfo({ prefixcls = '' }) {
  const [ staffList ] = useStaffList();
  const [ staffInfo ] = useCurrentStaff();

  return (
    <div>
      <FormDatePickerField
        name="operateDate"
        value={cur}
        label="办理日期："
        placeholder="请选择办理日期"
        autoComplete="off"
        valueType="number"
        helpDesc=""
        asyncValidation={(values, value) => {
          if (value) return Promise.resolve();
          return Promise.reject('请选择办理日期');
        }}
        width="180px"
      />
      <FormInputField
        name="cashierName"
        label="收银员："
        disabled={true}
        value={staffInfo.name || ''}
        width="180px"
      />
      <FormSelectField
        name="seller"
        label="课程顾问："
        placeholder="请选择"
        popupClassName={`${prefixcls}-other-field`}
        filter={(item, keyword) => item.text.includes(keyword)}
        data={staffList}
        width="180px"
      />
      <FormSelectField
        name="teacher"
        label="老师："
        placeholder="请选择"
        popupClassName={`${prefixcls}-other-field`}
        filter={(item, keyword) => item.text.includes(keyword)}
        data={staffList}
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
