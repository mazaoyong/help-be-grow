import React, { Component } from 'react';
import { Form } from '@zent/compat';
import FilterSelectField from '../fields/FilterSelectField';
import { isKuaishouOrder } from '../utils';
import { getExpressData } from 'fns/fetch-express-info';
import { OrderContext } from '../order-context';
const { Field, FormInputField } = Form;

interface IProps {
  expressId: number | '';
  expressName: string;
  expressNo: string;
  onChange: (key: any, val: any) => void;
}

class ExpressSelection extends Component<IProps> {
  static contextType = OrderContext;

  optimizedExpressData: Array<{
    value: number;
    text: string;
  }>;

  constructor(props) {
    super(props);
    this.optimizedExpressData = getExpressData();
  }

  handleValueChange(key: string, val: number | string) {
    const { onChange } = this.props;
    onChange && onChange(key, val);
  }

  renderExpressCompany() {
    const { expressId } = this.props;
    return (
      <Field
        name="expressId"
        component={FilterSelectField}
        label="物流公司："
        width="260px"
        onChange={e => this.handleValueChange('expressId', e.target.value)}
        placeholder="请选择一个物流公司"
        filter={(item, keyword) => item.text.indexOf(keyword) > -1}
        data={this.optimizedExpressData}
        value={expressId}
        validations={{
          required: true,
          // @ts-ignore
          noEmpty(_, value) {
            return +value !== 0;
          },
        }}
        validationErrors={{
          required: '请选择物流公司',
          noEmpty: '请选择物流公司',
        }}
      />
    );
  }

  renderOtherExpress() {
    const { expressId, expressName } = this.props;
    return (
      // expressId 41 其他
      +expressId === 41 && (
        <FormInputField
          onChange={e => this.handleValueChange('expressName', e.target.value.trim())}
          name="expressName"
          label="快递名称："
          width="160px"
          value={expressName}
          validations={{
            required: true,
            noEmpty(_, value) {
              return value.trim() !== '';
            },
          }}
          validationErrors={{
            required: '请填写快递名称',
            noEmpty: '请填写正确的快递名称',
          }}
        />
      )
    );
  }

  renderExpressNo() {
    const { expressNo } = this.props;
    const { orderInfo } = this.context;
    return (
      <FormInputField
        onChange={e => this.handleValueChange('expressNo', e.target.value.trim())}
        name="expressNo"
        label="快递单号："
        width="260px"
        value={expressNo}
        placeholder="输入真实有效的快递单号"
        validations={{
          required: true,
          noEmpty(_, value) {
            return value.trim() !== '';
          },
          hasSpace: (_, value) => {
            return !/\s/.test(value);
          },
          kuaishouValid: (_, value) => {
            // 快手订单
            if (isKuaishouOrder(orderInfo)) {
              return /^[A-Za-z0-9]+$/.test(value);
            }
            return true;
          },
        }}
        validationErrors={{
          required: '请填写快递单号',
          noEmpty: '快递单号不能为空',
          hasSpace: '快递单号中不能输入空格',
          kuaishouValid: '快递单号格式错误，请重新输入',
        }}
      />
    );
  }

  render() {
    return (
      <div>
        {this.renderExpressCompany()}
        {this.renderOtherExpress()}
        {this.renderExpressNo()}
      </div>
    );
  }
}

export default ExpressSelection;
