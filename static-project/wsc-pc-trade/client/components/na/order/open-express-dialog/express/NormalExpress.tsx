import React from 'react';
import head from 'lodash/head';
import get from 'lodash/get';
import { Notify, Checkbox } from 'zent';
import addDays from 'date-fns/add_days';
import getYear from 'date-fns/get_year';
import getMonth from 'date-fns/get_month';
import getDate from 'date-fns/get_date';
import setHours from 'date-fns/set_hours';
import getTime from 'date-fns/get_time';
import ExpressSelection from './ExpressSelection';
import SingleGoodsMultiExpress from './SingleGoodsMultiExpress';
import ExpressWayBill from './ExpressWayBill';
import WrapperWithFooter from './WrapperWithFooter';
import DeliveryBtn from './DeliveryBtn';
import api from '../api';
import { getDefaultExpressId, setDefaultExpressId } from '../utils';
import {
  IExpressCompany,
  IPrinter,
  IGetDepositExpressRes,
  IExpressWayBill,
  IGetDeliveryDetailRes,
  IDeliveryWindowItemDetailInfo,
  IDeliveryInfo,
  IItemPack,
} from '../type';

interface IProps {
  deliveryType: number;
  model: IGetDeliveryDetailRes;
  selectedItems: IDeliveryWindowItemDetailInfo[];
  onSubmit: (deliveryInfo: IDeliveryInfo) => void;
  balance: number;
  submitting: boolean;
  orderNo: string;
  zentForm: any;
  handleSubmit: any;
}

interface IState {
  expressId: number | '';
  expressName: string;
  expressNo: string;
  expressWayBill: IExpressWayBill;
  itemPackList: IItemPack[];
  printers: IPrinter[];
  expressCompanies: IExpressCompany[];
  deposit: IGetDepositExpressRes;
  agreedSF: boolean;
}

/**
 * 普通快递发货
 *
 * @class NormalExpress
 * @extends {React.Component}
 */
class NormalExpress extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      expressId: getDefaultExpressId(),
      expressName: '',
      expressNo: '',
      expressWayBill: {} as IExpressWayBill,
      itemPackList: [],
      printers: [],
      expressCompanies: [],
      deposit: {} as IGetDepositExpressRes,
      agreedSF: false,
    };
  }

  componentDidMount() {
    this.fetchPrinterList();
    this.fetchDeliveryExpressCompanies();
    this.fetchDeposit();
  }

  fetchPrinterList() {
    api.getPrinterList().then(({ items }) => {
      this.setState({
        printers: items || [],
      });
    });
  }

  fetchDeliveryExpressCompanies() {
    api.getDeliveryExpressCompanies().then(data => {
      this.setState({
        expressCompanies: data || [],
      });
    });
  }

  fetchDeposit() {
    api.getDepositExpress().then(data => {
      this.setState({
        deposit: data || {},
      });
    });
  }

  handleSubmit = () => {
    const { deliveryType, onSubmit, selectedItems } = this.props;
    const { expressId, expressName, expressNo, itemPackList } = this.state;
    const isSingleGoodsMultiExpress = this.checkIsSingleGoodsMultiExpress();
    const deliveryInfo = {
      deliveryType,
    } as IDeliveryInfo;

    if (deliveryType === 12) {
      if (isSingleGoodsMultiExpress && itemPackList && itemPackList.length) {
        const total = itemPackList.reduce((count, item) => {
          return count + parseInt(item.num as string, 10);
        }, 0);
        const num = head(selectedItems)!.num;
        // 单品多运只能选择一个商品
        if (+num !== total) {
          return Notify.error(`每个包裹必须填写商品数量且包裹数量总和等于 ${num}`);
        }
        deliveryInfo.isSingleGoodsMultiExpress = true;
        deliveryInfo.itemPackList = itemPackList;
      } else {
        deliveryInfo.express = {
          expressId,
          expressName,
          expressNo,
        };
        setDefaultExpressId(expressId);
      }
    }
    if (deliveryType === 14) {
      deliveryInfo.expressWayBill = this.getWayBillData();
    }

    return onSubmit && onSubmit(deliveryInfo);
  };

  // 电子面单发货
  getWayBillData = () => {
    const { expressWayBill, printers } = this.state;
    const { printerId, expressId, pickTime, expressWayBillType, ...rest } = expressWayBill;

    const printer = printers.find(item => item.id === printerId) || ({} as IPrinter);

    if (expressId === 7 && expressWayBillType === 2) {
      const now = new Date();
      // 后端需要时间精确到秒
      const startAppointment =
        getTime(
          addDays(
            setHours(new Date(getYear(now), getMonth(now), getDate(now)), pickTime.time),
            pickTime.day as number,
          ),
        ) / 1000;
      rest.startAppointment = startAppointment;
      rest.endAppointment = startAppointment + 3600;
    }

    return {
      ...rest,
      expressId,
      expressWayBillType,
      printerKey: printer.equipmentKey,
      printerDeviceNo: printer.equipmentNumber,
      printerChannel: printer.equipmentTypeId,
    } as IExpressWayBill;
  };

  handleAddPack = () => {
    const { expressId, expressName, expressNo } = this.state;
    this.setState({
      itemPackList: [
        {
          express: {
            expressId,
            expressNo,
            expressName,
          },
          num: 1,
        },
        {
          express: {
            expressId: getDefaultExpressId(),
            expressNo: '',
            expressName: '',
          },
          num: 1,
        },
      ],
    });
  };

  handleCleanPackList = (val?: IItemPack) => {
    const { express } = val || ({ express: {} } as IItemPack);
    this.setState({
      itemPackList: [],
      expressId: express.expressId || getDefaultExpressId(),
      expressName: express.expressName || '',
      expressNo: express.expressNo || '',
    });
  };

  /**
   * 快递发货单品多运
   * 1.开启单品多件发货配置
   * 2.仅选择一种商品
   * 3.选择的这种商品数量大于1
   * 4.选择【自己联系物流】
   * 5.非周期购（周期购不支持单品多运）
   */
  checkIsSingleGoodsMultiExpress = () => {
    const { deliveryType, model, selectedItems } = this.props;
    const selectItem = head(selectedItems);
    const isSingleGoodsMultiExpress =
      model.open_multiple_delivery &&
      selectedItems.length === 1 &&
      selectItem &&
      selectItem.num > 1 &&
      deliveryType === 12 &&
      !model.multi_period_delivery_info;
    return isSingleGoodsMultiExpress;
  };

  getExceptionInfo = () => {
    const { model } = this.props;
    const desc = get(model, 'electronic_sheet_exception_info.electronic_sheet_exception_desc', '');
    const code = get(model, 'electronic_sheet_exception_info.electronic_sheet_exception_code', 0);
    return {
      desc,
      code,
    };
  };

  handleValueChange = (key: keyof IState, val: any) => {
    // @ts-ignore
    this.setState({
      [key]: val,
    });
  };

  checkCertification() {
    // 一年多的时间里该接口都是无效的决定废弃：https://doc.qima-inc.com/pages/viewpage.action?pageId=217951843
    // 如果有赞代扣，需要判断是否通过企业或者个人认证
    // if (certType < 2 || certType >= 10) {
    //   return false;
    // }
    return true;
  }

  checkDepositFee() {
    const { deposit } = this.state;
    return deposit.depositAvl >= 100000;
  }

  checkBalance() {
    const { balance } = this.props;
    const { expressWayBill } = this.state;
    const { expressFee = 0 } = expressWayBill;
    return balance - expressFee >= 0;
  }

  checkExpressWayBillValid() {
    const { expressWayBill } = this.state;
    if (expressWayBill.isPay) {
      return this.checkCertification() && this.checkDepositFee() && this.checkBalance();
    }
    return true;
  }

  // 单品多送
  renderSingleGoodsMultiExpress() {
    const { itemPackList } = this.state;
    return (
      <SingleGoodsMultiExpress
        packItems={itemPackList}
        onCleanPackList={this.handleCleanPackList}
        onChange={val => this.handleValueChange('itemPackList', val)}
      />
    );
  }

  renderAddPack() {
    const { itemPackList } = this.state;
    const isSingleGoodsMultiExpress = this.checkIsSingleGoodsMultiExpress();
    if (isSingleGoodsMultiExpress && itemPackList.length === 0) {
      return (
        <div>
          一种包裹按数量拆分多包裹发送（仅针对一种单品）
          <a className="control-item" onClick={this.handleAddPack}>
            新增运单
          </a>
        </div>
      );
    }
  }

  // 普通快递发货
  renderNormal() {
    const { expressId, expressName, expressNo } = this.state;
    return (
      <div className="delivery-content">
        <ExpressSelection
          expressId={expressId}
          expressName={expressName}
          expressNo={expressNo}
          onChange={this.handleValueChange}
        />
        <div className="gray">
          *请仔细填写物流公司及快递单号，发货后72小时内仅支持做一次更正，逾期不可修改
        </div>
        {this.renderAddPack()}
      </div>
    );
  }

  // 电子面单
  renderExpressWayBill() {
    const { expressWayBill, printers, expressCompanies, deposit } = this.state;
    const { orderNo } = this.props;

    return (
      <ExpressWayBill
        orderNo={orderNo}
        expressWayBill={expressWayBill}
        onChange={val => this.handleValueChange('expressWayBill', val)}
        printers={printers}
        expressCompanies={expressCompanies}
        deposit={deposit}
        certValid={this.checkCertification()}
        depositValid={this.checkDepositFee()}
        balanceValid={this.checkBalance()}
        exceptionInfo={this.getExceptionInfo()}
      />
    );
  }

  renderSFExpressFooter = onSubmit => {
    const { submitting, zentForm } = this.props;
    const { agreedSF } = this.state;
    const disabled = !agreedSF || !zentForm.isValid() || !this.checkExpressWayBillValid();

    return (
      <div>
        <Checkbox
          checked={agreedSF}
          onChange={() => {
            this.setState({ agreedSF: !agreedSF });
          }}
        >
          同意
          <a
            href="https://bbs.youzan.com/forum.php?mod=viewthread&tid=670164"
            target="_blank"
            rel="noopener noreferrer"
          >
            《顺丰快件运单契约条款》
          </a>
        </Checkbox>
        <DeliveryBtn loading={submitting} disabled={disabled} onClick={onSubmit} />
      </div>
    );
  };

  render() {
    const { deliveryType, submitting, handleSubmit, zentForm } = this.props;
    const { itemPackList, expressWayBill } = this.state;
    const isFormValid = zentForm.isValid();
    let disabled = !isFormValid;
    let footer: ((func: any) => React.ReactNode) | null = null;

    const isSingleGoodsMultiExpress = this.checkIsSingleGoodsMultiExpress();
    // 打印电子面单
    let content: React.ReactNode = null;
    if (deliveryType === 14) {
      const exceptionInfo = this.getExceptionInfo();
      disabled = disabled || exceptionInfo.code > 0 || !this.checkExpressWayBillValid();
      content = this.renderExpressWayBill();

      // 顺丰需要同意 《顺丰快递运单契约条款》
      if (expressWayBill.expressId === 7) {
        footer = this.renderSFExpressFooter;
      }
    }
    // 选择自己联系快递，需要选择快递公司、填写运单号
    if (deliveryType === 12) {
      if (!isSingleGoodsMultiExpress || !itemPackList || itemPackList.length === 0) {
        content = this.renderNormal();
      }
      if (isSingleGoodsMultiExpress && itemPackList.length > 0) {
        content = this.renderSingleGoodsMultiExpress();
      }
    }

    return (
      <WrapperWithFooter
        loading={submitting}
        onSubmit={this.handleSubmit}
        handleSubmit={handleSubmit}
        disabled={disabled}
        footer={footer}
      >
        {content}
      </WrapperWithFooter>
    );
  }
}

export default NormalExpress;
