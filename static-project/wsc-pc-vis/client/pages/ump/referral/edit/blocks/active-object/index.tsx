import React from 'react';
import { FormRadioGroupField, Radio, Validators } from 'zent';
import { IFormCreatorConfig } from '@youzan/ebiz-components/es/types/easy-form-archive';
import { RefereeTypeEnum, ReferrerTypeEnum } from 'pages/ump/referral/types';

interface IActiveObjectProps {
  disabled: boolean;
}

const ActiveObject = (props: IActiveObjectProps): IFormCreatorConfig => {
  const { disabled } = props;

  return {
    keyName: 'active-object',
    component: ({ children }) => (
      <div className="form-block">
        <h2 className="new-title">活动对象</h2>
        {children}
      </div>
    ),
    children: [
      {
        label: '推荐人设置：',
        name: 'referrerType',
        type: 'field',
        required: true,
        component: FormRadioGroupField,
        props: () => ({
          props: {
            disabled,
          },
        }),
        children: [
          {
            component: (
              <>
                <div className="group-field-item">
                  <Radio value={ReferrerTypeEnum.UNLIMITED}>不限制</Radio>
                </div>
                <div className="group-field-item">
                  <Radio value={ReferrerTypeEnum.PURCHASED_STORE_GOODS}>
                    仅购买过店铺内课程的客户
                  </Radio>
                </div>
                <div className="group-field-item">
                  <Radio value={ReferrerTypeEnum.PURCHASED_EVENT_GOODS}>
                    仅购买过活动课程的客户
                  </Radio>
                </div>
              </>
            ),
          },
        ],
        defaultValue: ReferrerTypeEnum.UNLIMITED,
        validators: [Validators.required('请选择推荐人')],
      },
      {
        label: '被推荐人设置：',
        name: 'refereeType',
        type: 'field',
        required: true,
        props: () => ({
          props: {
            disabled,
          },
        }),
        component: FormRadioGroupField,
        children: [
          {
            component: (
              <>
                <div className="group-field-item">
                  <Radio value={RefereeTypeEnum.UNLIMITED}>不限制</Radio>
                </div>
                <div className="group-field-item">
                  <Radio value={RefereeTypeEnum.UNPURCHASED_STORE_GOODS}>
                    从未购买过店铺内课程的客户
                  </Radio>
                </div>
                <div className="group-field-item">
                  <Radio value={RefereeTypeEnum.UNPURCHASED_EVENT_GOODS}>
                    从未购买过活动课程的客户
                  </Radio>
                </div>
              </>
            ),
          },
        ],
        defaultValue: RefereeTypeEnum.UNPURCHASED_EVENT_GOODS,
        validators: [Validators.required('请选择被推荐人')],
      },
    ],
  };
};

export default ActiveObject;
