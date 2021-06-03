import React from 'react';
import { Form } from '@zent/compat';
import startsWith from 'lodash/startsWith';
import { TextField } from './fields';
import { IModel } from './type';

const { Field } = Form;
interface IProps {
  consigneeInfo: IModel['consignee_info'];
  distType: IModel['dist_type'];
  distTypeDesc: IModel['dist_type_desc'];
  selfFetchInfo: IModel['self_fetch'];
}

const DeliveryInfo = ({ distTypeDesc, consigneeInfo, selfFetchInfo, distType }: IProps) => {
  if (distType === 1 && selfFetchInfo) {
    return (
      <Field
        name="selffetch_info"
        label="自提信息"
        component={TextField}
        text={
          <div>
            <div className="info-row">
              自提人：{selfFetchInfo.user_name} {selfFetchInfo.user_tel}
            </div>
            <div className="info-row">自提时间：{selfFetchInfo.fetch_time}</div>
            <div>自提地址：{selfFetchInfo.fetch_address}</div>
          </div>
        }
      />
    );
  }

  // 收货地址不显示中国，https://jira.qima-inc.com/browse/CLOUDREQ-1817
  let address = consigneeInfo ? consigneeInfo.consignee_address : '';
  if (startsWith(address, '中国')) {
    address = address.slice(2);
  }

  return (
    <Field
      name="_goods"
      label="配送信息"
      component={TextField}
      text={
        <div>
          <div>配送方式：{distTypeDesc}</div>
          <div>
            收货人：
            {consigneeInfo && [consigneeInfo.consignee_name, consigneeInfo.consignee_tel].join(' ')}
          </div>
          <div>收货地址：{address}</div>
        </div>
      }
    />
  );
};

export default DeliveryInfo;
