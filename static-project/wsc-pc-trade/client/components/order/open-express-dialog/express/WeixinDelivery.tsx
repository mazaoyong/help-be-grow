import React from 'react';
import { Form } from '@zent/compat';
import { BlankLink } from '@youzan/react-components';
import { WEIXIN_DELIVERY_HELPER } from '../const';
import { IWechatExpressWayBill, IWechatDeliveryExpress, BindStatus } from '../type';

const { FormSelectField } = Form;

interface IWeChatDeliveryProps {
  wechatExpressWayBill: IWechatExpressWayBill;
  availableWechatExpress: IWechatDeliveryExpress[];
  onChange: (val: IWechatExpressWayBill) => void;
}

interface ISelectItem {
  value: string;
  text: string;
}

interface IWeixinDeliveryState {
  expressId: number;
  accountNos: ISelectItem[];
  accountNo: string;
}

class WeixinDelivery extends React.Component<IWeChatDeliveryProps, IWeixinDeliveryState> {
  constructor(props) {
    super(props);
    this.state = {
      expressId: 0,
      accountNos: [],
      accountNo: '',
    };
  }
  handleExpressIdChanged = expressId => {
    const { availableWechatExpress, wechatExpressWayBill, onChange } = this.props;
    const accountNos: ISelectItem[] = [];
    let expressName = '';
    availableWechatExpress.forEach(express => {
      if (express.expressId === expressId) {
        expressName = express.expressName;
        const accounts = express.deliveryBindAccountDTOS || [];
        accounts.forEach(account => {
          const { provinceName, cityName, countyName, address } = account.addressDTO || {};
          const success = account.bindStatusCode === BindStatus.Success;
          if (provinceName && cityName && countyName && address && success) {
            accountNos.push({
              value: account.bindNo,
              text: `${provinceName}${cityName}${countyName}${address}`,
            });
          }
        });
      }
    });
    this.setState({ expressId, accountNos, accountNo: '' });
    onChange({ ...wechatExpressWayBill, expressId, expressName });
  };

  handlewaybillAccountNoChanged = accountNo => {
    const { wechatExpressWayBill, onChange } = this.props;
    this.setState({ accountNo });
    onChange({ ...wechatExpressWayBill, accountNo });
  };

  render() {
    const { availableWechatExpress } = this.props;
    const { expressId, accountNos, accountNo } = this.state;
    return (
      <div className="delivery-content">
        <div>
          <FormSelectField
            className="inline"
            name="expressCompany"
            label="快递公司："
            data={availableWechatExpress}
            value={expressId}
            onChange={this.handleExpressIdChanged}
            optionText="expressName"
            optionValue="expressId"
            validations={{ required: true }}
            validationErrors={{ required: '请选择快递公司' }}
          />
          <BlankLink href={WEIXIN_DELIVERY_HELPER}>去设置</BlankLink>
        </div>
        <div>
          <FormSelectField
            className="inline"
            autoWidth
            width="320px"
            name="accountNo"
            label="发货地址："
            data={accountNos}
            value={accountNo}
            onChange={this.handlewaybillAccountNoChanged}
            validations={{ required: true }}
            validationErrors={{ required: '请选择发货地址' }}
          />
        </div>
      </div>
    );
  }
}

export default WeixinDelivery;
