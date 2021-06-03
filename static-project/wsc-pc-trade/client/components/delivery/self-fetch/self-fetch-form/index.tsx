import React, { PureComponent } from 'react';
import { Button, Notify, BlockLoading } from 'zent';
import { Form } from '@zent/compat';

import RegionField from './fields/region-field';
import MapField from './fields/map-field';
import PhoneField from './fields/phone-field';
import IsOptionField from './fields/self-fetch-time-field/is-option';
import TimeDivideField from './fields/self-fetch-time-field/time-divide';
import AppointmentOrderField from '../../common/appointment-order-field';
import MaxReservationField from './fields/self-fetch-time-field/max-reservation';
import SelfFetchImageField from './fields/self-fetch-image-field';
import IsStoreField from './fields/is-store-field';
import AddressField from './fields/address-field';
import { formatSelfFetchPointRequest, formatSelfFetchPointResponse } from '../format';
import { checkWscBranchStore, isRetailSingleStore } from '@youzan/utils-shop';
import ShopInfo from './fields/shop-info';
import FooterButtonContainer from 'components/footer-button-container';
import * as api from '../api';
import BusinessHourField from './fields/business-hour-field';
import TimeField from 'components/delivery/common/time-field';
import TicketPrintConfig from 'components/delivery/common/ticket-print-config';

const { FormInputField } = Form;

// 是否开启履约备货提醒，零售单店白名单生效
const isShowAutoPrintTicket = isRetailSingleStore && window._global.isShowAutoPrintTicket;

const convertTimeMap = {
  minute(time: number) {
    return time;
  },
  hour(time: number) {
    return time * 60;
  },
  day(time: number) {
    return time * 24 * 60;
  },
  none(time: number) {
    time = time || 1;
    return time * 24 * 60;
  },
};

const compareTime = (
  aheadMinType: string,
  aheadMinTime: number,
  aheadMaxType: string,
  aheadMaxTime: number,
) => {
  const aheadMinMinute = convertTimeMap[aheadMinType](aheadMinTime);
  const aheadMaxMinute = convertTimeMap[aheadMaxType](aheadMaxTime);
  return aheadMinMinute < aheadMaxMinute;
};

interface IProps {
  id: number;
  noIdItem: any;
  zentForm: any;
  handleSubmit: any;
  onChange: (v: any) => void;
  onSaveSuccess: (v: any) => void;
}

interface IState {
  loading: boolean;
  saving: boolean;
  query: string;
  address: any;
  isOptionSelfFetchTime: boolean;
  ticketPrintConfig: any;
}

class SelfFetchForm extends PureComponent<IProps, IState> {
  state: IState = {
    loading: true,
    saving: false,
    query: '',
    address: {
      province: '',
      city: '',
      district: '',
      regionId: '',
      address: '',
      lng: '',
      lat: '',
    },
    isOptionSelfFetchTime: true,
    /**
     * 自动打单
     */
    ticketPrintConfig: {
      needAutoPrint: 0,
      autoPrintOption: 0,
      // 默认 15 分钟（900秒）
      aheadTime: 900,
    },
  };
  formData: any = {
    name: '',
    phone: {
      areaCode: '',
      localNumber: '',
    },
    businessHour: {
      mode: 1,
      dailyValue: [],
      weeklyValue: [],
    },
    selfFetchTimes: {
      mode: 1,
      dailyValue: [],
      weeklyValue: [],
    },
    timeDivide: 'hour',
    reservation: {
      ruleType: 'none',
      aheadMinType: 'hour',
      aheadMin: 2,
      cutOffRuleModel: {
        hour: 12,
        minute: 0,
        beforeAheadMinType: 'hour',
        beforeAheadMin: 2,
        afterAheadMinType: 'day',
        afterAheadMin: 1,
      },
      inventoryRuleModel: {
        materialAheadMinType: 'hour',
        materialAheadMin: 2,
        planAheadMinType: 'day',
        planAheadMin: 1,
      },
    },
    maxReservation: {
      day: 1,
      type: 'none',
    },
    image: '',
    description: '',
    isStore: false,
    superStore: false,
  };
  submit = values => {
    const { address, isOptionSelfFetchTime, ticketPrintConfig } = this.state;
    const { id } = this.props;
    const data = {
      ...this.formData,
      ...values,
      address,
      isOptionSelfFetchTime,
      ticketPrintConfig,
    };
    const aheadMax = data.maxReservation[data.maxReservation.type] || 0;
    const aheadMaxType = data.maxReservation.type;
    const aheadMin = data.reservation.aheadMin || 0;
    const aheadMinType = data.reservation.aheadMinType || 'none';
    let timeValid = true;
    // 选了自提时间并且选择了预约自提时间
    if (data.reservation.ruleType !== 'none' && data.isOptionSelfFetchTime) {
      // 防止脏数据为空
      if (!aheadMinType || !aheadMin) {
        return;
      }
      timeValid = compareTime(aheadMinType, aheadMin, aheadMaxType, aheadMax);
    }
    if (!timeValid) {
      Notify.error('预约自提时间必须小于最长预约时间');
    } else {
      this.setState({
        saving: true,
      });
      const formatData = formatSelfFetchPointRequest(data);
      const method: (data) => Promise<number | boolean> = id
        ? api.updateSelfFetchPoint
        : api.createSelfFetchPoint;
      // @ts-ignore
      method({
        ...formatData,
      })
        .then(() => {
          Notify.success('保存成功');
          this.setState({
            saving: false,
          });
          this.props.onSaveSuccess(formatData);
        })
        .catch(error => {
          Notify.error(error);
          this.setState({
            saving: false,
          });
        });
    }
  };
  handleSearch = (query: string) => {
    this.setState({
      query,
    });
  };
  handleRegionChanged = region => {
    const { address } = this.state;
    this.setState({
      address: {
        ...address,
        province: region.province,
        city: region.city,
        district: region.area,
        regionId: region.county_id,
      },
    });
  };
  handleAddressChanged = addressDetail => {
    const { address } = this.state;
    this.setState({
      address: {
        ...address,
        address: addressDetail,
      },
    });
  };
  handleMapChanged = map => {
    this.setState({
      address: map,
    });
  };
  handleIsOptionSelfFetchTimeChanged = isOptionSelfFetchTime => {
    this.setState({
      isOptionSelfFetchTime,
    });
  };
  handlePrintSettingChange = v => {
    this.setState({
      ticketPrintConfig: v,
    });
  };
  getSelfFetchPoint = (id: number) => {
    api
      .getSelfFetchPoint({
        storeId: id,
      })
      .then(res => {
        if (res.info) {
          const data = formatSelfFetchPointResponse(res.info, res.setting || {});
          this.formData = data;
          this.setState({
            address: data.address,
            isOptionSelfFetchTime: data.isOptionSelfFetchTime,
            ticketPrintConfig: res.ticketPrintConfig,
          });
        }
        this.setState({
          loading: false,
        });
      })
      .catch(err => {
        Notify.error(err);
      });
  };
  componentDidMount() {
    const { noIdItem, id } = this.props;
    if (noIdItem) {
      this.formData = noIdItem;
      this.setState({
        loading: false,
        address: noIdItem.address,
        isOptionSelfFetchTime: noIdItem.isOptionSelfFetchTime,
      });
    } else if (id) {
      this.getSelfFetchPoint(id);
    } else {
      this.setState({
        loading: false,
      });
    }
  }
  render() {
    const {
      loading,
      saving,
      query,
      address,
      isOptionSelfFetchTime,
      ticketPrintConfig,
    } = this.state;
    const { id, handleSubmit } = this.props;
    const {
      name,
      phone,
      selfFetchTimes,
      timeDivide,
      reservation,
      maxReservation,
      description,
      isStore,
      image,
      superStore,
      businessHour,
    } = this.formData;
    const shopInfo = _global.shopInfo;
    // @ts-ignore
    const shopContact = _global.shopContact;
    const isWscBranchStore = checkWscBranchStore(shopInfo);
    return loading ? (
      <BlockLoading loading={loading} height={500} />
    ) : (
      <Form horizontal className="self-fetch-form" onSubmit={handleSubmit(this.submit)}>
        {isWscBranchStore ? (
          <ShopInfo shopInfo={shopInfo} shopContact={shopContact} id={id} />
        ) : (
          <>
            <FormInputField
              required
              label="自提点名称："
              name="name"
              width={460}
              placeholder="请填写自提点名称便于买家理解和管理"
              value={name}
              validations={{
                required: true,
              }}
              validationErrors={{
                required: '自提点名称不能为空',
              }}
            />
            <RegionField
              label="自提点地址："
              name="region"
              value={address.regionId}
              handleRegionChanged={this.handleRegionChanged}
              required
            />
            <AddressField
              label=""
              name="addressDetail"
              value={address.address}
              handleSearch={this.handleSearch}
              handleAddressChanged={this.handleAddressChanged}
            />
            <MapField
              label="地图定位："
              name="map"
              value={address.lng && address.lat ? [address.lng, address.lat] : null}
              query={query}
              required
              handleMapChanged={this.handleMapChanged}
            />
            <PhoneField label="联系电话：" name="phone" value={phone} required />
            <BusinessHourField
              label="接待时间："
              name="businessHour"
              value={businessHour}
              required
            />
          </>
        )}
        <IsOptionField
          label="自提时间："
          name="isOptionSelfFetchTime"
          value={isOptionSelfFetchTime}
          handleIsOptionSelfFetchTimeChanged={this.handleIsOptionSelfFetchTimeChanged}
        />
        {isOptionSelfFetchTime ? (
          <div>
            <TimeField
              label="自提时段："
              name="selfFetchTimes"
              value={selfFetchTimes}
              forbidTomorrowInTimePicker
              required
            />
            <TimeDivideField label="时段细分：" name="timeDivide" value={timeDivide} required />
            <AppointmentOrderField
              label="预约自提："
              name="reservation"
              value={reservation}
              required
              validations={{
                validatorPreferredDistChannel(_values, value) {
                  const {
                    cutOffRuleModel: {
                      afterAheadMin,
                      afterAheadMinType,
                      beforeAheadMin,
                      beforeAheadMinType,
                    },
                    inventoryRuleModel: {
                      materialAheadMin,
                      materialAheadMinType,
                      planAheadMin,
                      planAheadMinType,
                    },
                  } = value;

                  if (
                    (afterAheadMin === beforeAheadMin &&
                      afterAheadMinType === beforeAheadMinType) ||
                    (materialAheadMin === planAheadMin && materialAheadMinType === planAheadMinType)
                  ) {
                    return false;
                  }

                  return true;
                },
              }}
            />
            <MaxReservationField
              label="最长预约："
              name="maxReservation"
              value={maxReservation}
              required
            />
          </div>
        ) : null}
        {isShowAutoPrintTicket && (
          <Form.Field
            className="self-fetch-form__autoprint"
            label="拣货小票: "
            type="self-fetch"
            name="ticketPrintConfig"
            canSelectAll={isOptionSelfFetchTime}
            value={ticketPrintConfig}
            component={TicketPrintConfig.Field}
            onChange={this.handlePrintSettingChange}
          />
        )}
        {isWscBranchStore ? null : (
          <>
            <SelfFetchImageField label="自提点照片：" name="image" required value={image} />
            <FormInputField
              type="textarea"
              label="商家推荐："
              name="description"
              className="description-field"
              width={460}
              maxLength={200}
              showCount
              autoSize
              placeholder="可以描述自提点的活动或相关备注信息（最多200个字）"
              value={description}
            />
            <IsStoreField name="isStore" value={isStore} />
          </>
        )}
        {!isWscBranchStore && superStore ? (
          <div className="zent-form__control-group ">
            <label className="zent-form__control-label" />
            <div className="zent-form__controls">
              说明：开启门店作为自提点后，买家购买商品的时候，如果买家选择了该自提点，生成的订单可以由门店进行发货，请在【订单-门店自提发货中】处理该自提订单发货
            </div>
          </div>
        ) : null}
        <FooterButtonContainer className="self-fetch__bottom-container">
          <Button type="primary" htmlType="submit" loading={saving}>
            {id ? '保存自提点' : '确定开启'}
          </Button>
        </FooterButtonContainer>
      </Form>
    );
  }
}

// @ts-ignore
export default Form.createForm({ scrollToError: true })(SelfFetchForm);
