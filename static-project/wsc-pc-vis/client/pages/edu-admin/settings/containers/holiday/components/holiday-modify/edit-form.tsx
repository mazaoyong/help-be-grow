
import { Form } from '@zent/compat';
import React, { FormEventHandler, useState } from 'react';
import { Button } from 'zent';
import { date } from '@youzan/utils';
import './edit-form.scss';
import { CustomHolidayData } from '../../../../../api/holiday';

const { FormInputField, FormDateRangePickerField, createForm } = Form;

interface HolidayEditFormFields {
  name: string;
  daterange: [string, string];
}

export type SubmitFunction = (fields: HolidayEditFormFields, zentForm: any) => void | Promise<void>;

interface HolidayEditFormProps {
  onCancel: () => void;
  onSubmit: SubmitFunction;
  handleSubmit: (fn: SubmitFunction) => FormEventHandler<HTMLFormElement>;
  modifyItem?: CustomHolidayData;
  zentForm: any;
}

const today = date.getCurrentDay(new Date());

/** @fixme 当前zent版本7.0.0-next.39的Form的问题，createForm函数组件需要forwardRef传ref，等升级zent后用Form.useForm重构 */
const HolidayEditForm = React.forwardRef(
  function HolidayEditForm(
    { onCancel, onSubmit, handleSubmit, modifyItem, zentForm }: HolidayEditFormProps,
    ref: React.Ref<HTMLDivElement>
  ) {
    const [loading, setLoading] = useState(false);

    return (
      <div ref={ref}>
        <Form horizontal className="holiday__modify-form" onSubmit={ev => {
          ev.stopPropagation();
          handleSubmit(async (...args) => {
            setLoading(true);
            await onSubmit(...args);
            setLoading(false);
          })(ev);
        }}>
          <FormInputField
            name="name"
            label="节假日名称："
            required
            value={modifyItem ? modifyItem.name : ''}
            validations={{
              required: true,
              maxLength: 15,
            }}
            placeholder="15个字以内"
            validationErrors={{
              required: '请输入节假日名称',
              maxLength: '最多15个字',
            }}
            autoComplete="off"
          />
          <FormDateRangePickerField
            name="daterange"
            label="起止日期："
            min={today}
            required
            value={modifyItem
              ? [date.makeDateStr(modifyItem.startTime), date.makeDateStr(modifyItem.endTime)]
              : ['', '']}
            validations={{
              format(_, value) {
                return Array.isArray(value) && value.every(val => val.length > 0);
              },
            }}
            displayError={zentForm.isFormSubmitFail() && !!zentForm.getFieldError('daterange')}
            validateOnChange={zentForm.isFormSubmitFail()}
            validateOnBlur={false}
            validationErrors={{ format: '请输入起止日期' }}
          />
          <div className="holiday__modify-footer">
            <Button onClick={onCancel}>取消</Button>
            <Button loading={loading} type="primary" htmlType="submit">确定</Button>
          </div>
        </Form>
      </div>
    );
  }
);

export default createForm()(HolidayEditForm) as typeof React.PureComponent;
