import React from 'react';
import { Button, Form, FormStrategy, FormInputField, Notify } from 'zent';
import * as api from '../../../../../api/index';

import './styles.scss';

interface IProps {
  onCancelClick: () => void;
  params: {
    deliveryChannel: number;
    appId: string;
    isCloudTag: boolean;
  };
  onSubmit: () => Promise<any>;
}

function BindShopForm(props: IProps) {
  const form = Form.useForm(FormStrategy.View);

  const asyncValidator = Form.createAsyncValidator((value: string) => {
    const { params } = props;
    return new Promise(resolve =>
      api
        .saveOrUpdateBandShop({
          ...params,
          shopId: value,
        })
        .then(data => {
          if (!data) {
            // 表单校验组件resolve标红
            resolve({
              name: 'async',
              message: '该商户下无此门店编号，请检查后重试',
            });
          } else {
            resolve(null);
          }
        })
        .catch(e => {
          Notify.error(e);
        }),
    );
  });

  return (
    <Form form={form} className="bind-shop-form" layout="horizontal" onSubmit={props.onSubmit}>
      <FormInputField
        name="shopid"
        label="门店编号："
        helpDesc="请输入需要绑定的达达门店编号。编号可进入达达“管理中心 - 商户中心 - 门店管理”中查看。"
        required
        validateOccasion={0}
        validators={[asyncValidator]}
        className="bind-shop-input-field"
      />
      <div className="zent-form-actions form-action">
        <Button type="primary" htmlType="submit">
          确定
        </Button>
        <Button onClick={props.onCancelClick}>取消</Button>
      </div>
    </Form>
  );
}

export default BindShopForm;
