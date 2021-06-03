import React from 'react';
import { Radio, NumberInput, Notify, Tag, Select } from 'zent';
import { Form } from '@zent/compat';
import isNil from 'lodash/isNil';
import find from 'lodash/find';
import map from 'lodash/map';
import filter from 'lodash/filter';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import format from '@youzan/utils/money/format';

import { TextField } from '../fields';
import { makeRequest } from '../utils';
import { globalUrlBase } from '../const';
import {
  ILocalDelivery,
  IModel,
  ILocalPartnerWeightInfo,
  IGetAlphaFeeRes,
  ICityChannelListItem,
} from '../type';

interface IProps {
  data: ILocalDelivery;
  alphaExpressEnable: boolean;
  channels: IModel['city_channel_list'];
  storeId: IModel['store_id'];
  orderNo: string;
  calculateFeeUrl: string;
  onChange: (val: any) => void;
  weights: ILocalPartnerWeightInfo[];
  alphaInfo: IGetAlphaFeeRes;
  kdtId: number;
}

interface IState {
  deliveryFee: number;
  price: string;
  weightType: number;
  packWeight: number;
}

const { FormRadioGroupField, Field, FormNumberInputField } = Form;
const ChannelSelect = props => <Select {...props} />;
const ChannelSelectField = Form.getControlGroup(ChannelSelect) as any;
class IntracitySelection extends React.Component<IProps, IState> {
  weightInfo: {
    min: number;
    max: number;
  };
  channels: IModel['city_channel_list'];
  // 同城配送：计算配送费
  constructor(props) {
    super(props);
    this.state = {
      deliveryFee: 0,
      price: '',
      weightType: 0,
      packWeight: 0,
    };
    this.weightInfo = {
      min: 0,
      max: 9999999,
    };
    const { channels } = this.props;
    this.channels = channels
      .filter(channel => !channel.expired)
      .map(item => {
        return {
          ...item,
          displayName: item.is_cloud_tag ? (
            <span>
              {item.name}
              {/*
              // @ts-ignore */}
              <Tag theme="blue" outline style={{ 'margin-left': '10px' }}>
                自购
              </Tag>
            </span>
          ) : (
            item.name
          ),
          uniqueChannel: item.is_cloud_tag ? item.app_id : item.channel,
        };
      });
  }

  getWeightInfo(channel: string | number) {
    const { weights } = this.props;
    const weightInfo = find(weights, item => {
      if (item.isCloudTag) {
        return item.appId === channel;
      } else {
        return item.deliveryChannel === channel;
      }
    });
    const { initialWeight = 0, maxWeight } = weightInfo || {};
    const _initialWeight = Math.floor(+initialWeight / 1000);
    const _maxWeight = Math.floor(+maxWeight! / 1000);
    const min = _initialWeight > 0 ? _initialWeight : 0;
    const max = _maxWeight || 9999999;
    return {
      min,
      max,
    };
  }

  handleChange(newValues: any) {
    const { data, onChange } = this.props;
    onChange &&
      onChange({
        ...data,
        ...newValues,
      });
  }

  // 第三方配送选项改变后，需要重新计算运费
  handleWeightChange = (val: number) => {
    this.setState({
      weightType: 1,
      packWeight: val || 0,
    });

    this.calculatePrice();
  };

  handleWeightTypeChange = (val: number) => {
    const { weightType, packWeight } = this.state;
    const { min, max } = this.weightInfo;
    if (weightType !== val) {
      this.setState({
        weightType: val,
      });
      if (val === 1) {
        if (packWeight < min) {
          this.setState({
            packWeight: min,
          });
        }
        if (packWeight > max) {
          this.setState({
            packWeight: max,
          });
        }
      }
      this.calculatePrice();
    }
  };

  /* eslint-disable @typescript-eslint/camelcase */
  handleChannelChange = (_, selected: ICityChannelListItem) => {
    const { app_id, channel, name, is_cloud_tag } = selected;
    this.handleChange({
      channel,
      appId: app_id,
      isCloudTag: is_cloud_tag,
      channelName: name,
    });
    this.weightInfo = this.getWeightInfo(is_cloud_tag ? app_id : channel);
    this.setState({
      weightType: 0,
    });
    this.calculatePrice();
  };
  /* eslint-enable @typescript-eslint/camelcase */

  calculatePrice = debounce(() => {
    const { data, orderNo, calculateFeeUrl, storeId, kdtId } = this.props;
    const { weightType, packWeight } = this.state;
    const { channel, tip, appId, isCloudTag } = data;
    const { min } = this.weightInfo;

    // 没有选择配送公司
    if (isNil(channel) || !channel) {
      return;
    }
    let weight = 0;
    if (weightType === 1) {
      weight = (packWeight || min) * 1000;
    }
    const params = {
      orderNo,
      storeId,
      deliveryType: 21,
      distWeight: weight,
      distChannel: channel,
      appId,
      isCloudTag,
      kdtId,
    };

    return makeRequest('GET', calculateFeeUrl, params)
      .then(res => {
        const _tip = parseInt(tip as string, 10) * 100 || 0;
        // 总的配送费 = 运费 + 小费
        const totalFee = ((res.fee + _tip) / 100).toFixed(2);
        this.handleChange({
          fee: res.fee,
          totalFee,
          distWeight: weight,
          feeStatus: res.feeStatus,
          depositUrl: res.depositUrl,
        });
      })
      .catch(msg => Notify.error(msg));
  }, 300);

  renderChannelSelection() {
    const { data, alphaInfo } = this.props;
    const channels = this.channels;
    const distChannel = get(alphaInfo, 'distChannel', '');
    const { channel, channelName, appId, isCloudTag, feeStatus, depositUrl } = data;

    return (
      <>
        <ChannelSelectField
          className="inline channel-select-field"
          width={170}
          autoWidth={true}
          name="channel"
          label="配送公司："
          onChange={this.handleChannelChange}
          placeholder="请选择配送公司"
          data={channels}
          optionText="displayName"
          optionValue="uniqueChannel"
          value={(isCloudTag ? appId : channel) || distChannel}
          validations={{
            required: true,
          }}
          validationErrors={{
            required: '请选择配送公司',
          }}
        />
        {feeStatus === 2 ? (
          <span className="error-desc">
            你在{channelName}的账户余额不足，请
            <a target="_blank" rel="noopener noreferrer" href={depositUrl}>
              前往充值
            </a>
          </span>
        ) : null}
      </>
    );
  }

  renderWeight() {
    const { data, alphaInfo } = this.props;
    const channel =
      (data.isCloudTag ? data.appId : data.channel) || get(alphaInfo, 'distChannel', '');
    const { weightType, packWeight } = this.state;
    this.weightInfo = this.getWeightInfo(channel);
    const { min, max } = this.weightInfo;

    if (!channel) {
      return null;
    }

    if (min === 0) {
      return (
        <div>
          <div style={{ display: 'inline-block' }}>
            <FormNumberInputField
              className="inline"
              name="packWeight"
              label="商品重量："
              showStepper
              value={packWeight}
              min={min}
              max={max}
              onChange={val => this.handleWeightChange(val)}
            />
          </div>
          <span>千克</span>
        </div>
      );
    }

    return (
      <FormRadioGroupField
        name="weightType"
        label="商品重量："
        value={weightType}
        onChange={e => this.handleWeightTypeChange(+e.target.value)}
      >
        <Radio value={0}>{min}千克以内</Radio>
        <Radio value={1} />
        <div style={{ display: 'inline-block' }}>
          <NumberInput
            showStepper
            min={min}
            max={max}
            className="inline weight-input"
            value={packWeight}
            onChange={val => this.handleWeightChange(val)}
          />
        </div>
        千克
      </FormRadioGroupField>
    );
  }

  renderPrice() {
    const { data, alphaInfo } = this.props;
    const { fee, totalFee } = data;
    const alphaFee = get(alphaInfo, 'fee', '');
    const distFee = alphaFee ? `￥${format(alphaInfo.fee)}` : '';

    return (
      <Field
        name="deliveryFee"
        label="配送价格："
        component={TextField}
        text={fee ? `￥${totalFee}` : distFee}
      />
    );
  }

  // 显示智选参考
  renderAlphaList() {
    const { alphaInfo } = this.props;
    const { distChannel } = alphaInfo || {};

    if (isNil(distChannel)) {
      return null;
    }

    const extraAlphaMessage = get(alphaInfo, 'extraAlphaMessage', '[]');
    const extraList = JSON.parse(extraAlphaMessage);
    const choosedDelivery = filter(extraList, item => item.deliveryChanel === distChannel);
    const choosedDeliveryName = get(choosedDelivery, '[0].deliveryChanelDesc', '未知');

    const choosedDeliveryText = `已开通中选出${choosedDeliveryName}，当前时间配费价格最低。`;
    const allFeeList = map(extraList, item => {
      return `${item.deliveryChanelDesc}：${format(item.fee)}元`;
    }).join('、');

    return (
      <Field
        name="alpha-list"
        label="智选参考："
        component={TextField}
        text={
          <div>
            <p>{choosedDeliveryText}</p>
            <p>{allFeeList}</p>
          </div>
        }
      />
    );
  }

  // 未开通智选配送，推广文案
  renderPopularize() {
    return (
      <div>
        哪家最便宜，体验智选配送，省一点是一点&nbsp;&nbsp;
        <a href={`${globalUrlBase}/trade/localdelivery/index`}>去了解</a>
      </div>
    );
  }

  renderContent() {
    const { channels, alphaExpressEnable } = this.props; // 是否启用第三方同城配送服务
    if (channels.length === 0) {
      return (
        <div>
          暂未启用第三方同城配送服务
          <a
            href="//www.youzan.com/v2/trade/localdelivery"
            rel="noopener noreferrer"
            target="_blank"
          >
            &nbsp;前往开启
          </a>
        </div>
      );
    }

    return (
      <div>
        {this.renderChannelSelection()}
        {this.renderWeight()}
        {this.renderPrice()}
        {alphaExpressEnable && this.renderAlphaList()}
        {!alphaExpressEnable && this.renderPopularize()}
      </div>
    );
  }

  render() {
    return <div className="delivery-content">{this.renderContent()}</div>;
  }
}

export default IntracitySelection;
