import React from 'react';
import { Button, Notify } from 'zent';
import get from 'lodash/get';
import ExpressSelection from './ExpressSelection';
import IntracitySelection from './IntracitySelection';
import { getDefaultExpressId, setDefaultExpressId } from '../utils';
import { globalUrlBase } from '../const';
import WrapperWithFooter from './WrapperWithFooter';
import api from '../api';
import toCent from '@youzan/utils/money/toCent';
import {
  IDeliveryInfo,
  IModel,
  ILocalPartnerWeightInfo,
  IGetAlphaFeeRes,
  ILocalDelivery,
} from '../type';

interface IProps {
  deliveryType: number;
  model: IModel;
  balance: number;
  orderNo: string;
  calculateFeeUrl: string;
  callSource: number;
  zentForm: any;
  handleSubmit: any;
  onSubmit: (deliveryInfo: IDeliveryInfo) => void;
  submitting: boolean;
  kdtId: number;
}

interface IState {
  expressId: number | '';
  expressName: string;
  expressNo: string;
  localDelivery: ILocalDelivery;
  weights: ILocalPartnerWeightInfo[];
  alphaInfo: IGetAlphaFeeRes;
}

/**
 * 同城配送
 *
 * @class Intracity
 * @extends {React.Component}
 */
class Intracity extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      expressId: getDefaultExpressId(),
      expressName: '',
      expressNo: '',
      localDelivery: {
        distWeight: 0,
        tip: 0,
        fee: 0,
        totalFee: 0,
        channel: undefined,
        appId: undefined,
        isCloudTag: false,
        channelName: undefined,
        feeStatus: 1,
      },
      weights: [],
      alphaInfo: {} as IGetAlphaFeeRes,
    };
  }

  componentDidMount() {
    this.fetchWeightInfo();

    // 智慧优选开启时，请求选中的快递公司
    this.handleAlphaExpressReq();
  }

  fetchWeightInfo() {
    const { kdtId } = this.props;
    api.getLocalWeightInfo({ kdtId }).then(data => {
      this.setState({
        weights: data,
      });
    });
  }

  /**
   * 开启了智慧优选时，直接请求alphaFee.json
   */
  handleAlphaExpressReq() {
    const { model, orderNo } = this.props;
    const alphaExpressEnable = get(model, 'alpha_express_enable', false);
    const params = {
      orderNo,
      alphaExpressEnable,
    };

    if (alphaExpressEnable) {
      api
        .getAlphaFee(params)
        .then(data => {
          const tip = get(this.state, 'localDelivery.tip', 0);
          const fee = get(data, 'fee', 0);
          // 总的配送费 = 运费 + 小费
          const totalFee = ((fee + tip) / 100).toFixed(2);

          this.setState({
            alphaInfo: data,
            localDelivery: {
              distWeight: 0,
              tip,
              fee,
              totalFee,
              channel: get(data, 'distChannel', undefined),
              appId: undefined,
              isCloudTag: false,
              channelName: undefined,
              feeStatus: 1,
            },
          });
        })
        .catch(msg => {
          Notify.error(msg);
        });
    }
  }

  handleSubmit = () => {
    const { onSubmit, deliveryType } = this.props;
    const { expressId, expressName, expressNo, localDelivery } = this.state;
    const { distWeight, tip, channel, appId, channelName } = localDelivery;
    const deliveryInfo = {
      deliveryType,
    } as IDeliveryInfo;
    if (deliveryType === 12) {
      deliveryInfo.express = {
        expressId,
        expressName,
        expressNo,
      };
      setDefaultExpressId(expressId);
    }
    if (deliveryType === 21) {
      deliveryInfo.localDelivery = {
        distWeight,
        tip,
        channel,
        appId,
        channelName,
      };
    }
    onSubmit && onSubmit(deliveryInfo);
  };

  handleValueChange = (key: keyof IState, val: any) => {
    // @ts-ignore
    this.setState({
      [key]: val,
    });
  };

  // 普通快递发货
  renderNormal() {
    const { expressId, expressName, expressNo } = this.state;
    const { isExchange } = this.props.model;
    const isShowTips = !isExchange;

    return (
      <div className="delivery-content">
        <ExpressSelection
          expressId={expressId}
          expressName={expressName}
          expressNo={expressNo}
          onChange={this.handleValueChange}
        />
        {isShowTips && (
          <div className="gray">
            *请仔细填写物流公司及物流单号，发货后72小时内仅支持做一次更正，逾期不可修改
          </div>
        )}
      </div>
    );
  }

  renderIntra() {
    const { localDelivery, weights, alphaInfo } = this.state;
    const { model, orderNo, calculateFeeUrl, kdtId } = this.props;
    const alphaExpressEnable = get(model, 'alpha_express_enable', false);
    const appointedDeliveryTime = get(model, 'deliveryAutomaticThirdCall.appointedDeliveryTime', 0);
    const isShowAutoBar = get(model, 'deliveryAutomaticThirdCall.isShowAutoBar', false);

    return (
      <IntracitySelection
        data={localDelivery}
        alphaExpressEnable={alphaExpressEnable}
        channels={model.city_channel_list || []}
        storeId={model.store_id}
        orderNo={orderNo}
        calculateFeeUrl={calculateFeeUrl}
        appointedDeliveryTime={appointedDeliveryTime}
        isShowAutoBar={isShowAutoBar}
        onChange={val => this.handleValueChange('localDelivery', val)}
        weights={weights}
        alphaInfo={alphaInfo}
        kdtId={kdtId}
      />
    );
  }

  renderCallCourier(onSubmit) {
    const { balance, submitting } = this.props;
    const { channel, fee, totalFee, isCloudTag, feeStatus } = this.state.localDelivery;
    // totalFee单位是元，balance单位是分，将totalFee*100转为分再与balace比较
    const balanceLow = toCent(totalFee as string) > balance;
    // channel === 11 代表自结算商家
    const isSelfSettlement = channel === 11;
    // 云服务商，feeStatus不等于1表示账户余额不足，不可呼叫，非云服务商，按照原有逻辑。达达自结算商家不显示余额相关。
    const callDisabled = !isSelfSettlement && (isCloudTag ? feeStatus !== 1 : !fee || balanceLow);
    return (
      <div className="call-area">
        <Button loading={submitting} disabled={callDisabled} onClick={onSubmit}>
          呼叫配送员
        </Button>
        {/* 云服务商和达达自结算不需要显示店铺余额不足的情况，由feeStatus决定且在其他地方展示账户余额不足 */}
        {balanceLow && !isCloudTag && !isSelfSettlement && (
          <div>
            店铺余额不足，
            <a
              href={`${globalUrlBase}/trade/newsettlement#rechargeMoney`}
              rel="noopener noreferrer"
              target="_blank"
            >
              点此充值
            </a>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { deliveryType, submitting, handleSubmit } = this.props;
    let content: React.ReactNode = null;
    let footer: ((func: any) => React.ReactNode) | null = null;
    if (deliveryType === 12) {
      content = this.renderNormal();
    }
    if (deliveryType === 21) {
      content = this.renderIntra();
      footer = onSubmit => this.renderCallCourier(onSubmit);
    }
    return (
      <WrapperWithFooter
        footer={footer}
        loading={submitting}
        onSubmit={this.handleSubmit}
        handleSubmit={handleSubmit}
      >
        {content}
      </WrapperWithFooter>
    );
  }
}

export default Intracity;
