import React from 'react';
import { Radio, Select, Notify } from 'zent';
import { Form } from '@zent/compat';
import { BlankLink } from '@youzan/react-components';
import find from 'lodash/find';
import { EXPRESS_WAY_BILL_TYPES, EXPRESS_WAY_BILL_TYPES_MAP, JD_EXPRESS_CODE } from '../const';
import api from '../api';
import { isWscChainStore } from '@youzan/utils-shop';
import {
  IDeliveryAddresses,
  IExpressCompany,
  IPrinter,
  IGetDepositExpressRes,
  IPickTime,
  IExpressWayBill,
} from '../type';

interface IPickDays {
  value: number;
  text: string;
}

interface IProps {
  orderNo: string;
  balanceValid: boolean;
  certValid: boolean;
  depositValid: boolean;
  exceptionInfo: {
    desc: string;
    code: number;
  };
  deposit: IGetDepositExpressRes;
  expressWayBill: IExpressWayBill;
  onChange: (val: IExpressWayBill) => void;
  expressCompanies: IExpressCompany[];
  printers: IPrinter[];
}

interface IState {
  selectedExpress: IExpressCompany;
  addresses: IDeliveryAddresses[];
  printers: [];
  expressFee: number;
}

const DISTRIBUTION_URL = '/v4/ump/logisticsService/serviceManage';
const RECHARGE_URL = '/v4/assets/recharge';
const DEPOSIT_URL = '/v2/trade/deposit/index';
const PRINTER_SETTING_URL = '/v4/setting/printer#/waybill';
const EXPRESS_WAY_BILL_OPEN_URL = '/v4/ump/electronWayBill';
const EXPRESS_WAY_BILL_BUY_URL = '/v2/appmarket/appdesc?id=16401';

const { FormSelectField, FormRadioGroupField, FormNumberInputField } = Form;

const EXPRESS_NEED_WEIGHT = [
  138, // 京东
];

const EXPRESS_SUPPORT_DETAIL_PICK_TIME = [
  7, // 顺丰
];

const prefixZero = (n: number) => {
  return `0${n}`.slice(-2);
};

class ExpressWayBill extends React.Component<IProps, IState> {
  pickDays: IPickDays[] | null = null;
  pickStart: number | null = null;
  pickTime: IPickTime | null = null;
  timeout: number | null = null;
  constructor(props) {
    super(props);
    this.state = {
      selectedExpress: {} as IExpressCompany,
      addresses: [],
      printers: [],
      expressFee: 0,
    };
  }

  componentDidMount() {
    this.setPickTime();
    const { expressWayBill } = this.props;
    const { expressId } = expressWayBill;
    if (expressId) {
      this.handleExpressIdChanged(expressId);
    }
  }

  setPickTime() {
    const pickDays = [
      {
        value: 0,
        text: '今天',
      },
      {
        value: 1,
        text: '明天',
      },
      {
        value: 2,
        text: '后天',
      },
    ];
    const currentHour = new Date().getHours();
    const end = 17;
    let start = currentHour < 9 ? 9 : currentHour + 1;
    if (start >= end) {
      pickDays.shift();
      start = 9;
    }
    this.pickDays = pickDays;
    this.pickStart = start;
    this.pickTime = {
      day: pickDays[0].value,
      time: start === end ? 9 : start,
    };
  }

  fetchAddressInfo(expressId: number) {
    api.getDeliveryAddresses({ expressId }).then(data => {
      this.setState({
        addresses: data,
      });
    });
  }

  fetchExpressFee = (weight: number) => {
    const { orderNo, expressWayBill } = this.props;
    const { expressId, auditNo } = expressWayBill;

    api
      .getDeliveryFee({
        distWeight: weight,
        orderNo,
        expressId,
        auditNo,
        deliveryType: 14,
      })
      .then(({ fee }) => {
        this.setState({
          expressFee: fee,
        });
        this.handleValueChange({
          expressFee: fee,
        });
      })
      .catch(() => {
        Notify.error('获取运费失败');
      });
  };

  handleValueChange(newValues: Partial<IExpressWayBill>) {
    const { onChange, expressWayBill } = this.props;
    onChange &&
      onChange({
        ...expressWayBill,
        ...newValues,
      });
  }

  handleExpressIdChanged(expressId: number) {
    const { expressCompanies } = this.props;
    const selectedExpress = find(expressCompanies, { expressId }) || ({} as IExpressCompany);
    this.fetchAddressInfo(expressId);
    this.setState({
      selectedExpress,
    });
    this.handleValueChange({
      expressWayBillType: selectedExpress.type,
      expressId: selectedExpress.expressId,
      expressName: selectedExpress.expressName,
      pickTime: this.pickTime!,
      isPay: selectedExpress.isPay,
    });
  }

  handlePickTimeChange(key: 'day' | 'time', val: number) {
    const { expressWayBill } = this.props;
    this.handleValueChange({
      pickTime: {
        ...expressWayBill.pickTime,
        [key]: val,
      },
    });
  }

  handleWeightChange = value => {
    const { selectedExpress } = this.state;
    const weight = +value * 1000;
    const isPay = selectedExpress.expressId && selectedExpress.isPay;
    this.handleValueChange({ weight });

    if (isPay) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = window.setTimeout(() => {
        this.fetchExpressFee(weight);
      }, 1000);
    }
  };

  renderExpressSelection() {
    const { expressCompanies, expressWayBill } = this.props;
    let filterExpressCompanies: IExpressCompany[] = expressCompanies;
    if (isWscChainStore) {
      filterExpressCompanies = filterExpressCompanies.filter(
        ({ expressId }) => expressId !== JD_EXPRESS_CODE,
      );
    }
    const { expressId } = expressWayBill;
    return (
      <div key="expressId">
        <FormSelectField
          className="inline"
          name="expressCompany"
          label="快递公司："
          data={filterExpressCompanies}
          value={expressId}
          onChange={val => this.handleExpressIdChanged(+val)}
          optionText="expressName"
          optionValue="expressId"
          validations={{ required: true }}
          validationErrors={{ required: '请选择快递公司' }}
        />
      </div>
    );
  }

  renderAddressSelection() {
    const {
      addresses,
      selectedExpress: { expressId },
    } = this.state;
    const addressesData = addresses
      ? addresses.map(item => {
          return {
            value: item.auditNo,
            text: `${item.provinceName} ${item.cityName} ${item.countyName} ${item.address}`,
          };
        })
      : [];

    return (
      <div key="address">
        <FormSelectField
          className="inline"
          autoWidth
          width="320px"
          name="expressAddress"
          label="发货地址："
          data={addressesData}
          onChange={val => this.handleValueChange({ auditNo: val })}
          validations={{ required: true }}
          validationErrors={{ required: '请选择发货地址' }}
        />
        <BlankLink href={DISTRIBUTION_URL}>
          {addressesData && addressesData.length === 0 ? '新增发货地址' : '管理发货地址'}
        </BlankLink>
        <a
          onClick={this.fetchAddressInfo.bind(this, expressId)}
          href="javascript:void(0)"
          style={{ marginLeft: '10px' }}
        >
          刷新
        </a>
      </div>
    );
  }

  renderExpressWayBillTypeSelection() {
    const { expressWayBill } = this.props;
    const { selectedExpress } = this.state;
    if (!selectedExpress.allType) {
      return null;
    }
    return (
      <FormRadioGroupField
        key="wayBillType"
        name="delivery"
        label="发货类型："
        value={expressWayBill.expressWayBillType}
        onChange={e => this.handleValueChange({ expressWayBillType: +e.target.value })}
        validations={{ required: true }}
        validationErrors={{ required: '请选择发货类型' }}
      >
        {selectedExpress.allType.map(type => {
          const key = EXPRESS_WAY_BILL_TYPES_MAP[type];
          return (
            <Radio key={type} value={EXPRESS_WAY_BILL_TYPES[key].value}>
              {EXPRESS_WAY_BILL_TYPES[key].text}
            </Radio>
          );
        })}
      </FormRadioGroupField>
    );
  }

  renderPrinterSelection() {
    const { printers } = this.props;
    return (
      <div key="printer">
        <FormSelectField
          className="inline"
          autoWidth
          width="160px"
          name="printer"
          label="打印机："
          data={printers}
          optionText="name"
          optionValue="id"
          onChange={val => this.handleValueChange({ printerId: val })}
          validations={{ required: true }}
          validationErrors={{ required: '请选择一台打印机' }}
        />
        <span>
          <a href={PRINTER_SETTING_URL}>添加打印机</a>
        </span>
      </div>
    );
  }

  renderPickTime() {
    const { expressWayBill } = this.props;
    const { pickTime } = expressWayBill;
    const { selectedExpress } = this.state;
    const end = 17;
    const start = pickTime.day === 'today' ? this.pickStart! : 9;
    const pickTimes = new Array(end - start).fill(0).map((_, index) => ({
      value: start + index,
      text: `${prefixZero(start + index)}:00 - ${prefixZero(start + index + 1)}:00`,
    }));
    if (!find(EXPRESS_SUPPORT_DETAIL_PICK_TIME, id => id === selectedExpress.expressId)) {
      // 如果是京东快递，只显示`尽快上门取件`
      return (
        <FormSelectField
          key="pickTime"
          label="取件时间："
          name="pickTime"
          value={0}
          data={[
            {
              value: 0,
              text: '尽快上门取件',
            },
          ]}
        />
      );
    }
    return (
      <div key="pickTime" className="pick-time-field">
        <FormSelectField
          className="inline"
          label="取件时间："
          data={this.pickDays}
          name="pickDay"
          value={pickTime.day}
          onChange={val => this.handlePickTimeChange('day', +val)}
          validations={{ required: true }}
          validationErrors={{ required: '请选择取件时间' }}
        />
        <Select
          value={pickTime.time}
          data={pickTimes}
          onChange={e => this.handlePickTimeChange('time', +e.target.value)}
        />
      </div>
    );
  }

  renderPackageWeight() {
    return (
      <div key="weight">
        <FormNumberInputField
          onChange={this.handleWeightChange}
          min={1}
          max={30}
          showStepper
          name="weight"
          label="包裹重量："
          width="160px"
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '请填写物品重量',
          }}
        />
      </div>
    );
  }

  renderPredicatePrice() {
    const { balanceValid } = this.props;
    const { expressFee, selectedExpress } = this.state;
    const isPay = selectedExpress.expressId && selectedExpress.isPay;

    if (!isPay) {
      return null;
    }

    const fee = expressFee ? (expressFee / 100).toFixed(2) : 0;

    return (
      <div key="fee">
        预估费用：{fee} 元（实际重量以快递公司称量为准，运费有赞提前预扣，多退少补）
        {!balanceValid && (
          <div>
            账户余额不足，请先<a href={RECHARGE_URL}>充值</a>
          </div>
        )}
      </div>
    );
  }

  renderCertRequired() {
    const { selectedExpress } = this.state;
    return (
      <div key="cert">
        使用{selectedExpress.expressName}上门取件服务需先加入个人/企业认证
        <a href={DISTRIBUTION_URL}>去认证</a>
      </div>
    );
  }

  renderDepositRequired() {
    return (
      <div key="deposit">
        当前保证金余额不足 <a href={DEPOSIT_URL}>去充值</a>
      </div>
    );
  }

  renderDepositQuitting() {
    return (
      <div key="deposit-quitting">
        退保处理中，无法用该快递公司下单 <a href={DISTRIBUTION_URL}>去查看</a>
      </div>
    );
  }

  renderException() {
    const { desc, code } = this.props.exceptionInfo;
    let jumpLink: React.ReactNode = null;
    switch (code) {
      case 345030005: // 电子面单服务已到期
        jumpLink = <a href={EXPRESS_WAY_BILL_BUY_URL}>去订购</a>;
        break;
      case 345030006: // 电子面单未订购
        jumpLink = <a href={EXPRESS_WAY_BILL_BUY_URL}>去订购</a>;
        break;
      case 345030007: // 电子面单未开启
        jumpLink = <a href={EXPRESS_WAY_BILL_OPEN_URL}>去开启</a>;
        break;
      default:
      // nothing
    }
    return (
      <div className="delivery-content__exception">
        <span>{desc}</span>
        {jumpLink}
      </div>
    );
  }

  render() {
    const { expressWayBill, certValid, depositValid, exceptionInfo, deposit } = this.props;
    const { selectedExpress } = this.state;
    const isPay = selectedExpress.isPay;
    const isExpressCompanySelected = selectedExpress.expressId > 0;
    let showRest = isExpressCompanySelected && expressWayBill.auditNo;

    if (exceptionInfo.code > 0) {
      return this.renderException();
    }

    const content: React.ReactNode[] = [this.renderExpressSelection()];

    if (isExpressCompanySelected) {
      content.push(this.renderAddressSelection());
    }

    // 如果有赞代扣，需要判断是否通过企业或者个人认证, 是否缴纳足额保证金，企业余额是否充足
    if (isPay) {
      if (!certValid) {
        content.push(this.renderCertRequired());
        showRest = false;
      } else if (!depositValid) {
        content.push(this.renderDepositRequired());
        showRest = false;
      } else if (deposit.isQuitting) {
        content.push(this.renderDepositQuitting());
        showRest = false;
      }
    }

    if (showRest) {
      content.push(this.renderExpressWayBillTypeSelection());
      if (expressWayBill.expressWayBillType === 2) {
        content.push(this.renderPickTime());
        if (find(EXPRESS_NEED_WEIGHT, id => id === expressWayBill.expressId)) {
          content.push(this.renderPackageWeight());
        }
      }
      content.push(this.renderPrinterSelection());
      if (expressWayBill.expressWayBillType === 2) {
        content.push(this.renderPredicatePrice());
      }
    }

    return <div className="delivery-content">{content}</div>;
  }
}

export default ExpressWayBill;
